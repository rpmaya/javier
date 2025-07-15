const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/jwt");
const checkRol = require("../middleware/rol");
const comproceDetailsController = require("../controllers/comerceDetailsController");
const validators = require("../validators/comerceDetailsValidator");

/**
 * @swagger
 * tags:
 *   name: Commerce Details
 *   description: Gestión de páginas web de comercios
 */

/**
 * @swagger
 * /commerce-details:
 *   get:
 *     summary: Obtener todas las páginas web de comercio
 *     tags: [Commerce Details]
 *     responses:
 *       200:
 *         description: Lista de todas las páginas web
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CommerceDetails'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Ruta para obtener todas las páginas web
router.get("/", comproceDetailsController.getAllComerceDetails);

/**
 * @swagger
 * /commerce-details/sort/scoring/{order}:
 *   get:
 *     summary: Obtener páginas web ordenadas por puntuación
 *     tags: [Commerce Details]
 *     parameters:
 *       - in: path
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         required: true
 *         description: Orden de clasificación (asc para ascendente, desc para descendente)
 *     responses:
 *       200:
 *         description: Lista de páginas web ordenadas por puntuación
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CommerceDetails'
 *       400:
 *         description: Parámetro de orden inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Move specific routes before the generic ID route
// Add this new route with other GET routes
router.get("/sort/scoring/:order", comproceDetailsController.getComerceDetailsByScoring);

/**
 * @swagger
 * /commerce-details/activity/{actividad}:
 *   get:
 *     summary: Obtener páginas web por actividad comercial
 *     tags: [Commerce Details]
 *     parameters:
 *       - in: path
 *         name: actividad
 *         schema:
 *           type: string
 *         required: true
 *         description: Tipo de actividad comercial
 *     responses:
 *       200:
 *         description: Lista de páginas web de la actividad especificada
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CommerceDetails'
 *       404:
 *         description: No se encontraron páginas web para esta actividad
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/activity/:actividad", comproceDetailsController.getComerceDetailsByActivity);

/**
 * @swagger
 * /commerce-details/merchant/{id_merchant}:
 *   get:
 *     summary: Obtener páginas web por comerciante
 *     tags: [Commerce Details]
 *     parameters:
 *       - in: path
 *         name: id_merchant
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del comerciante
 *     responses:
 *       200:
 *         description: Lista de páginas web del comerciante especificado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CommerceDetails'
 *       404:
 *         description: No se encontraron páginas web para este comerciante
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/merchant/:id_merchant", comproceDetailsController.getComerceDetailsByMerchant);

/**
 * @swagger
 * /commerce-details/{id}:
 *   get:
 *     summary: Obtener página web por ID
 *     tags: [Commerce Details]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la página web
 *     responses:
 *       200:
 *         description: Página web encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommerceDetails'
 *       404:
 *         description: Página web no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Generic ID route should come after specific routes
router.get("/:id", validators.idParamValidator, comproceDetailsController.getComerceDetailsById);

/**
 * @swagger
 * /commerce-details:
 *   post:
 *     summary: Crear una nueva página web de comercio
 *     tags: [Commerce Details]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ciudad
 *               - actividad
 *               - titulo
 *               - resumen
 *               - textos
 *               - fotos
 *               - id_merchant
 *             properties:
 *               ciudad:
 *                 type: string
 *                 description: Ciudad donde opera el comercio
 *               actividad:
 *                 type: string
 *                 description: Tipo de actividad comercial
 *               titulo:
 *                 type: string
 *                 description: Título de la página web
 *               resumen:
 *                 type: string
 *                 description: Resumen descriptivo de la página web
 *               textos:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Textos descriptivos adicionales
 *               fotos:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: URLs de las imágenes
 *               scoring:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 5
 *                 description: Puntuación de la página web (0-5)
 *               numeroReviews:
 *                 type: number
 *                 minimum: 0
 *                 description: Número de reseñas
 *               id_merchant:
 *                 type: string
 *                 description: ID del comerciante propietario
 *     responses:
 *       201:
 *         description: Página web creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommerceDetails'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado - Requiere rol admin o merchant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Ruta para crear una nueva página web
router.post(
    "/",
    authMiddleware,
    checkRol(['admin', 'merchant']),
    validators.createComerceDetailsValidator,
    comproceDetailsController.createComerceDetails
);

/**
 * @swagger
 * /commerce-details/{id}:
 *   put:
 *     summary: Actualizar página web de comercio
 *     tags: [Commerce Details]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la página web a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ciudad:
 *                 type: string
 *               actividad:
 *                 type: string
 *               titulo:
 *                 type: string
 *               resumen:
 *                 type: string
 *               textos:
 *                 type: array
 *                 items:
 *                   type: string
 *               fotos:
 *                 type: array
 *                 items:
 *                   type: string
 *               scoring:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 5
 *               numeroReviews:
 *                 type: number
 *                 minimum: 0
 *     responses:
 *       200:
 *         description: Página web actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommerceDetails'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado - Requiere rol admin o merchant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Página web no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Ruta para modificar una página web
router.put(
    "/:id",
    authMiddleware,
    checkRol(['admin', 'merchant', 'user']),
    validators.updateComerceDetailsValidator,
    comproceDetailsController.updateComerceDetails
);

/**
 * @swagger
 * /commerce-details/{id}/archive:
 *   patch:
 *     summary: Archivar página web (borrado lógico)
 *     tags: [Commerce Details]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la página web a archivar
 *     responses:
 *       200:
 *         description: Página web archivada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de confirmación
 *                 archivedItem:
 *                   $ref: '#/components/schemas/CommerceDetails'
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado - Requiere rol admin o merchant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Página web no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Ruta para archivar una página web (borrado lógico)
router.patch(
    "/:id/archive",
    authMiddleware,
    checkRol(['admin', 'merchant']),
    validators.idParamValidator,
    comproceDetailsController.archiveComerceDetails
);

/**
 * @swagger
 * /commerce-details/delete/{id}:
 *   delete:
 *     summary: Eliminar página web permanentemente (borrado físico)
 *     tags: [Commerce Details]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la página web a eliminar permanentemente
 *     responses:
 *       200:
 *         description: Página web eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de confirmación
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado - Solo administradores
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Página web no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Ruta para eliminar una página web (borrado físico)
router.delete(
    "/delete/:id",
    authMiddleware,
    checkRol(['admin']),
    validators.idParamValidator,
    comproceDetailsController.deleteComerceDetails
);


module.exports = router;
