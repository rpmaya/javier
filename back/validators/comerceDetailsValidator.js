const { body, param } = require("express-validator");
const Comerce = require("../models/nosql/comerce");

const createComerceDetailsValidator = [
    body("id_comercio")
        .notEmpty().withMessage("El ID del comercio es obligatorio")
        .isMongoId().withMessage("ID del comercio debe ser un ID válido")
        .custom(async (id_comercio) => {
            const comerceExists = await Comerce.findById(id_comercio);
            if (!comerceExists) {
                throw new Error('El comercio especificado no existe');
            }
            return true;
        }),
    body("Ciudad").isString().withMessage("Ciudad debe ser una cadena de texto").notEmpty(),
    body("Actividad").isString().withMessage("Actividad debe ser una cadena de texto").notEmpty(),
    body("Título").isString().withMessage("Título debe ser una cadena de texto").notEmpty(),
    body("Resumen").isString().withMessage("Resumen debe ser una cadena de texto").notEmpty(),
    body("textos").optional().isArray().withMessage("textos debe ser un array de cadenas de texto"),
    body("imágenes").optional().isArray().withMessage("imágenes debe ser un array de cadenas de texto"),
    body("reseñasUsuarios.scoring").optional().isFloat({ min: 0, max: 5 }).withMessage("Scoring debe estar entre 0 y 5"),
    body("reseñasUsuarios.numeroPuntuacionesTotales").optional().isInt({ min: 0 }).withMessage("Número de puntuaciones totales debe ser un entero positivo"),
    body("reseñasUsuarios.reseñas").optional().isArray().withMessage("Reseñas debe ser un array de cadenas de texto")
];

// Validador para obtener, archivar y eliminar por ID
const idParamValidator = [
    param("id").isMongoId().withMessage("ID debe ser un Mongo ID válido")
];

// Validador para actualizar una página web
const updateComerceDetailsValidator = [
    param("id").isMongoId().withMessage("ID debe ser un Mongo ID válido"),
    body("id_comercio")
        .optional()
        .isMongoId().withMessage("ID del comercio debe ser un ID válido")
        .custom(async (id_comercio) => {
            const comerceExists = await Comerce.findById(id_comercio);
            if (!comerceExists) {
                throw new Error('El comercio especificado no existe');
            }
            return true;
        }),
    body("Ciudad").optional().isString().withMessage("Ciudad debe ser una cadena de texto")
        .custom((value, { req }) => {
            if (req.user && req.user.role === 'user') {
                throw new Error('No tienes permiso para modificar la ciudad');
            }
            return true;
        }),
    body("Actividad").optional().isString().withMessage("Actividad debe ser una cadena de texto")
        .custom((value, { req }) => {
            if (req.user && req.user.role === 'user') {
                throw new Error('No tienes permiso para modificar la actividad');
            }
            return true;
        }),
    body("Título").optional().isString().withMessage("Título debe ser una cadena de texto")
        .custom((value, { req }) => {
            if (req.user && req.user.role === 'user') {
                throw new Error('No tienes permiso para modificar el título');
            }
            return true;
        }),
    body("Resumen").optional().isString().withMessage("Resumen debe ser una cadena de texto")
        .custom((value, { req }) => {
            if (req.user && req.user.role === 'user') {
                throw new Error('No tienes permiso para modificar el resumen');
            }
            return true;
        }),
    body("textos").optional().isArray().withMessage("textos debe ser un array de cadenas de texto")
        .custom((value, { req }) => {
            if (req.user && req.user.role === 'user') {
                throw new Error('No tienes permiso para modificar los textos');
            }
            return true;
        }),
    body("imágenes").optional().isArray().withMessage("imágenes debe ser un array de cadenas de texto")
        .custom((value, { req }) => {
            if (req.user && req.user.role === 'user') {
                throw new Error('No tienes permiso para modificar las imágenes');
            }
            return true;
        }),
    body("reseñasUsuarios.scoring").custom((value, { req }) => {
        if (req.user && req.user.role === 'merchant') {
            throw new Error('No tienes permiso para modificar el scoring');
        }
        return true;
    }),
    body("reseñasUsuarios.numeroPuntuacionesTotales").custom((value, { req }) => {
        if (req.user && req.user.role === 'merchant') {
            throw new Error('No tienes permiso para modificar el número de puntuaciones');
        }
        return true;
    }),
    body("reseñasUsuarios.reseñas").custom((value, { req }) => {
        // Los merchants no pueden modificar las reseñas, pero los users y admins sí
        if (req.user && req.user.role === 'merchant') {
            throw new Error('No tienes permiso para modificar las reseñas');
        }
        return true;
    })
];

module.exports = {
    createComerceDetailsValidator,
    idParamValidator,
    updateComerceDetailsValidator
};
