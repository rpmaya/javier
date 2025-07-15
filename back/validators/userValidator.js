const { body } = require('express-validator');
const User = require('../models/nosql/User');

const userRegistrationValidator = [
    body('Nombre')
        .notEmpty().withMessage('El nombre es obligatorio')
        .isString().withMessage('El nombre debe ser una cadena de texto'),
    body('email')
        .isEmail().withMessage('Debe ser un correo electrónico válido')
        .normalizeEmail()
        .custom(async (email) => {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new Error('Este correo electrónico ya está registrado');
            }
            return true;
        }),
    body('Password')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('Edad')
        .isInt({ min: 0 }).withMessage('La edad debe ser un número positivo'),
    body('Ciudad')
        .notEmpty().withMessage('La ciudad es obligatoria')
        .isString().withMessage('La ciudad debe ser una cadena de texto'),
    body('Intereses')
        .isArray().withMessage('Los intereses deben ser un arreglo')
        .optional(),
    body('PermiteRecibirOfertas')
        .isBoolean().withMessage('PermiteRecibirOfertas debe ser un booleano')
        .optional(),
];

const userUpdateValidator = [
    body('Nombre')
        .optional()
        .isString().withMessage('El nombre debe ser una cadena de texto'),
    body('email')
        .optional()
        .isEmail().withMessage('Debe ser un correo electrónico válido')
        .normalizeEmail(),
    body('Password')
        .optional()
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('Edad')
        .optional()
        .isInt({ min: 0 }).withMessage('La edad debe ser un número positivo'),
    body('Ciudad')
        .optional()
        .isString().withMessage('La ciudad debe ser una cadena de texto'),
    body('Intereses')
        .optional()
        .isArray().withMessage('Los intereses deben ser un arreglo'),
    body('PermiteRecibirOfertas')
        .optional()
        .isBoolean().withMessage('PermiteRecibirOfertas debe ser un booleano'),
];

module.exports = {
    userRegistrationValidator,
    userUpdateValidator,
};