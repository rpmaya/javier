const ComercioDetails = require("../models/nosql/comerceDetails");
const Comerce = require("../models/nosql/comerce"); // Add this import
const { validationResult } = require("express-validator");

// Función para manejar errores de validación
const handleValidationErrors = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation failed");
        error.status = 400;
        error.details = errors.array();
        throw error;
    }
};

// Visitar una página web por su ID
const getComerceDetailsById = async (req, res, next) => {
    try {
        handleValidationErrors(req);
        const { id } = req.params;
        const comercio = await ComercioDetails.findOne({ _id: id, isArchived: false });
        if (!comercio) {
            return res.status(404).json({ message: "Comercio no encontrado" });
        }
        res.json(comercio);
    } catch (error) {
        next(error);
    }
};

// Crear una nueva página web
const createComerceDetails = async (req, res, next) => {
    try {
        handleValidationErrors(req);
        const newComercio = new ComercioDetails(req.body);
        const savedComercio = await newComercio.save();
        res.status(201).json(savedComercio);
    } catch (error) {
        next(error);
    }
};

// Modificar una página web
const updateComerceDetails = async (req, res, next) => {
    try {
        handleValidationErrors(req);
        const { id } = req.params;
        
        // Find existing document first
        const existingComercio = await ComercioDetails.findById(id);
        if (!existingComercio) {
            return res.status(404).json({ message: "Comercio no encontrado o está archivado" });
        }

        // If id_comercio is provided in update, verify it exists
        if (req.body.id_comercio) {
            const comerceExists = await Comerce.findById(req.body.id_comercio);
            if (!comerceExists) {
                return res.status(400).json({ message: "El comercio especificado no existe" });
            }
        }

        const updatedComercio = await ComercioDetails.findOneAndUpdate(
            { _id: id, isArchived: false },
            req.body,
            { new: true }
        );

        res.json(updatedComercio);
    } catch (error) {
        next(error);
    }
};

// Archivar una página web (Borrado lógico)
const archiveComerceDetails = async (req, res, next) => {
    try {
        handleValidationErrors(req);
        const { id } = req.params;
        const archivedComercio = await ComercioDetails.findOneAndUpdate(
            { _id: id, isArchived: false },
            { isArchived: true },
            { new: true }
        );
        if (!archivedComercio) {
            return res.status(404).json({ message: "Comercio no encontrado o ya está archivado" });
        }
        res.json({ message: "Comercio archivado exitosamente" });
    } catch (error) {
        next(error);
    }
};

// Eliminar una página web (Borrado físico)
const deleteComerceDetails = async (req, res, next) => {
    try {
        handleValidationErrors(req);
        const { id } = req.params;
        const deletedComercio = await ComercioDetails.findByIdAndDelete(id);
        if (!deletedComercio) {
            return res.status(404).json({ message: "Comercio no encontrado" });
        }
        res.json({ message: "Comercio eliminado físicamente exitosamente" });
    } catch (error) {
        next(error);
    }
};
const getAllComerceDetails = async (req, res) => {
    try {
        const comerceDetails = await ComercioDetails.find({ isArchived: false });
        res.status(200).json(comerceDetails);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las páginas web", error: error.message });
    }
};
const getComerceDetailsByMerchant = async (req, res) => {
    try {
        const { id_merchant } = req.params;
        const comerceDetails = await ComercioDetails.find({ 
            id_merchant,
            isArchived: false 
        });

        if (!comerceDetails || comerceDetails.length === 0) {
            return res.status(404).json({ 
                message: "No se encontraron páginas web para este comerciante" 
            });
        }

        res.status(200).json(comerceDetails);
    } catch (error) {
        res.status(500).json({ 
            message: "Error al obtener las páginas web", 
            error: error.message 
        });
    }
};
const getComerceDetailsByActivity = async (req, res) => {
    try {
        const { actividad } = req.params;
        const comerceDetails = await ComercioDetails.find({ 
            Actividad: { $regex: new RegExp(actividad, 'i') },
            isArchived: false 
        });

        if (!comerceDetails || comerceDetails.length === 0) {
            return res.status(404).json({ 
                message: `No se encontraron comercios con la actividad: ${actividad}` 
            });
        }

        res.status(200).json(comerceDetails);
    } catch (error) {
        res.status(500).json({ 
            message: "Error al obtener los comercios", 
            error: error.message 
        });
    }
};

const getComerceDetailsByScoring = async (req, res) => {
    try {
        const { order } = req.params;
        const sortOrder = order === 'asc' ? 1 : -1;

        const comerceDetails = await ComercioDetails.find({ isArchived: false })
            .sort({ 'reseñasUsuarios.scoring': sortOrder });

        if (!comerceDetails || comerceDetails.length === 0) {
            return res.status(404).json({ 
                message: "No se encontraron comercios" 
            });
        }

        res.status(200).json(comerceDetails);
    } catch (error) {
        res.status(500).json({ 
            message: "Error al obtener los comercios", 
            error: error.message 
        });
    }
};

// Add to your exports
module.exports = {
    getComerceDetailsById,
    createComerceDetails,
    updateComerceDetails,
    archiveComerceDetails,
    deleteComerceDetails,
    getAllComerceDetails,
    getComerceDetailsByMerchant,
    getComerceDetailsByActivity,
    getComerceDetailsByScoring
};
