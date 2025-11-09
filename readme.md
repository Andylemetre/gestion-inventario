# Sistema de Gestión de Inventario y Herramientas de Cocina

Sistema completo para gestionar inventario de ingredientes y herramientas de cocina usando Node.js, Express y MongoDB.

## 🚀 Características

- ✅ Gestión de inventario de ingredientes
- ✅ Gestión de herramientas de cocina
- ✅ Registro de movimientos (entradas/salidas)
- ✅ Alertas de stock bajo
- ✅ Alertas de mantenimiento de herramientas
- ✅ Búsqueda avanzada
- ✅ Estadísticas de movimientos

## 📋 Requisitos previos

- Node.js (versión 14 o superior)
- MongoDB (versión 4.4 o superior)
  - Puedes usar MongoDB local o MongoDB Atlas (cloud)

## 🔧 Instalación

### 1. Instalar MongoDB

#### Opción A: MongoDB Local
- Descarga e instala MongoDB desde: https://www.mongodb.com/try/download/community
- Inicia el servicio MongoDB

#### Opción B: MongoDB Atlas (Cloud - Recomendado)
1. Crea una cuenta gratuita en: https://www.mongodb.com/cloud/atlas
2. Crea un cluster gratuito
3. Configura un usuario de base de datos
4. Obtén tu connection string

### 2. Clonar e instalar dependencias

```bash
# Instalar dependencias
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
PORT=3000

# Para MongoDB Local
MONGODB_URI=mongodb://localhost:27017/gestion_cocina

# O para MongoDB Atlas
# MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/gestion_cocina?retryWrites=true&w=majority
```

### 4. Iniciar el servidor

```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

El servidor estará disponible en: `http://localhost:3000`

## 📁 Estructura del proyecto

```
proyecto/
├── src/
│   ├── config/
│   │   └── database.js          # Configuración de MongoDB
│   ├── models/
│   │   ├── Inventory.js         # Modelo de Inventario
│   │   ├── Tool.js              # Modelo de Herramientas
│   │   └── Movement.js          # Modelo de Movimientos
│   ├── controllers/
│   │   ├── inventoryController.js
│   │   ├── toolsController.js
│   │   └── movementsController.js
│   └── routes/
│       ├── inventoryRoutes.js
│       ├── toolsRoutes.js
│       └── movementsRoutes.js
├── public/                       # Archivos estáticos (HTML, CSS, JS)
├── server.js                     # Archivo principal
├── package.json
└── .env                         # Variables de entorno
```

## 🔌 API Endpoints

### Inventario

```
GET    /api/inventory              - Obtener todos los items
GET    /api/inventory/:id          - Obtener item por ID
GET    /api/inventory/low-stock    - Items con stock bajo
GET    /api/inventory/search?query=  - Buscar items
POST   /api/inventory              - Crear nuevo item
PUT    /api/inventory/:id          - Actualizar item
DELETE /api/inventory/:id          - Eliminar item
```

### Herramientas

```
GET    /api/tools                  - Obtener todas las herramientas
GET    /api/tools/:id              - Obtener herramienta por ID
GET    /api/tools/maintenance      - Herramientas que necesitan mantenimiento
GET    /api/tools/search?query=    - Buscar herramientas
POST   /api/tools                  - Crear nueva herramienta
PUT    /api/tools/:id              - Actualizar herramienta
DELETE /api/tools/:id              - Eliminar herramienta
```

### Movimientos

```
GET    /api/movements              - Obtener todos los movimientos
GET    /api/movements/item/:itemId - Movimientos de un item específico
GET    /api/movements/stats        - Estadísticas de movimientos
POST   /api/movements              - Crear nuevo movimiento
```

## 📝 Ejemplos de uso

### Crear un item de inventario

```javascript
POST /api/inventory
{
  "nombre": "Arroz",
  "categoria": "Ingrediente",
  "cantidad": 50,
  "unidad": "kg",
  "stock_minimo": 10,
  "precio_unitario": 2.5,
  "proveedor": "Distribuidora ABC",
  "ubicacion": "Despensa A"
}
```

### Crear una herramienta

```javascript
POST /api/tools
{
  "nombre": "Batidora industrial",
  "tipo": "Electrodoméstico",
  "cantidad": 1,
  "estado": "Excelente",
  "ubicacion": "Cocina principal",
  "costo": 250,
  "proximo_mantenimiento": "2025-12-31"
}
```

### Registrar un movimiento

```javascript
POST /api/movements
{
  "tipo_item": "inventario",
  "item_id": "60d5ec49f1b2c72b8c8e4e3a",
  "tipo_movimiento": "salida",
  "cantidad": 5,
  "motivo": "Preparación de menú del día",
  "usuario": "Chef Juan"
}
```

## 🔍 Características de MongoDB

### Ventajas sobre MySQL en este proyecto:

1. **Flexibilidad de esquema**: Fácil agregar campos sin migraciones
2. **Documentos embebidos**: Relaciones más naturales
3. **Escalabilidad horizontal**: Mejor para grandes volúmenes
4. **Virtuals y métodos**: Lógica de negocio en el modelo
5. **Queries potentes**: Agregaciones y búsquedas complejas

### Índices automáticos:

- Búsquedas por nombre
- Filtros por categoría/tipo
- Ordenamiento por fechas
- Búsquedas de texto completo

## 🛠️ Comandos útiles de MongoDB

```bash
# Conectarse a MongoDB local
mongo

# Ver bases de datos
show dbs

# Usar la base de datos
use gestion_cocina

# Ver colecciones
show collections

# Ver documentos
db.inventories.find()
db.tools.find()
db.movements.find()

# Contar documentos
db.inventories.countDocuments()

# Eliminar todos los documentos (¡cuidado!)
db.inventories.deleteMany({})
```

## 🔐 Seguridad

Para producción, asegúrate de:

1. Usar variables de entorno seguras
2. Configurar autenticación en MongoDB
3. Usar HTTPS
4. Implementar validación de datos
5. Agregar autenticación de usuarios
6. Limitar rate limiting en endpoints

## 📚 Recursos adicionales

- [Documentación de MongoDB](https://docs.mongodb.com/)
- [Documentación de Mongoose](https://mongoosejs.com/)
- [Express.js Guide](https://expressjs.com/)

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir cambios mayores.

## 📄 Licencia

ISC