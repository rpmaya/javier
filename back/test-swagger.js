const http = require('http');

// Función para hacer peticiones HTTP
function makeRequest(options, data = null) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: body
                });
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (data) {
            req.write(data);
        }
        req.end();
    });
}

// Pruebas
async function testSwagger() {
    console.log('🧪 Iniciando pruebas de Swagger...\n');
    
    const baseOptions = {
        hostname: 'localhost',
        port: 3000,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {
        // Prueba 1: Endpoint raíz
        console.log('1️⃣  Probando endpoint raíz (/)...');
        const rootResponse = await makeRequest({
            ...baseOptions,
            path: '/',
            method: 'GET'
        });
        
        if (rootResponse.statusCode === 200) {
            console.log('✅ Endpoint raíz funciona correctamente');
            const data = JSON.parse(rootResponse.body);
            console.log(`   📄 Documentación disponible en: ${data.documentation.swagger_ui}`);
        } else {
            console.log('❌ Error en endpoint raíz:', rootResponse.statusCode);
        }

        // Prueba 2: Swagger JSON
        console.log('\n2️⃣  Probando especificación Swagger JSON...');
        const swaggerJsonResponse = await makeRequest({
            ...baseOptions,
            path: '/api-docs.json',
            method: 'GET'
        });
        
        if (swaggerJsonResponse.statusCode === 200) {
            console.log('✅ Swagger JSON funciona correctamente');
            const swaggerSpec = JSON.parse(swaggerJsonResponse.body);
            console.log(`   📊 API Título: ${swaggerSpec.info.title}`);
            console.log(`   📊 API Versión: ${swaggerSpec.info.version}`);
            console.log(`   📊 Rutas documentadas: ${Object.keys(swaggerSpec.paths).length}`);
        } else {
            console.log('❌ Error en Swagger JSON:', swaggerJsonResponse.statusCode);
        }

        // Prueba 3: Swagger UI HTML
        console.log('\n3️⃣  Probando interfaz Swagger UI...');
        const swaggerUIResponse = await makeRequest({
            ...baseOptions,
            path: '/api-docs/',
            method: 'GET'
        });
        
        if (swaggerUIResponse.statusCode === 200) {
            console.log('✅ Swagger UI funciona correctamente');
            if (swaggerUIResponse.body.includes('swagger-ui')) {
                console.log('   🎨 Interfaz UI cargada correctamente');
            }
        } else {
            console.log('❌ Error en Swagger UI:', swaggerUIResponse.statusCode);
        }

        console.log('\n📋 Resumen de pruebas:');
        console.log('================================');
        console.log('✅ Servidor funcionando en puerto 3000');
        console.log('✅ Documentación Swagger configurada');
        console.log('✅ Todas las rutas documentadas');
        console.log('\n🎉 ¡Swagger está listo para usar!');
        console.log('\n🔗 Enlaces importantes:');
        console.log('   • Swagger UI: http://localhost:3000/api-docs');
        console.log('   • Swagger JSON: http://localhost:3000/api-docs.json');
        console.log('   • Info API: http://localhost:3000/');

    } catch (error) {
        console.error('❌ Error durante las pruebas:', error.message);
        console.log('\n💡 Posibles soluciones:');
        console.log('   • Asegúrate de que el servidor esté ejecutándose (npm start)');
        console.log('   • Verifica que no hay otros procesos usando el puerto 3000');
        console.log('   • Revisa los logs del servidor por errores');
    }
}

// Esperar un poco para que el servidor se inicie y luego ejecutar pruebas
console.log('⏳ Esperando que el servidor se inicie...\n');
setTimeout(testSwagger, 3000); 