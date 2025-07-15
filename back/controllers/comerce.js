const { comerceModel } = require('../models');
const jwt = require('jsonwebtoken');

const getItems = async (req, res) => {
    try {
        const data = await comerceModel.find({});
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al obtener los comercios', 
            error: error.message 
        });
    }
};

const getItem = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await comerceModel.findById(id);
        if (!data) {
            return res.status(404).json({ message: 'Comercio no encontrado' });
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al obtener el comercio', 
            error: error.message 
        });
    }
};

const createItem = async (req, res) => {
    try {
        const { 
            Nombre_del_comercio, 
            CIF, 
            Direccion, 
            email, 
            Telefono_de_contacto 
        } = req.body;

        const newComerce = new comerceModel({
            Nombre_del_comercio,
            CIF,
            Direccion,
            email,
            Telefono_de_contacto
        });

        const savedComerce = await newComerce.save();
        res.status(201).json(savedComerce);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ 
                message: 'El email ya existe en la base de datos' 
            });
        }
        res.status(500).json({ 
            message: 'Error al crear el comercio', 
            error: error.message 
        });
    }
};

const updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { body } = req;
        const data = await comerceModel.findByIdAndUpdate(id, body, { new: true });
        if (!data) {
            return res.status(404).json({ message: 'Comercio no encontrado' });
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al actualizar el comercio', 
            error: error.message 
        });
    }
};

const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await comerceModel.findByIdAndDelete(id);
        if (!data) {
            return res.status(404).json({ message: 'Comercio no encontrado' });
        }
        res.status(200).json({ 
            message: 'Comercio eliminado exitosamente', 
            comercio: data 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al eliminar el comercio', 
            error: error.message 
        });
    }
};

// Nuevas funciones para las rutas específicas
const getComerceByCIF = async (req, res) => {
    try {
        const { cif } = req.params;
        const comercio = await comerceModel.findOne({ CIF: cif });
        
        if (!comercio) {
            return res.status(404).json({ message: 'Comercio no encontrado' });
        }
        
        res.status(200).json({ 
            message: 'Comercio encontrado exitosamente', 
            comercio 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al obtener el comercio', 
            error: error.message 
        });
    }
};

const updateComerceByCIF = async (req, res) => {
    try {
        const { cif } = req.params;
        const comercio = await comerceModel.findOneAndUpdate(
            { CIF: cif }, 
            req.body, 
            { new: true }
        );
        
        if (!comercio) {
            return res.status(404).json({ message: 'Comercio no encontrado' });
        }
        
        res.status(200).json({ 
            message: 'Comercio actualizado exitosamente', 
            comercio 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al actualizar el comercio', 
            error: error.message 
        });
    }
};

const deleteComerceByCIF = async (req, res) => {
    try {
        const { cif } = req.params;
        const comercio = await comerceModel.findOneAndDelete({ CIF: cif });
        
        if (!comercio) {
            return res.status(404).json({ message: 'Comercio no encontrado' });
        }
        
        res.status(200).json({ 
            message: 'Comercio eliminado exitosamente', 
            comercio 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al eliminar el comercio', 
            error: error.message 
        });
    }
};

const getComercesOrderedByCIF = async (req, res) => {
    try {
        const comercios = await comerceModel.find({}).sort({ CIF: "asc" });
        res.status(200).json(comercios);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al obtener los comercios', 
            error: error.message 
        });
    }
};

const getAllComerces = async (req, res) => {
    try {
        const comercios = await comerceModel.find({});
        res.status(200).json(comercios);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al obtener los comercios', 
            error: error.message 
        });
    }
};

const deleteCommerceById = async (req, res) => {
    try {
        const { comercioId } = req.params;
        const comercio = await comerceModel.findByIdAndDelete(comercioId);
        
        if (!comercio) {
            return res.status(404).json({ message: 'Comercio no encontrado' });
        }
        
        res.status(200).json({ 
            message: 'Comercio eliminado exitosamente', 
            comercio 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al eliminar el comercio', 
            error: error.message 
        });
    }
};

module.exports = { 
    getItems, 
    getItem, 
    createItem, 
    updateItem, 
    deleteItem,
    getComerceByCIF,
    updateComerceByCIF,
    deleteComerceByCIF,
    getComercesOrderedByCIF,
    getAllComerces,
    deleteCommerceById
};
