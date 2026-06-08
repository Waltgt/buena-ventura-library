CREATE DATABASE IF NOT EXISTS biblioteca_buenaventura;
USE biblioteca_buenaventura;

CREATE TABLE estado_prestamo (
    id_estado_prestamo INT NOT NULL AUTO_INCREMENT,
    codigo_estado_prestamo VARCHAR(5) NOT NULL UNIQUE,
    descripcion_estado_prestamo VARCHAR(100),
    PRIMARY KEY (id_estado_prestamo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE autor (
    id_autor BIGINT NOT NULL AUTO_INCREMENT,
    nombre_autor VARCHAR(250) NOT NULL,
    PRIMARY KEY (id_autor)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE editorial (
    id_editorial BIGINT NOT NULL AUTO_INCREMENT,
    nombre_editorial VARCHAR(250) NOT NULL,
    PRIMARY KEY (id_editorial)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE libro (
    id_libro BIGINT NOT NULL AUTO_INCREMENT,
    isbn VARCHAR(60) NOT NULL UNIQUE,
    titulo VARCHAR(100) NOT NULL,
    id_autor BIGINT NOT NULL,
    id_editorial BIGINT NOT NULL,
    fecha_publicacion DATE,
    cantidad_disponible INT NOT NULL,
    PRIMARY KEY (id_libro),
    FOREIGN KEY (id_autor) REFERENCES autor(id_autor) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (id_editorial) REFERENCES editorial(id_editorial) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE rol (
    id_rol BIGINT NOT NULL AUTO_INCREMENT,
    nombre_rol VARCHAR(50) NOT NULL,
    descripcion_rol VARCHAR(250),
    PRIMARY KEY (id_rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE usuario (
    id_usuario BIGINT NOT NULL AUTO_INCREMENT,
    nombre_usuario VARCHAR(60) NOT NULL,
    contrasena VARCHAR(250) NOT NULL,
    nombre_cliente VARCHAR(60) NOT NULL,
    apellido_cliente VARCHAR(60),
    correo VARCHAR(150) NOT NULL,
    telefono VARCHAR(12),
    numero_identificacion VARCHAR(20) NOT NULL UNIQUE,
    id_rol BIGINT NOT NULL,
    PRIMARY KEY (id_usuario),
    FOREIGN KEY (id_rol) REFERENCES rol(id_rol) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE prestamo (
    id_prestamo BIGINT NOT NULL AUTO_INCREMENT,
    id_libro BIGINT NOT NULL,
    id_usuario_prestamo BIGINT NOT NULL,
    fecha_entrega DATETIME NOT NULL,
    fecha_devolucion_esperada DATETIME NOT NULL,
    fecha_devolucion_real DATETIME,
    id_estado_prestamo INT NOT NULL,
    id_usuario_registro_prestamo BIGINT NOT NULL,
    PRIMARY KEY (id_prestamo),
    FOREIGN KEY (id_libro) REFERENCES libro(id_libro) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (id_usuario_prestamo) REFERENCES usuario(id_usuario) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (id_estado_prestamo) REFERENCES estado_prestamo(id_estado_prestamo) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (id_usuario_registro_prestamo) REFERENCES usuario(id_usuario) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


INSERT INTO rol (nombre_rol, descripcion_rol) VALUES 
('Gestor', 'Puede agregar libros, clientes y préstamos'),
('Administrador', 'Tiene acceso total al sistema, incluyendo gestión de usuarios y reportería');

INSERT INTO estado_prestamo (codigo_estado_prestamo, descripcion_estado_prestamo) VALUES 
('ACT', 'Activo - Préstamo vigente'),
('DEV', 'Devuelto - Libro regresado a la biblioteca'),
('VENC', 'Vencido - Fecha de devolución excedida');


INSERT INTO usuario (
    nombre_usuario, 
    contrasena, 
    nombre_cliente, 
    apellido_cliente, 
    correo, 
    telefono, 
    numero_identificacion, 
    id_rol
) VALUES (
    'admin',
    'admin123', 
    'Administrador',
    'Del Sistema',
    'admin@biblioteca.com',
    '12345678',
    'ADMIN-001',
    (SELECT id_rol FROM rol WHERE nombre_rol = 'Administrador')
);


SELECT * FROM usuario;
UPDATE usuario SET contrasena = 'admin123';

ALTER TABLE usuario DROP COLUMN contraseña;
ALTER TABLE usuario ADD COLUMN contrasena VARCHAR(250) NOT NULL;


select * from rol;