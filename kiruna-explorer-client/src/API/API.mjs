const SERVER_URL = "http://localhost:3000";

const logIn = async (credentials) => {
  const response = await fetch(SERVER_URL + "/api/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    const errDetails = await response.json();
    throw new Error(errDetails.message);
  }
};

const getUserInfo = async () => {
  const response = await fetch(SERVER_URL + "/api/sessions/current", {
    credentials: "include",
  });
  const user = await response.json();
  if (response.ok) {
    return user;
  } else {
    throw user; // an object with the error coming from the server
  }
};

const logOut = async () => {
  const response = await fetch(SERVER_URL + "/api/sessions/current", {
    method: "DELETE",
    credentials: "include",
  });
  if (response.ok) return null;
};

const addDocument = async (documentData) => {
  try {
    const response = await fetch(`${SERVER_URL}/api/documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: documentData.title,
        stakeholders: documentData.stakeholder,
        scale: documentData.scale,
        planNumber: documentData.planNumber,
        date: documentData.date,
        typeId: documentData.typeId,
        language: documentData.language,
        pages: documentData.pageNumber,
        description: documentData.description,
        areaId: documentData.areaId,
        links: documentData.links
      }),
      credentials: 'include'
    });

    if (!response.ok) {
      const errMessage = await response.json();
      throw new Error(`${errMessage.message || 'Error while creating the document.'}`);
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error("Error in addDocument function:", error.message);
    throw new Error(`${error.message || 'Error while creating the document.'}`);
  }
};

const getDocumentById = async (docid) => {
  try {
    const response = await fetch(`${SERVER_URL}/api/documents/${docid}`, {
      credentials: 'include'
    });

    if (!response.ok) {
      const errMessage = await response.json();
      throw new Error(`${errMessage.message || 'Error while creating the document.'}`);
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error("Error in getDocumentById function:", error.message);
    throw new Error(`${error.message || 'Error while creating the document.'}`);
  }
};

const getDocumentsFromArea = async (areaId) => {
  try {
    const response = await fetch(`${SERVER_URL}/api/documents/area/${areaId}`, {
      //credentials: 'include',
    });

    if (!response.ok) {
      const errMessage = await response.json();
      throw new Error(`${errMessage.message || 'Error while getting document from area.'}`);
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error("Error in get document from area function:", error.message);
    throw new Error(`${error.message || 'Error while getting document from area.'}`);
  }
};

const updateDocumentArea = async (docId, areaId) => {
  try {
    const response = await fetch(`${SERVER_URL}/api/documents/${docId}/area`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        newAreaId: areaId
      }),
      credentials: 'include'
    });

    if (!response.ok) {
      const errMessage = await response.json();
      throw new Error(`${errMessage.message || 'Error while updating area.'}`);
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error("Error in update area function:", error.message);
    throw new Error(`${error.message || 'Error while updating area.'}`);
  }
};

const getAllAreas = async () => {
  try {
    const response = await fetch(`${SERVER_URL}/api/areas`, {
    //  credentials: 'include',
    });

    if (!response.ok) {
      const errMessage = await response.json();
      throw new Error(`${errMessage.message || 'Error while getting areas.'}`);
    }

    const result = await response.json();

    const geoJsonresult = result.map((r) => {
      r.geoJson = JSON.parse(r.geoJson)
      return r
    });
    return geoJsonresult

  } catch (error) {
    console.error("Error in get all areas function:", error.message);
    throw new Error(`${error.message || 'Error while getting areas.'}`);
  }
};

const getAreaById = async (areaId) => {
  try {
    const response = await fetch(`${SERVER_URL}/api/areas/${areaId}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      const errMessage = await response.json();
      throw new Error(`${errMessage.message || 'Error while getting areas.'}`);
    }

    const result = await response.json();
    //console.log(result)
    const geoJsonresult = JSON.parse(result.geoJson)
    return geoJsonresult

  } catch (error) {
    console.error("Error in get all areas function:", error.message);
    throw new Error(`${error.message || 'Error while getting areas.'}`);
  }
};

