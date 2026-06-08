# Sistema de Gestión de Biblioteca — BuenaVentura

Aplicación full-stack para digitalizar la gestión de una biblioteca: administración de
**libros, usuarios, préstamos y reportería**, con control de acceso basado en roles.

- **Backend:** API REST en Flask (Python) + MySQL.
- **Frontend:** SPA en React + Vite + TypeScript.
- **Orquestación:** Docker Compose.

> Para el detalle de arquitectura y su justificación, ver [`INFORME_TECNICO.md`](./INFORME_TECNICO.md).

---

## Tabla de contenidos

1. [Arquitectura general](#arquitectura-general)
2. [Tecnologías utilizadas](#tecnologías-utilizadas)
3. [Estructura del proyecto](#estructura-del-proyecto)
4. [Requisitos previos](#requisitos-previos)
5. [Variables de entorno](#variables-de-entorno)
6. [Cómo levantar el proyecto con Docker (recomendado)](#cómo-levantar-el-proyecto-con-docker-recomendado)
7. [Cómo levantar el proyecto localmente](#cómo-levantar-el-proyecto-localmente)
8. [Documentación de la API (Swagger)](#documentación-de-la-api-swagger)
9. [Control de acceso por roles](#control-de-acceso-por-roles)

---

## Arquitectura general

```
┌──────────────┐      HTTP/JSON       ┌───────────────┐      SQL       ┌──────────────┐
│   Frontend   │  ───────────────►    │  Backend API  │  ───────────►  │    MySQL     │
│ React + Vite │   localhost:5001     │     Flask     │                │   (Docker)   │
│  (port 5173) │                      │  (port 5001)  │                │  (port 3306) │
└──────────────┘                      └───────────────┘                └──────────────┘
```

El backend está organizado en **arquitectura por capas** (rutas → servicios →
repositorios → modelos) y el frontend en **módulos por dominio** (Clean Architecture).

---

## Tecnologías utilizadas

### Backend (`/book`)

| Tecnología | Versión | Para qué se usa |
|---|---|---|
| **Python** | 3.11 | Lenguaje del backend. |
| **Flask** | 2.3.3 | Microframework web que expone la API REST. Ligero y sin estructura impuesta, lo que permite organizar el código por capas y usar *Blueprints* para separar módulos (libros, usuarios, préstamos, reportes). |
| **Flask-SQLAlchemy** | 3.0.5 | Integración del ORM **SQLAlchemy** con Flask. Mapea las tablas de MySQL a clases de Python (modelos) y evita escribir SQL a mano. |
| **PyMySQL** | 1.1.0 | Driver/conector que permite a SQLAlchemy comunicarse con MySQL (`mysql+pymysql://`). |
| **Flask-CORS** | 4.0.0 | Habilita CORS para que el frontend (otro origen/puerto) pueda consumir la API desde el navegador. |
| **Flasgger** | 0.9.7.1 | Genera documentación interactiva **Swagger UI** a partir de archivos `.yml`, uno por endpoint (`/apidocs`). |
| **python-dotenv** | 1.0.0 | Carga variables de entorno desde el archivo `.env`. |
| **requests** | 2.31.0 | Cliente HTTP (utilidades/llamadas salientes). |
| **MySQL** | 8.0 | Base de datos relacional. El dominio es claramente relacional (claves foráneas entre préstamos, libros y usuarios; unicidad de ISBN y número de identificación). |

**Patrón de capas del backend:**
- **`routes/`** — Endpoints HTTP (Blueprints). Validan entrada/salida y traducen errores a códigos HTTP.
- **`services/`** — Reglas de negocio (ISBN único, stock no negativo, un préstamo activo por usuario, etc.).
- **`repositories/`** — Acceso a datos vía SQLAlchemy. Centraliza todas las consultas.
- **`models/`** — Entidades mapeadas a tablas.
- **`utils/auth.py`** — Decorador `roles_required` para el control de acceso por rol.

### Frontend (`/front-end-apps`)

| Tecnología | Versión | Para qué se usa |
|---|---|---|
| **React** | 19 | Librería de UI basada en componentes. |
| **TypeScript** | 6 | Tipado estático sobre JavaScript; previene errores en tiempo de compilación. |
| **Vite** | 8 | Empaquetador y servidor de desarrollo ultrarrápido (HMR). Compila el proyecto y sirve la SPA. |
| **Tailwind CSS** | 4 | Framework de estilos por utilidades. Se integra vía el plugin oficial `@tailwindcss/vite` (en v4 **no** se usa `tailwind.config.js`; basta `@import "tailwindcss"` en `index.css`). |
| **React Router DOM** | 7 | Enrutamiento de la SPA (rutas públicas/privadas y layouts anidados). |
| **Zustand** | 5 | Manejo de estado global, ligero y sin boilerplate (no requiere Provider). |
| **TanStack React Query** | 5 | Manejo de estado del servidor: peticiones, caché, reintentos y sincronización con la API. |

**Organización del frontend (por dominio / Clean Architecture):**
- **`layouts/`** — `AdminLayout`, `UserLayout`, `AuthLayout`.
- **`routes/`** — `AppRoutes`, `PublicRoute`, `PrivateRoute`.
- **`app/providers/`** — `QueryProvider` (React Query) y `StoreProvider`.
- **`shared/components/forms/`** — Campos reutilizables: `Button`, `Input`, `Select`, `TextArea`, `Checkbox`, `RadioButton`, `FormField`, `Fieldset`.
- **`shared/components/layout/`** — `AppHeader`, `AppSidebar`, etc.
- **`modules/`** — Módulos por dominio (auth, books, users, loans, dashboard) con `application/`, `domain/`, `infrastructure/`, `hooks/`, `store/`, `ui/`.

### Infraestructura

| Tecnología | Para qué se usa |
|---|---|
| **Docker** | Empaqueta cada servicio (backend, frontend, base de datos) en contenedores reproducibles. |
| **Docker Compose** | Orquesta los tres servicios, define la red interna, los volúmenes persistentes y el orden de arranque (el backend espera a que MySQL esté *healthy*). |

---

## Estructura del proyecto

```
buena-ventura-library/
├── docker-compose.yml          # Orquestación de los 3 servicios
├── .env                        # Variables de entorno (no se versiona)
├── README.md
├── INFORME_TECNICO.md
│
├── database/
│   └── init.sql                # Esquema + datos semilla (roles, estados, admin)
│
├── book/                       # Backend (Flask)
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── run.py                  # Punto de entrada (puerto 5001)
│   └── app/
│       ├── __init__.py         # create_app() + registro de Blueprints
│       ├── config/             # Configuración por entorno
│       ├── routes/             # Endpoints (book, user, loan, report)
│       ├── services/           # Reglas de negocio
│       ├── repositories/       # Acceso a datos (SQLAlchemy)
│       ├── models/             # Entidades / tablas
│       ├── enums/              # RolName, LoanStatusCode
│       ├── utils/              # auth.py (roles_required)
│       └── docs/               # YAML de Swagger por endpoint
│
└── front-end-apps/             # Frontend (React + Vite + TS)
    ├── Dockerfile
    ├── package.json
    ├── vite.config.ts
    └── src/
        ├── main.tsx            # Entrada: providers + router
        ├── App.tsx
        ├── app/providers/
        ├── routes/
        ├── layouts/
        ├── pages/
        └── shared/
```

---

## Requisitos previos

**Opción A — Docker (recomendado):**
- [Docker](https://www.docker.com/) y Docker Compose.

**Opción B — Ejecución local:**
- Python 3.11+
- Node.js 22+ y npm
- MySQL 8.0 en ejecución

---

## Variables de entorno

En la raíz (`buena-ventura-library/`) debe existir un archivo **`.env`**. Ejemplo:

```env
# Base de Datos
DB_ROOT_PASSWORD=tu_password_root
DB_NAME=biblioteca_buenaventura
DB_USER=biblioteca_user
DB_PASSWORD=tu_password
DB_PORT=3306

# JWT (reservadas para autenticación; opcionales en el estado actual)
JWT_SECRET_KEY=cambia_esto
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_HOURS=8
```

> Las variables `DB_*` las consumen tanto el contenedor de MySQL como el backend
> (que construye `DATABASE_URL` a partir de ellas).

---

## Cómo levantar el proyecto con Docker (recomendado)

Desde la carpeta `buena-ventura-library/`:

```bash
docker compose up --build
```

Esto levanta los tres servicios:

| Servicio | Contenedor | URL / Puerto |
|---|---|---|
| Base de datos | `library-mysql` | `localhost:${DB_PORT}` (3306) |
| Backend (API) | `book-app` | http://localhost:5001 |
| Frontend (SPA) | `library-frontend` | http://localhost:5173 |

- La primera vez, MySQL ejecuta `database/init.sql` (crea las tablas y carga roles,
  estados de préstamo y un usuario administrador).
- El backend solo arranca cuando MySQL está *healthy*.
- El frontend monta el código como volumen, por lo que los cambios se reflejan con
  **hot reload**.

Para detener:

```bash
docker compose down          # detiene y elimina contenedores
docker compose down -v       # además elimina el volumen de datos de MySQL
```

---

## Cómo levantar el proyecto localmente

### 1. Base de datos
Ten una instancia de MySQL 8 corriendo y crea la base con `database/init.sql`:

```bash
mysql -u root -p < database/init.sql
```

### 2. Backend

```bash
cd book
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Cadena de conexión a tu MySQL local
export DATABASE_URL="mysql+pymysql://USUARIO:PASSWORD@localhost:3306/biblioteca_buenaventura"

python run.py
```
API disponible en http://localhost:5001

### 3. Frontend

```bash
cd front-end-apps
npm install
npm run dev
```
SPA disponible en http://localhost:5173

---

## Documentación de la API (Swagger)

Con el backend en ejecución, la documentación interactiva está en:

```
http://localhost:5001/apidocs
```

Los endpoints se agrupan por etiquetas: **Books**, **Users**, **Loans** y **Reports**.

**Resumen de endpoints principales:**

| Módulo | Método | Ruta |
|---|---|---|
| Libros | GET/POST/PUT/DELETE | `/api/book` |
| Usuarios | GET/POST/PUT/DELETE | `/api/user` |
| Préstamos | GET/POST | `/api/loan` · devolución: `PUT /api/loan/<id>/return` |
| Reportería | GET | `/api/report/loans` (filtros `?isbn=&title=&user=`), `/api/report/loans/book/<id>`, `/api/report/loans/user/<id>` |
| Salud | GET | `/health` |

---

## Control de acceso por roles

Las operaciones de **gestión** (crear/editar/eliminar) requieren el encabezado
**`X-Username`** con un usuario existente en la base de datos:

- **Libros, usuarios y préstamos:** rol **Gestor** o **Administrador**.
- **Reportería:** solo rol **Administrador**.

Ejemplo:

```bash
curl -X POST http://localhost:5001/api/book \
  -H "Content-Type: application/json" \
  -H "X-Username: admin" \
  -d '{"isbn":"978-3-16-148410-0","title":"Cien años de soledad","publication_date":"1967-05-30","stock":5,"id_author":1,"id_editorial":1}'
```

Respuestas del control de acceso: **401** si falta el header o el usuario no existe;
**403** si el rol no tiene permiso.
