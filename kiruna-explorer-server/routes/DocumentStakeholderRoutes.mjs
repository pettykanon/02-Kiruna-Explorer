import express from 'express';
import { body, param, validationResult } from "express-validator";
import { isLoggedIn } from "../auth/authMiddleware.mjs";
const router = express.Router();
import { authorizeRoles } from "../auth/authMiddleware.mjs";
import StakeholderDAO from "../dao/StakeholderDAO.mjs";

const StakeholderDao = new StakeholderDAO();

router.post(
    "/",
    isLoggedIn,
    authorizeRoles('admin', 'urban_planner'),
    [
        body("stakeholders")
            .isArray()
            .withMessage("Stakeholders must be a non-empty array")
    ],
    async (req, res) => {
        console.log(req.body.stakeholders);
        const errors = validationResult(req);
        console.log(errors);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const array = req.body.stakeholders;

            // Recupera tutti gli stakeholder esistenti dal database
            const stakeholders = await StakeholderDao.getStakeholders();
            const existingStakeholders = stakeholders.reduce((acc, stakeholder) => {
                acc[stakeholder.name.toLowerCase()] = stakeholder.id;
                return acc;
            }, {});

            let id = [];
            let errors = [];

            for (const name of array) {
                const lowerName = name.toLowerCase();

                // Verifica se lo stakeholder esiste già
                if (existingStakeholders[lowerName]) {
                    // Aggiungi l'ID dell'esistente stakeholder all'array di ID
                    id.push(existingStakeholders[lowerName]);
                    continue; // Salta alla prossima iterazione
                }

                // Formatta il nome
                const formattedName = lowerName.replace(/\b\w/g, match => match.toUpperCase());

                try {
                    // Aggiungi lo stakeholder nuovo e ottieni l'ID
                    const newId = await StakeholderDao.addStakeholder(formattedName);
                    id.push(newId); // Aggiungi l'ID all'array
                } catch (err) {
                    errors.push({ name: formattedName, error: err.message });
                }
            }

            if (errors.length > 0) {
                return res.status(400).json({
                    message: "Some stakeholders could not be processed",
                    errors,
                    ids: id
                });
            }

            res.status(201).json({ ids: id });
        } catch (err) {
            console.error("Error adding stakeholder:", err);
            res.status(500).json({ error: "Internal server error", details: err.message });
        }
    }
);

router.get("/",
    async (req, res) => {
        try {
            const stakeholders = await StakeholderDao.getStakeholders();
            res.status(200).json(stakeholders);
        } catch (err) {
            console.error("Error fetching stakeholders:", err);
            res.status(500).json({ error: "Internal server error", details: err.message });
        }
    }
)

router.post("/:docId",
    isLoggedIn,
    authorizeRoles('admin', 'urban_planner'),
    [
        body("stakeholders")
            .isArray({ min: 1 })
            .withMessage("Stakeholders must be an array"),
        param("docId")
            .isNumeric()
            .withMessage("Document ID must be a valid number")
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const docId = req.params.docId;
            const stakeholders = req.body.stakeholders;
            console.log(stakeholders);
            // Add all stakeholders to the document by using the ids
            for (const stakeholderName of stakeholders) {
                const lowerName = stakeholderName.toLowerCase();
                const formattedName = lowerName.replace(/\b\w/g, match => match.toUpperCase());
                const stakeholder = await StakeholderDao.getStakeholderByName(formattedName);
                if (!stakeholder) {
                    
                    return res.status(404).json({ error: "Stakeholder not found" });
                }
                await StakeholderDao.addDocumentStakeholder(stakeholder.id, docId);
            }

            res.status(201).json({ message: "Stakeholders matched to document successfully" });
        } catch (err) {
            console.error("Error adding stakeholders to document:", err);
            res.status(500).json({ error: "Internal server error", details: err.message });
        }
    }
)

export default router;