const addArea = async (geoJson) => {

  try {
    const response = await fetch(`${SERVER_URL}/api/areas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ geoJson: JSON.stringify(geoJson) }),
      credentials: 'include'
    });

    if (!response.ok) {
      const errMessage = await response.json();
      throw new Error(`${errMessage.message || 'Error while adding Area.'}`);
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error("Error in addArea:", error.message);
    throw new Error(`${error.message || 'Error while adding Document.'}`);
  }
};

const getAllDocuments = async () => {
  try {
    const response = await fetch(`${SERVER_URL}/api/documents`, {
      credentials: 'include'
    });

    if (!response.ok) {
      const errMessage = await response.json();
      throw new Error(`${errMessage.message || 'Error while getting all documents.'}`);
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error("Error in getAllDocuments function:", error.message);
    throw new Error("Unable to get the documents. Please check your connection and try again.");
  }
};

const getFilteredDocuments = async (filters) => {
  try {
    // Build query parameters dynamically from the `filters` object
    const queryParams = new URLSearchParams();

    // Iterate through the filters object
    for (const key in filters) {
      const value = filters[key];
      if (value !== undefined && value !== null && value !== "" && value.length > 0) {
        if (Array.isArray(value)) {
          // Convert arrays to comma-separated strings for stakeholders
          queryParams.append(key, value.map(item => item.label).join(','));
        } else {
          queryParams.append(key, value);
        }
      }
    }

    // Make the fetch call
    const response = await fetch(`${SERVER_URL}/api/documents/filter?${queryParams.toString()}`, {
      method: 'GET',
      credentials: 'include', // Include cookies for authentication
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Check if the response is OK
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.error || 'Failed to fetch documents');
    }

    // Parse and return the response JSON
    const data = await response.json();
    //console.log(data)
    return data;
  } catch (error) {
    console.error('Error fetching filtered documents:', error);
    throw new Error(error.message || 'Failed to fetch documents');
  }
};

const getPaginatedFilteredDocuments = async (filters) => {
  try {
    // Build query parameters dynamically from the `filters` object
    const queryParams = new URLSearchParams();

    // Iterate through the filters object
    for (const key in filters) {
      const value = filters[key];
      if (value !== undefined && value !== null && value !== "" && value.length > 0) {
        if (Array.isArray(value)) {
          // Convert arrays to comma-separated strings for stakeholders
          queryParams.append(key, value.map(item => item.label).join(','));
        } else {
          queryParams.append(key, value);
        }
      }
    }

    // Make the fetch call
    const response = await fetch(`${SERVER_URL}/api/documents/filter/pagination?${queryParams.toString()}`, {
      method: 'GET',
      credentials: 'include', // Include cookies for authentication
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Check if the response is OK
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.error || 'Failed to fetch documents');
    }

    // Parse and return the response JSON
    const data = await response.json();
    //console.log(data)
    return data;
  } catch (error) {
    console.error('Error fetching filtered documents:', error);
    throw new Error(error.message || 'Failed to fetch documents');
  }
};


const addLink = async (link) => {
  try {
    const response = await fetch(`${SERVER_URL}/api/documents/link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        doc1Id: link.originalDocId,
        doc2Id: link.selectedDocId,
        connection: link.connectionType,
        date: link.date,
      }),
      credentials: 'include'
    });

    if (!response.ok) {
      const errMessage = await response.json();
      throw new Error(`Error ${response.status}: ${errMessage.message || 'Error while creating the connection.'}`);
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error("Error in addConnection function:", error.message);
    throw new Error("Unable to add the connection. Please check your connection and try again.");
  }
};

const addLinks = async (links) => {

  try {
    const response = await fetch(`${SERVER_URL}/api/documents/links`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        links: links
      }),
      credentials: 'include'
    });

    if (!response.ok) {
      const errMessage = await response.json();
      throw new Error(`Error ${response.status}: ${errMessage.message || 'Error while creating the connection.'}`);
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error("Error in addConnection function:", error.message);
    throw new Error("Unable to add the connection. Please check your connection and try again.");
  }
};

