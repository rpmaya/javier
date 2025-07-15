# 📚 Documentación API con Swagger

Este proyecto incluye documentación completa de la API usando Swagger UI, que proporciona una interfaz interactiva para explorar y probar todos los endpoints.

## 🚀 Cómo acceder a la documentación

### 1. Iniciar el servidor
```bash
npm start
```

### 2. Acceder a la documentación
Una vez que el servidor esté ejecutándose, puedes acceder a la documentación en:

- **Swagger UI (Interfaz interactiva)**: `http://localhost:3000/api-docs`
- **Especificación JSON**: `http://localhost:3000/api-docs.json`
- **Información general de la API**: `http://localhost:3000/`

## 📖 ¿Qué incluye la documentación?

La documentación de Swagger incluye **todas las rutas** organizadas en 3 categorías principales:

### 👥 Users (Usuarios)
- **POST** `/api/users` - Crear nuevo usuario
- **GET** `/api/users` - Obtener todos los usuarios
- **GET** `/api/users/{id}` - Obtener usuario por ID
- **PUT** `/api/users/{id}` - Actualizar usuario
- **DELETE** `/api/users/{id}` - Eliminar usuario
- **POST** `/api/login` - Iniciar sesión
- **GET** `/api/checkAdmin` - Verificar rol administrador
- **GET** `/api/checkMerchant` - Verificar rol comerciante
- **GET** `/api/users/offers/{ciudad}` - Obtener usuarios por ofertas y ciudad

### 🏪 Commerce (Comercios)
- **GET** `/api/comerce` - Obtener todos los comercios
- **GET** `/api/comerce/{id}` - Obtener comercio por ID
- **POST** `/api/comerce` - Crear nuevo comercio (solo admin)
- **PUT** `/api/comerce/{id}` - Actualizar comercio (solo admin)
- **DELETE** `/api/comerce/{id}` - Eliminar comercio (solo admin)
- **GET** `/api/comerce/cif/{cif}` - Obtener comercio por CIF
- **PUT** `/api/comerce/cif/{cif}` - Actualizar comercio por CIF
- **DELETE** `/api/comerce/cif/{cif}` - Eliminar comercio por CIF
- **GET** `/api/comerce/all` - Obtener todos los comercios (alternativo)
- **GET** `/api/comerce/ciforder` - Obtener comercios ordenados por CIF
- **DELETE** `/api/comerce/delete/{comercioId}` - Eliminar comercio por ID

### 🌐 Commerce Details (Páginas Web de Comercio)
- **GET** `/api/comerceDetailsRoutes` - Obtener todas las páginas web
- **GET** `/api/comerceDetailsRoutes/sort/scoring/{order}` - Ordenar por puntuación
- **GET** `/api/comerceDetailsRoutes/activity/{actividad}` - Filtrar por actividad
- **GET** `/api/comerceDetailsRoutes/merchant/{id_merchant}` - Filtrar por comerciante
- **GET** `/api/comerceDetailsRoutes/{id}` - Obtener página web por ID
- **POST** `/api/comerceDetailsRoutes` - Crear nueva página web (admin/merchant)
- **PUT** `/api/comerceDetailsRoutes/{id}` - Actualizar página web (admin/merchant)
- **PATCH** `/api/comerceDetailsRoutes/{id}/archive` - Archivar página web
- **DELETE** `/api/comerceDetailsRoutes/delete/{id}` - Eliminar página web (solo admin)

## 🔐 Autenticación

Muchos endpoints requieren autenticación JWT. En la documentación Swagger:

1. **Obtener token**: Usa el endpoint `POST /api/login` con credenciales válidas
2. **Autorizar**: Haz clic en el botón "Authorize" en la parte superior de Swagger UI
3. **Introducir token**: Ingresa el token en el formato: `Bearer {tu_token_aqui}`
4. **Probar endpoints**: Ahora puedes probar los endpoints protegidos

## 📝 Esquemas de datos

La documentación incluye esquemas detallados para:

- **User**: Estructura de datos de usuario
- **Commerce**: Estructura de datos de comercio
- **CommerceDetails**: Estructura de datos de páginas web
- **LoginRequest**: Datos requeridos para login
- **LoginResponse**: Respuesta del login
- **Error**: Estructura de mensajes de error

## 🎯 Características de la interfaz

- **Filtro de búsqueda**: Busca endpoints específicos
- **Probar en vivo**: Ejecuta peticiones reales desde la interfaz
- **Ejemplos de código**: Ve ejemplos en diferentes lenguajes
- **Validación**: Los esquemas incluyen validaciones y restricciones
- **Respuestas detalladas**: Ve todos los posibles códigos de respuesta

## 🔧 Personalización

El archivo de configuración de Swagger se encuentra en `swagger.js` y puede ser personalizado:

- Cambiar información de la API
- Añadir nuevos esquemas
- Modificar la configuración de la interfaz
- Añadir servidores adicionales

## 📱 Exportar documentación

Desde Swagger UI puedes:
- Descargar la especificación OpenAPI en formato JSON
- Generar clientes de API en múltiples lenguajes
- Importar en herramientas como Postman

## 🆘 Solución de problemas

**Si no ves la documentación:**
1. Verifica que el servidor esté ejecutándose
2. Asegúrate de acceder a la URL correcta
3. Revisa la consola del servidor por errores

**Si faltan endpoints:**
1. Verifica que los comentarios JSDoc estén correctos
2. Asegúrate de que los archivos de rutas estén en la carpeta correcta
3. Reinicia el servidor después de cambios

---

¡La documentación está lista! 🎉 Disfruta explorando la API de manera interactiva. 