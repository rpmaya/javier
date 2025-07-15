const User = require('../models/nosql/User');
const jwt = require('jsonwebtoken');

// Crear un nuevo usuario
// Inside createUser function
const createUser = async (req, res) => {
    try {
        const { Nombre, email, Password, Edad, Ciudad, Intereses, PermiteRecibirOfertas, Role } = req.body;
        
        // Update role validation
        if (Role && !['user', 'merchant'].includes(Role)) {
            return res.status(400).json({ message: 'Rol no válido.' });
        }

        const newUser = new User({
            Nombre,
            email,
            Password,
            Edad,
            Ciudad,
            Intereses,
            PermiteRecibirOfertas,
            Role: Role || 'user' // Default to 'user' if not specified
        });
        
        // Guarda el usuario en la base de datos
        const savedUser = await newUser.save();
        
        // No devolver la contraseña en la respuesta
        const userResponse = savedUser.toObject();
        delete userResponse.Password;
        
        res.status(201).json(userResponse);
    } catch (error) {
        console.log(error);
        if (error.code === 11000) { // Error de duplicación (E-mail único)
            return res.status(400).json({ message: 'El correo electrónico ya está en uso.' });
        }
        res.status(500).json({ message: 'Error al crear el usuario.', error: error.message });
    }
};

// Obtener todos los usuarios
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-Password'); // Excluir la contraseña
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los usuarios.', error: error.message });
    }
};
// Obtener un usuario por ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-Password');
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el usuario.', error: error.message });
    }
};
const getUsersByOffersAndCity = async (req, res) => {
    try {
        const { ciudad } = req.params;
        console.log('Searching for city:', ciudad); // Debug log

        const users = await User.find({
            Ciudad: { $regex: new RegExp(ciudad, 'i') }, // Case insensitive search
            PermiteRecibirOfertas: true
        }).select('-Password');

        if (!users || users.length === 0) {
            return res.status(404).json({ 
                message: `No se encontraron usuarios en ${ciudad} que permitan recibir ofertas.`
            });
        }

        console.log('Users found:', users.length); // Debug log
        res.status(200).json(users);
    } catch (error) {
        console.error('Error in getUsersByOffersAndCity:', error); // Debug log
        res.status(500).json({ 
            message: 'Error al obtener los usuarios.', 
            error: error.message 
        });
    }
};
// Actualizar un usuario
const updateUser = async (req, res) => {
    try {
        const updates = { ...req.body };
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }
        
        Object.keys(updates).forEach(key => {
            if (key !== 'Role') {
                user[key] = updates[key];
            }
        });
        
        const updatedUser = await user.save();
        const userResponse = updatedUser.toObject();
        delete userResponse.Password;
        
        res.status(200).json(userResponse);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'El correo electrónico ya está en uso.' });
        }
        res.status(500).json({ message: 'Error al actualizar el usuario.', error: error.message });
    }
};

// Eliminar un usuario
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id).select('-Password');
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }
        res.status(200).json({ message: 'Usuario eliminado exitosamente.', user });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el usuario.', error: error.message });
    }
};

// Login de usuario
const loginUser = async (req, res) => {
    try {
        const { email, Password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const isPasswordValid = await user.comparePassword(Password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const tokenPayload = {
            userId: user._id,
            email: user.email,
            role: user.Role,
            isMerchant: user.Role === 'merchant'
        };

        const token = jwt.sign(
            tokenPayload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        const userResponse = user.toObject();
        delete userResponse.Password;

        res.status(200).json({
            message: 'Login exitoso',
            user: userResponse,
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Error en el login', error: error.message });
    }
};

// Verificar rol de admin
const checkAdminRole = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const isAdmin = decoded.role === 'admin';

        res.json({ isAdmin });
    } catch (error) {
        res.status(401).json({ message: 'Invalid token', error: error.message });
    }
};

// Verificar rol de merchant
const checkMerchantRole = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const isMerchant = decoded.role === 'merchant';

        res.json({ isMerchant });
    } catch (error) {
        res.status(401).json({ message: 'Invalid token', error: error.message });
    }
};
module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    loginUser,
    checkAdminRole,
    checkMerchantRole,
    getUsersByOffersAndCity  // Add the new function to exports
};