const getDocuemntLinks = async (docid) => {
  try {
    const response = await fetch(`${SERVER_URL}/api/documents/${docid}/links`, {
      credentials: 'include'
    });

    if (!response.ok) {
      const errMessage = await response.json();
      throw new Error(`Error ${response.status}: ${errMessage.message || 'Error while creating the document.'}`);
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error("Error in getDocumentById function:", error.message);
    throw new Error("Unable to get the document. Please check your connection and try again.");
  }
};


const deleteAll = async (id) => {

  try {
    const response = await fetch(`${SERVER_URL}/api/documents/${id}/links`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id
      }),
      credentials: 'include'
    });

    if (!response.ok) {
      const errMessage = await response.json();
      throw new Error(`Error ${response.status}: ${errMessage.message || 'Error while deleting the connections.'}`);
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error("Error in delete function:", error.message);
    throw new Error("Unable to delete the connections. Please check your connection and try again.");
  }
};

const uploadFile = async (id, formData) => {
  try {
    const response = await fetch(`${SERVER_URL}/api/documents/${id}/files`, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });

    const result = await response.json();

    if (response.ok) {
      return result;
    } else {
      throw new Error(result.error + "");
    }
  } catch (error) {
    console.error("Error uploading file: ", error);
    throw error;
  }
};

const getDocumentFiles = async (DocId) => {
  try {
    const response = await fetch(`${SERVER_URL}/api/documents/${DocId}/files`, {
      credentials: 'include'
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('File upload failed');
    }
  } catch (error) {
    console.error("Error fetching document files: ", error);
    throw error;
  }
};

const deleteFile = async (DocId, FileId) => {

  try {
    const response = await fetch(`${SERVER_URL}/api/documents/${DocId}/files/${FileId}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error);
    }
    else {
      return result
    }

  } catch (error) {
    console.error("Error deleting document file: ", error);
    throw error;
  }
};

const downloadFile = async (DocId, FileId, FilePath) => {

  try {
    const fileDownloadUrl = `${SERVER_URL}/api/documents/${DocId}/files/download/${FileId}`;  // Sostituisci con il percorso corretto dell'endpoint
    const response = await fetch(fileDownloadUrl, {
      method: 'GET', // Metodo GET per scaricare il file
      headers: {
        // Puoi aggiungere altre intestazioni se necessario, come un token di autorizzazione
        'Content-Type': 'application/octet-stream',
      },
      credentials: 'include',
    });



    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error);
    }

    // Ottieni il file come blob
    const blob = await response.blob();

    // Crea un URL per il blob
    const url = window.URL.createObjectURL(blob);

    // Crea un elemento <a> per avviare il download
    const a = document.createElement('a');
    a.href = url;
    a.download = FilePath.split('/').pop();  // Estrai il nome del file dal percorso
    document.body.appendChild(a);
    a.click();  // Avvia il download
    a.remove();  // Rimuovi il link temporaneo

    window.URL.revokeObjectURL(url);  // Libera la memoria del blob

  } catch (error) {
    console.error("Error downloading document file: ", error);
    throw error;  // Puoi gestire l'errore come preferisci
  }
};

const getAllTypes = async () => {
  try {
    const response = await fetch(`${SERVER_URL}/api/document-types`, {
      credentials: 'include'
    });

    if (!response.ok) {
      const errMessage = await response.json();
      throw new Error(`${errMessage.message || 'Error while getting all types.'}`);
    }

    const result = await response.json();
    //console.log(result)
    return result;

  } catch (error) {
    console.error("Error in getAllTypes function:", error.message);
    throw new Error("Unable to get the types. Please check your connection and try again.");
  }
};

const getAllStakeholders = async () => {
  try {
    const response = await fetch(`${SERVER_URL}/api/document-stakeholders`, {
      credentials: 'include'
    });

    if (!response.ok) {
      const errMessage = await response.json();
      throw new Error(`${errMessage.message || 'Error while getting all stakeholders.'}`);
    }

    const result = await response.json();
    //console.log(result)
    return result;

  } catch (error) {
    console.error("Error in getAllStakeholders function:", error.message);
    throw new Error("Unable to get the stakeholders. Please check your connection and try again.");
  }
};

const addType = async (TypeName) => {

  try {
    const response = await fetch(`${SERVER_URL}/api/document-types`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: (TypeName) }),
      credentials: 'include'
    });

    if (!response.ok) {
      const errMessage = await response.json();
      throw new Error(`${errMessage.message || 'Error while adding a new Type.'}`);
    }

    const result = await response.json();
    console.log("Result addType: " + result.typeId); //TypeId
    return result.typeId;

  } catch (error) {
    console.error("Error in addType:", error.message);
    throw new Error(`${error.message || 'Error while adding a new Type.'}`);
  }
};

const addNewStakeholders = async (stakeholders) => {

  try {
    const response = await fetch(`${SERVER_URL}/api/document-stakeholders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stakeholders: (stakeholders) }),
      credentials: 'include'
    });

    if (!response.ok) {
      const errMessage = await response.json();
      throw new Error(`${errMessage.message || 'Error while adding new stakeholders'}`);
    }

    const result = await response.json();
    console.log("Result addStakeholders: " + result); //StakeholdersId
    return result;

  } catch (error) {
    console.error("Error in addStakeholders:", error);
    throw new Error(`${error.message || 'Error while adding new stakeholders.'}`);
  }
};

