-- Crear base de datos
CREATE DATABASE IF NOT EXISTS gestion_cocina CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gestion_cocina;

-- Tabla de Insumos
CREATE TABLE IF NOT EXISTS insumos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    cantidad DECIMAL(10, 2) NOT NULL DEFAULT 0,
    unidad VARCHAR(20) NOT NULL,
    stock_minimo DECIMAL(10, 2) NOT NULL DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Herramientas
CREATE TABLE IF NOT EXISTS herramientas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    cantidad INT NOT NULL DEFAULT 0,
    categoria VARCHAR(50) NOT NULL,
    ubicacion VARCHAR(50) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nombre (nombre),
    INDEX idx_ubicacion (ubicacion),
    INDEX idx_categoria (categoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Movimientos
CREATE TABLE IF NOT EXISTS movimientos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_elemento ENUM('insumo', 'herramienta') NOT NULL,
    elemento_nombre VARCHAR(100) NOT NULL,
    tipo_movimiento ENUM('entrada', 'salida') NOT NULL,
    cantidad DECIMAL(10, 2) NOT NULL,
    unidad VARCHAR(20) NOT NULL,
    motivo TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_fecha (fecha),
    INDEX idx_tipo_elemento (tipo_elemento),
    INDEX idx_elemento_nombre (elemento_nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Datos de ejemplo (opcional)
-- INSERT INTO insumos (nombre, cantidad, unidad, stock_minimo) VALUES
-- ('Harina', 50, 'kg', 10),
-- ('Azúcar', 30, 'kg', 5),
-- ('Aceite', 20, 'lt', 5);

-- INSERT INTO herramientas (nombre, cantidad, categoria, ubicacion) VALUES
-- ('Cuchillos', 12, 'cubiertos', 'bodega'),
-- ('Ollas grandes', 5, 'ollas', 'taller'),
-- ('Sartenes', 8, 'ollas', 'bodega');