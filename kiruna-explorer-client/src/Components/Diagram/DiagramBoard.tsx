import { useTheme } from "../../contexts/ThemeContext.jsx";
import { Controls, MiniMap, ReactFlow, Background, type ColorMode, Edge } from "@xyflow/react";
import { useNodesState } from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import { useState, useEffect } from "react";
import CustomBackgroundNode from './CustomBackgroundNode';
import SingleNode from "./SingleNode";
import GroupNode from "./GroupNode";
import CustomEdge from "./CustomEdge";
import CloseNode from "./CustomCloseNode.js";
import React from "react";
import API from "../../API/API.mjs"
import { YScalePosition, getXDatePosition, getEquidistantPoints, getYPlanScale } from "../Utilities/DiagramReferencePositions.js";

type Node<Data = any> = {
    id: string;
    type?: string;
    data: Data;
    position: { x: number; y: number };
    draggable?: boolean;
    selectable?: boolean;
    connectable?: boolean;
    style?: React.CSSProperties;
};
export type Item = {
    docid: number;
    title: string;
    type: string;
    scale: string;
    year: string;
    month: string;
    planNumber: string | null;
};

export type DiagramItem = {
    items: Item[],
    x: number,
    y: number
}

const DiagramBoard = () => {
    const { isDarkMode } = useTheme();
    const [colorMode] = useState<ColorMode>(isDarkMode ? "dark" : "light");
    const [zoom, setZoom] = useState(1); // Add zoom state
    const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 1 }); // Add viewport state
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);
    const [clickedNode, setClickedNode] = useState<string | null>(null);
    const [documents, setDocuments] = useState<DiagramItem[] | []>([])
    const [links, setLinks] = useState<Edge[]>([])
    const [yearsRange, setYearsRange] = useState<number[]>([])
    const [nodes, setNodes] = useState<Node[]>([])

    const [nodeStates, setNodeStates] = useState<Record<number, string>>({});
    const [nodeisOpen, setNodeIsOpen] = useState<Record<string, boolean | string>>({});


    const setNodeSelected = (nodeindex: number, docselected: string) => {
        console.log(`setted ${nodeindex} to ${docselected}`)
        console.log(nodeStates)
        setNodeStates(prev => ({
            ...prev,
            [nodeindex]: docselected,
        }));
    };

    const setNodeOpen = (nodeindex: number, cancel?: boolean) => {
        if (nodeindex == 0) {
            setNodeIsOpen({})
        }
        else if (cancel) {
            setNodeIsOpen(prev => ({
                ...prev,
                [nodeindex]: "closed",
            }));
        }
        else {
            setNodeIsOpen(prev => ({
                ...prev,
                [nodeindex]: true,
            }));
        }

    };

    const distanceBetweenYears = 400;

    useEffect(() => {
        const getAllDocument = async () => {
            try {
                const docs = await API.getAllDocuments();
                console.log(docs)

                const yearsDoc = docs.map((doc) => {
                    let date = doc.date.split("-")
                    let year = date[0]
                    return parseInt(year)
                })
                const minYear = Math.min(...yearsDoc)
                const maxYear = Math.max(...yearsDoc)

                const yearsRange: number[] = []
                for (let y = minYear - 1; y <= maxYear + 3; y++) {
                    yearsRange.push(y)
                }
                setYearsRange(yearsRange)

                // Map documents to items
                const mappedItems = docs.map((doc) => {
                    let date = doc.date.split("-")
                    let year = date[0]
                    let month = date[1]
                    return { docid: doc.id, title: doc.title, type: doc.type, scale: doc.scale, year: year, month: month, planNumber: doc.planNumber };
                }).filter((i: Item) => i.scale !== null)

                //Group items by scale and date
                const groupedByScaleAndDate = mappedItems.reduce((acc: { [x: string]: any[]; }, item: Item) => {
                    const key = `${item.scale}${item.planNumber}_${item.year}_${item.month}`;
                    if (!acc[key]) {
                        acc[key] = [];
                    }
                    acc[key].push(item);
                    return acc;
                }, {} as Record<string, Item[]>);

                const docItems: DiagramItem[] = Object.entries(groupedByScaleAndDate).map((i: any[]) => {
                    const element = i[1][0]
                    let yoffset
                    if (element.month) {
                        const evenMonth = element.month % 2 == 0
                        yoffset = evenMonth ? 50 : -50
                    }
                    else {
                        yoffset = -100
                    }
                    let ypos
                    if (element.scale === "plan") {
                        ypos = getYPlanScale(element.planNumber)
                    }
                    else {
                        ypos = YScalePosition[element.scale]
                    }

                    return { items: i[1], x: getXDatePosition(yearsRange[0], element.year, element.month), y: yoffset + ypos }
                })

                setDocuments(docItems)

            } catch (err) {
                console.log(err)
            }
        }
        getAllDocument()
    }, [])
    /*
        useEffect(() => {
            if (zoom <= 1.1) setIsOpen(null)
            else if (zoom > 1.1 && clickedNode) setIsOpen(clickedNode)
        }, [zoom])*/

    const nodeTypes = {
        background: CustomBackgroundNode,
        singleNode: SingleNode,
        groupNode: GroupNode,
        closeNode: CloseNode
    };

    const edgeTypes = {
        custom: CustomEdge,
    };

    useEffect(() => {
        const getNodes = () => {
            const initialNodes = [
                {
                    id: '0',
                    type: 'background',
                    position: { x: 0, y: 0 },
                    data: { years: yearsRange, zoom: zoom, distanceBetweenYears: distanceBetweenYears },
                    draggable: false,
                    selectable: false,
                    connectable: false,
                    clickable: false,
                    style: { zIndex: -1 },
                },
                ...documents.flatMap((e, index: number) => {
                    const nodetype = e.items.length === 1 ? 'singleNode' : 'groupNode';

                    const nodeSelected = nodeStates[index] || e.items[0].docid;
                    console.log(`${index}:` + nodeisOpen[index])
                    if (zoom > 1.1 && nodetype === 'groupNode' && nodeisOpen[index] !== "closed") setNodeOpen(index)

                    if (nodeisOpen[index] === true && nodetype === 'groupNode') {
                        const positions = getEquidistantPoints(e.x, e.y, e.items.length == 2 ? 45 : 5 + e.items.length * 7, e.items.length);

                        const nodes = e.items.map((item: Item, index1: number) => ({
                            id: `${item.docid}`,
                            type: 'singleNode',
                            position: { x: positions[index1].x, y: positions[index1].y },
                            data: { clickedNode: clickedNode, group: [item], zoom: zoom, index: index },
                            draggable: false,
                        }));

                        const closeNode = {
                            id: `closeNode-${index}`,
                            type: 'closeNode',
                            position: { x: e.x + 10, y: e.y + 10 },
                            data: { zoom: zoom, index: index },
                            draggable: false,
                        };

                        return [...nodes, closeNode];
                    } else {
                        return {
                            id: `${nodeSelected}`,
                            type: nodetype,
                            position: { x: e.x, y: e.y },
                            data: { clickedNode: clickedNode, group: e.items, zoom: zoom, index: index, setNodeSelected: (id: number) => setNodeSelected(index, `${id}`) },
                            draggable: false,
                        };
                    }
                }),
            ]
            setNodes(initialNodes)
        }
        if (zoom <= 1.1) setNodeOpen(0)
        getNodes()
    }, [documents, clickedNode, zoom, nodeStates])

    useEffect(() => {
        const getLinks = async () => {
            const allLinks = nodes.flatMap((node, index: number) => {
                if (node.type === "background" || node.type === "closeNode") return [];

                const nodetype = node.data.group.length === 1 ? 'singleNode' : 'groupNode';
                return node.data.group.flatMap(async (elem: Item) => {
                    const docid = elem.docid
                    const docLinks = await API.getDocuemntLinks(docid)
                    if (docLinks.length === 0) return [];

                    const groupedLinks = docLinks.reduce((acc, linkitem) => {
                        if (!acc[linkitem.id]) {
                            acc[linkitem.id] = [];
                        }
                        acc[linkitem.id].push(`${linkitem.connection}`);
                        return acc;
                    }, {} as Record<string, Item[]>);

                    return Object.entries(groupedLinks).map((dl) => (
                        {
                            id: `l${docid}-${dl[0]}`,
                            source: `${docid}`,
                            target: `${dl[0]}`,
                            type: "custom",
                            data: { typesOfConnections: dl[1] }
                        }
                    ))
                })
            })
            const resolvedEdges = (await Promise.all(allLinks)).flat();
            setLinks(resolvedEdges)
        }
        getLinks()
    }, [nodes, nodeStates])

    const filteredEdges = links.filter(edge => edge.source === clickedNode || edge.source === hoveredNode);

    //boundaries
    const extent: [[number, number], [number, number]] = [
        [0, 0],
        [distanceBetweenYears * yearsRange.length < 1920 * 2 ? 1920 * 2 : distanceBetweenYears * yearsRange.length, 2160]
    ];

    return (
        <div className={`${isDarkMode ? "dark" : "light"} w-screen h-screen`}>
            <ReactFlow
                nodes={nodes}
                edges={filteredEdges}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                colorMode={colorMode}
                nodeExtent={extent}
                translateExtent={extent}
                onNodeClick={(event, node) => {
                    if (node.type === "closeNode") {
                        console.log("chiudi")
                        setNodeOpen(node.data.index, true)
                        setClickedNode((clickedNode === node.id || node.id == "0") ? null : node.id);
                    } else {
                        setClickedNode((clickedNode === node.id || node.id == "0") ? null : node.id);
                        if (clickedNode != node.id && node.type !== "groupNode") {
                            setNodeSelected(node.data.index, node.id)
                        }
                        if (node.type === "groupNode") {
                            if (zoom <= 1) {
                                setNodeOpen(0)
                            }
                            else if (clickedNode == node.id) {
                                setNodeOpen(node.data.index, true)
                            }
                            else {
                                setNodeOpen(node.data.index)
                            }
                        }
                    }
                }}
                onNodeMouseEnter={(event, node) => {
                    event.preventDefault();
                    setHoveredNode(node.id != "0" ? node.id : null);
                }}
                onMoveEnd={(event, viewport) => {
                    setZoom(viewport.zoom);
                    setViewport(viewport);

                }}
            >
                <Background gap={20} size={1} color={isDarkMode ? "#333" : "#ccc"} />
                <MiniMap className="opacity-70" />
            </ReactFlow>

            <div
                className={`fixed w-full bg-black_text dark:bg-white_text h-[1px] top-3 text-black_text dark:text-white_text transition`}>
                {yearsRange.map((year, index) => (
                    <div
                        key={year}
                        className="absolute transform -translate-x-1/2 -translate-y-1/4 pt-2 flex flex-col gap-1 justify-content-center align-items-center transition"
                        style={{ left: `${index * 400 * zoom + (viewport?.x || 0)}px` }}
                    >
                        <div className="w-2 h-2 bg-black_text dark:bg-white_text rounded-full transition"
                            style={{ transform: `scale(${zoom})` }}></div>
                        <div style={{ transform: `scale(${zoom}) ${index == 0 ? "translateX(25px)" : ""}` }}
                            className="transition">{year}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DiagramBoard;

/*
onNodeMouseEnter={(event, node) => {
    event.preventDefault();
    setHoveredNode(node.id);
    filterEdges();
}}
onNodeMouseLeave={() => setHoveredNode(null)}
onMoveEnd={(event, viewport) => {
    setZoom(viewport.zoom);
    setViewport(viewport);
}} */