const addStakeholdersToDocument = async (documentId, stakeholders) => {

  try {
    const response = await fetch(`${SERVER_URL}/api/document-stakeholders/${documentId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stakeholders: (stakeholders) }),
      credentials: 'include'
    });

    if (!response.ok) {
      const errMessage = await response.json();
      throw new Error(`${errMessage.message || 'Error while adding stakeholders to the specific document.'}`);
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error("Error in addStakeholdersToDocument:", error.message);
    throw new Error(`${error.message || 'Error stakeholders to the specific document.'}`);
  }
};

const getAllDiagramPositions = async () => {
  try {
    const response = await fetch(`${SERVER_URL}/api/documents/diagramPositions`, {
      //  credentials: 'include',
    });

    if (!response.ok) {
      const errMessage = await response.json();
      throw new Error(`${errMessage.message || 'Error while getting diagram positions.'}`);
    }

    return await response.json()

  } catch (error) {
    console.error("Error in get all diagram positions:", error.message);
    throw new Error(`${error.message || 'EError in get all diagram positions'}`);
  }
};

const postNewDiagramPosition = async (position) => {

  try {
    const response = await fetch(`${SERVER_URL}/api/documents/${position.docId}/diagramPosition`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        docId: position.docId,
        x: position.x,
        y: position.y
      }),
      credentials: 'include'
    });

    if (!response.ok) {
      const errMessage = await response.json();
      throw new Error(`${errMessage.message || 'Error while adding a new position.'}`);
    }

    const result = await response.json();
    return result.lastId;

  } catch (error) {
    console.error("Error in add position:", error.message);
    throw new Error(`${error.message || 'Error while adding a new position.'}`);
  }
};

const API = {
  logIn,
  getUserInfo,
  logOut,
  addDocument,
  getDocumentById,
  getDocumentsFromArea,
  updateDocumentArea,
  getAllAreas,
  getAreaById,
  addArea,
  addLink,
  getDocuemntLinks,
  getAllDocuments,
  getFilteredDocuments,
  getPaginatedFilteredDocuments,
  addLinks,
  deleteAll,
  uploadFile,
  getDocumentFiles,
  deleteFile,
  downloadFile,
  getAllTypes,
  getAllStakeholders,
  addType,
  addNewStakeholders,
  addStakeholdersToDocument,
  getAllDiagramPositions,
  postNewDiagramPosition
};

export default API;
