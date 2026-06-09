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
    estado_libro ENUM('disponible', 'prestado') NOT NULL DEFAULT 'disponible',
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

INSERT INTO autor (nombre_autor) VALUES 
('Gabriel García Márquez'),
('Isabel Allende'),
('Jorge Luis Borges'),
('Julio Cortázar'),
('Mario Vargas Llosa');

INSERT INTO editorial (nombre_editorial) VALUES 
('Penguin Random House'),
('Editorial Planeta'),
('Alfaguara'),
('Fondo de Cultura Económica'),
('Editorial Sudamericana');

INSERT INTO libro (isbn, titulo, id_autor, id_editorial, fecha_publicacion, cantidad_disponible) VALUES 
('9788437604947', 'Cien años de soledad', 1, 1, '1967-05-30', 10),
('9788408054058', 'La casa de los espíritus', 2, 2, '1982-01-01', 8),
('9788420422138', 'Ficciones', 3, 3, '1944-01-01', 5),
('9788437607191', 'Rayuela', 4, 1, '1963-06-28', 7),
('9788466321136', 'La ciudad y los perros', 5, 2, '1963-01-01', 6);

INSERT INTO usuario (
    nombre_usuario, 
    contrasena, 
    nombre_cliente, 
    apellido_cliente, 
    correo, 
    telefono, 
    numero_identificacion, 
    id_rol
) VALUES 
(
    'jperez',
    'user123',
    'Juan',
    'Pérez',
    'juan.perez@email.com',
    '55510001',
    'ID-1001',
    (SELECT id_rol FROM rol WHERE nombre_rol = 'Gestor')
),
(
    'mgarcia',
    'user123',
    'María',
    'García',
    'maria.garcia@email.com',
    '55510002',
    'ID-1002',
    (SELECT id_rol FROM rol WHERE nombre_rol = 'Gestor')
),
(
    'crodriguez',
    'user123',
    'Carlos',
    'Rodríguez',
    'carlos.rodriguez@email.com',
    '55510003',
    'ID-1003',
    (SELECT id_rol FROM rol WHERE nombre_rol = 'Gestor')
),
(
    'lfernandez',
    'user123',
    'Laura',
    'Fernández',
    'laura.fernandez@email.com',
    '55510004',
    'ID-1004',
    (SELECT id_rol FROM rol WHERE nombre_rol = 'Gestor')
),
(
    'atorres',
    'user123',
    'Ana',
    'Torres',
    'ana.torres@email.com',
    '55510005',
    'ID-1005',
    (SELECT id_rol FROM rol WHERE nombre_rol = 'Gestor')
);


INSERT INTO prestamo (
    id_libro,
    id_usuario_prestamo,
    fecha_entrega,
    fecha_devolucion_esperada,
    fecha_devolucion_real,
    id_estado_prestamo,
    id_usuario_registro_prestamo
) VALUES 
(
    1,  -- Cien años de soledad
    2,  -- Juan Pérez
    '2024-06-01 10:30:00',
    '2024-06-15 23:59:59',
    NULL,
    (SELECT id_estado_prestamo FROM estado_prestamo WHERE codigo_estado_prestamo = 'ACT'),
    1   -- admin
),
(
    2,  -- La casa de los espíritus
    3,  -- María García
    '2024-06-02 11:15:00',
    '2024-06-16 23:59:59',
    '2024-06-14 09:45:00',
    (SELECT id_estado_prestamo FROM estado_prestamo WHERE codigo_estado_prestamo = 'DEV'),
    1
),
(
    3,  -- Ficciones
    4,  -- Carlos Rodríguez
    '2024-05-20 09:00:00',
    '2024-06-03 23:59:59',
    NULL,
    (SELECT id_estado_prestamo FROM estado_prestamo WHERE codigo_estado_prestamo = 'VENC'),
    1
),
(
    4,  -- Rayuela
    5,  -- Laura Fernández
    '2024-06-05 14:30:00',
    '2024-06-19 23:59:59',
    NULL,
    (SELECT id_estado_prestamo FROM estado_prestamo WHERE codigo_estado_prestamo = 'ACT'),
    1
),
(
    5,  -- La ciudad y los perros
    2,  -- Juan Pérez
    '2024-05-28 16:45:00',
    '2024-06-11 23:59:59',
    '2024-06-10 10:30:00',
    (SELECT id_estado_prestamo FROM estado_prestamo WHERE codigo_estado_prestamo = 'DEV'),
    1
);


SELECT * FROM usuario;
SELECT * FROM libro;


select * from rol;


SELECT * FROM estado_prestamo;



