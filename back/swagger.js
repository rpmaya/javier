const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Comercio Electrónico',
      version: '1.0.0',
      description: 'API REST para gestión de comercios, usuarios y páginas web de comercio electrónico',
      contact: {
        name: 'Soporte API',
        email: 'soporte@api.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'ID único del usuario'
            },
            name: {
              type: 'string',
              description: 'Nombre del usuario'
            },
            age: {
              type: 'number',
              description: 'Edad del usuario'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email del usuario'
            },
            password: {
              type: 'string',
              description: 'Contraseña del usuario'
            },
            city: {
              type: 'string',
              description: 'Ciudad del usuario'
            },
            interests: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Intereses del usuario'
            },
            allowOffers: {
              type: 'boolean',
              description: 'Acepta recibir ofertas'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin', 'merchant'],
              description: 'Rol del usuario'
            }
          }
        },
        Commerce: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'ID único del comercio'
            },
            name: {
              type: 'string',
              description: 'Nombre del comercio'
            },
            cif: {
              type: 'string',
              description: 'CIF del comercio'
            },
            address: {
              type: 'string',
              description: 'Dirección del comercio'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email del comercio'
            },
            phone: {
              type: 'string',
              description: 'Teléfono del comercio'
            }
          }
        },
        CommerceDetails: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'ID único de la página web'
            },
            ciudad: {
              type: 'string',
              description: 'Ciudad donde opera'
            },
            actividad: {
              type: 'string',
              description: 'Actividad comercial'
            },
            titulo: {
              type: 'string',
              description: 'Título de la página web'
            },
            resumen: {
              type: 'string',
              description: 'Resumen de la página web'
            },
            textos: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Textos de la página web'
            },
            fotos: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'URLs de las fotos'
            },
            scoring: {
              type: 'number',
              description: 'Puntuación de la página web'
            },
            numeroReviews: {
              type: 'number',
              description: 'Número de reseñas'
            },
            id_merchant: {
              type: 'string',
              description: 'ID del comerciante'
            },
            archived: {
              type: 'boolean',
              description: 'Estado de archivado'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mensaje de error'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email del usuario'
            },
            password: {
              type: 'string',
              description: 'Contraseña del usuario'
            }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              description: 'Token JWT de autenticación'
            },
            user: {
              $ref: '#/components/schemas/User'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js'], // Path to the API docs
};

const specs = swaggerJSDoc(options);

module.exports = {
  swaggerUi,
  specs
}; 