const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/jwt");
const checkRol = require("../middleware/rol");
const { 
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
} = require("../controllers/comerce");

/**
 * @swagger
 * tags:
 *   name: Commerce
 *   description: Gestión de comercios del sistema
 */

/**
 * @swagger
 * /commerce:
 *   get:
 *     summary: Obtener todos los comercios
 *     tags: [Commerce]
 *     responses:
 *       200:
 *         description: Lista de todos los comercios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Commerce'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Rutas básicas CRUD
router.get("/", getItems);

/**
 * @swagger
 * /commerce/{id}:
 *   get:
 *     summary: Obtener comercio por ID
 *     tags: [Commerce]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del comercio
 *     responses:
 *       200:
 *         description: Comercio encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Commerce'
 *       404:
 *         description: Comercio no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", getItem);

/**
 * @swagger
 * /commerce:
 *   post:
 *     summary: Crear un nuevo comercio
 *     tags: [Commerce]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - cif
 *               - address
 *               - email
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del comercio
 *               cif:
 *                 type: string
 *                 description: CIF del comercio
 *               address:
 *                 type: string
 *                 description: Dirección del comercio
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email del comercio
 *               phone:
 *                 type: string
 *                 description: Teléfono del comercio
 *     responses:
 *       201:
 *         description: Comercio creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Commerce'
 *       400:
 *         description: Error de validación
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
 */
router.post("/", authMiddleware, checkRol(['admin']), createItem);

/**
 * @swagger
 * /commerce/{id}:
 *   put:
 *     summary: Actualizar comercio
 *     tags: [Commerce]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del comercio
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               cif:
 *                 type: string
 *               address:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comercio actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Commerce'
 *       404:
 *         description: Comercio no encontrado
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
 */
router.put("/:id", authMiddleware, checkRol(['admin']), updateItem);

/**
 * @swagger
 * /commerce/{id}:
 *   delete:
 *     summary: Eliminar comercio
 *     tags: [Commerce]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del comercio a eliminar
 *     responses:
 *       200:
 *         description: Comercio eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de confirmación
 *       404:
 *         description: Comercio no encontrado
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
 */
router.delete("/:id", authMiddleware, checkRol(['admin']), deleteItem);

/**
 * @swagger
 * /commerce/cif/{cif}:
 *   get:
 *     summary: Obtener comercio por CIF
 *     tags: [Commerce]
 *     parameters:
 *       - in: path
 *         name: cif
 *         schema:
 *           type: string
 *         required: true
 *         description: CIF del comercio
 *     responses:
 *       200:
 *         description: Comercio encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Commerce'
 *       404:
 *         description: Comercio no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Rutas específicas por CIF
router.get('/cif/:cif', getComerceByCIF);

/**
 * @swagger
 * /commerce/cif/{cif}:
 *   put:
 *     summary: Actualizar comercio por CIF
 *     tags: [Commerce]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cif
 *         schema:
 *           type: string
 *         required: true
 *         description: CIF del comercio
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comercio actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Commerce'
 *       404:
 *         description: Comercio no encontrado
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
 */
router.put('/cif/:cif', authMiddleware, checkRol(['admin']), updateComerceByCIF);

/**
 * @swagger
 * /commerce/cif/{cif}:
 *   delete:
 *     summary: Eliminar comercio por CIF
 *     tags: [Commerce]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cif
 *         schema:
 *           type: string
 *         required: true
 *         description: CIF del comercio a eliminar
 *     responses:
 *       200:
 *         description: Comercio eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de confirmación
 *       404:
 *         description: Comercio no encontrado
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
 */
router.delete('/cif/:cif', authMiddleware, checkRol(['admin']), deleteComerceByCIF);

/**
 * @swagger
 * /commerce/all:
 *   get:
 *     summary: Obtener todos los comercios (ruta alternativa)
 *     tags: [Commerce]
 *     responses:
 *       200:
 *         description: Lista de todos los comercios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Commerce'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Rutas adicionales
router.get('/all', getAllComerces);

/**
 * @swagger
 * /commerce/ciforder:
 *   get:
 *     summary: Obtener comercios ordenados por CIF
 *     tags: [Commerce]
 *     responses:
 *       200:
 *         description: Lista de comercios ordenados por CIF
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Commerce'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/ciforder', getComercesOrderedByCIF);

/**
 * @swagger
 * /commerce/delete/{comercioId}:
 *   delete:
 *     summary: Eliminar comercio por ID (ruta alternativa)
 *     tags: [Commerce]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: comercioId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del comercio a eliminar
 *     responses:
 *       200:
 *         description: Comercio eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de confirmación
 *       404:
 *         description: Comercio no encontrado
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
 */
router.delete('/delete/:comercioId', authMiddleware, checkRol(['admin']), deleteCommerceById);

module.exports = router;
