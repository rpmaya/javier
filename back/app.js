const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes"); // Importa el router centralizado
require("dotenv").config();
const cors = require("cors");
const userRoutes = require('./routes/userRoutes');

// Importar configuración de Swagger
const { swaggerUi, specs } = require('./swagger');

const dbConnect = require("./config/mongo");

const app = express();

// Middleware para parsear JSON
app.use(express.json());

app.use(cors());

// Conectar a MongoDB
dbConnect();

// Configurar Swagger UI - DEBE IR ANTES DE LAS RUTAS DE LA API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "API Comercio Electrónico - Documentación",
    swaggerOptions: {
        docExpansion: "none",
        filter: true,
        showRequestDuration: true
    }
}));

// Ruta para obtener la especificación JSON de Swagger
app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
});

// Mensaje de bienvenida con enlaces a la documentación
app.get('/', (req, res) => {
    res.json({
        message: 'API de Comercio Electrónico',
        version: '1.0.0',
        documentation: {
            swagger_ui: `${req.protocol}://${req.get('host')}/api-docs`,
            swagger_json: `${req.protocol}://${req.get('host')}/api-docs.json`
        },
        endpoints: {
            users: '/api/users',
            commerce: '/api/comerce',
            commerce_details: '/api/comerceDetailsRoutes'
        }
    });
});

// Usar las rutas centralizadas
app.use("/api", routes);
app.use('/api', userRoutes);  // If you want to keep /api/userRoutes
// OR
// Change this line if it's different in your app.js
app.use('/api/userRoutes', userRoutes);

// Middleware para manejar errores
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        message: err.message || "Error interno del servidor",
        details: err.details || []
    });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    console.log(`📚 Documentación Swagger disponible en: http://localhost:${PORT}/api-docs`);
    console.log(`📄 Especificación JSON disponible en: http://localhost:${PORT}/api-docs.json`);
});
