require('dotenv').config();

console.log('🔍 Verificando configuración para Vercel...\n');

// 1. Verificar Node.js version
const nodeVersion = process.version;
console.log('✓ Node.js version:', nodeVersion);
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
if (majorVersion < 18) {
    console.log('❌ Node.js debe ser versión 18 o superior');
} else {
    console.log('✅ Versión de Node.js compatible\n');
}

// 2. Verificar package.json
const packageJson = require('./package.json');
console.log('✓ package.json encontrado');
console.log('  - Nombre:', packageJson.name);
console.log('  - Versión:', packageJson.version);

if (packageJson.engines && packageJson.engines.node) {
    console.log('✅ engines.node configurado:', packageJson.engines.node, '\n');
} else {
    console.log('❌ engines.node NO está configurado en package.json\n');
}

// 3. Verificar vercel.json
const fs = require('fs');
if (fs.existsSync('./vercel.json')) {
    console.log('✅ vercel.json encontrado en la raíz\n');
    const vercelConfig = require('./vercel.json');
    console.log('  Configuración:');
    console.log('  - Version:', vercelConfig.version);
    console.log('  - Builds:', vercelConfig.builds?.length || 0);
    console.log('  - Routes:', vercelConfig.routes?.length || 0, '\n');
} else {
    console.log('❌ vercel.json NO encontrado en la raíz\n');
}

// 4. Verificar variables de entorno
console.log('🔐 Variables de entorno:');
if (process.env.MONGODB_URI) {
    const uri = process.env.MONGODB_URI;
    // Ocultar la contraseña
    const censored = uri.replace(/:([^@]+)@/, ':****@');
    console.log('✅ MONGODB_URI configurada:', censored);

    // Verificar formato
    if (uri.startsWith('mongodb+srv://')) {
        console.log('✅ Formato correcto (mongodb+srv://)\n');
    } else if (uri.startsWith('mongodb://')) {
        console.log('⚠️  Usando mongodb:// (considera mongodb+srv:// para Atlas)\n');
    } else {
        console.log('❌ Formato incorrecto de URI\n');
    }
} else {
    console.log('❌ MONGODB_URI NO está configurada\n');
    console.log('💡 Para Vercel, debes configurarla en el Dashboard:\n');
    console.log('   https://vercel.com/andylemetres-projects/gestion-inventario/settings/environment-variables\n');
}

// 5. Verificar estructura de archivos
console.log('📁 Estructura de archivos:');
const requiredFiles = [
    'server.js',
    'package.json',
    'vercel.json',
    'src/config/database.js',
    'src/routes/inventoryRoutes.js',
    'src/routes/toolsRoutes.js',
    'src/routes/movementsRoutes.js'
];

requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`  ✅ ${file}`);
    } else {
        console.log(`  ❌ ${file} - NO ENCONTRADO`);
    }
});

console.log('\n🚀 Para desplegar a Vercel:');
console.log('   1. Configura MONGODB_URI en el Dashboard de Vercel');
console.log('   2. Ejecuta: vercel --prod');
console.log('   3. Prueba: https://tu-url.vercel.app/api/health');