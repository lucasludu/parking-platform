# ParkingPlatform - Documentación Técnica (Wiki)

Bienvenido a la Wiki técnica de **ParkingPlatform**. Este documento explica la arquitectura, tecnologías y el funcionamiento de la plataforma completa.

## 📌 Arquitectura General

El proyecto está dividido en componentes principales:
1. **Backend (API REST):** Construido con .NET 10 (C#).
2. **Frontend Web (Backoffice):** Construido con React 19, TypeScript, Vite y TailwindCSS.
3. **Frontend Móvil (App Conductores):** Construido con React Native (Expo) - *Próximamente*.
4. **Infraestructura:** Docker Compose para la base de datos PostgreSQL y caché (Redis).

---

## ⚙️ Backend (.NET 10 API)

El Backend sigue la **Clean Architecture** (Arquitectura Limpia) y el patrón **CQRS** (Command Query Responsibility Segregation) utilizando la librería MediatR.

### Estructura de Capas
- **Parking.Domain:** Contiene las entidades base (User, ParkingLot, Reservation), Enums y las Interfaces de los Repositorios (IUserRepository, etc.). Es el corazón del negocio y no depende de nada.
- **Parking.Application:** Contiene los casos de uso. Aquí se implementan los Commands (operaciones de escritura/modificación como crear una cochera) y las Queries (operaciones de lectura, como obtener usuarios o estadísticas) a través de MediatR.
- **Parking.Infrastructure:** Contiene la implementación real con bases de datos y servicios externos. Aquí vive Entity Framework Core (ApplicationDbContext), los repositorios concretos y la generación de tokens JWT.
- **Parking.API:** El punto de entrada web. Aquí están los Controllers (Auth, ParkingLots, Reservations, Stats), la inyección de dependencias (Program.cs) y la configuración HTTP.

### Seguridad y Autenticación
- **JWT (JSON Web Tokens):** Toda la API (excepto login/registro) requiere un token JWT. Al iniciar sesión, la API verifica el Hash de la contraseña mediante BCrypt y devuelve un token firmado con una clave secreta (JwtSettings en ppsettings.json).

### Base de Datos
- **PostgreSQL:** Usamos Entity Framework Core como ORM.
- **Migraciones Automáticas:** El archivo Program.cs está configurado para ejecutar db.Database.Migrate() en cada inicio. Si la base de datos está vacía (por ejemplo al borrar contenedores de Docker), la API creará automáticamente todas las tablas necesarias.

---

## 💻 Frontend Web (Dashboard Admin)

El Frontend web es el panel de control exclusivo para los administradores o dueños de las cocheras.

### Tecnologías y Setup
- **React 19 + TypeScript:** Tipado fuerte para evitar errores en tiempo de ejecución.
- **Vite:** Empaquetador ultra-rápido (localhost:5173).
- **React Router v7:** Manejo de rutas y navegación entre pantallas.
- **Tailwind CSS v4:** Estilos modernos aplicados mediante clases utilitarias (className).
- **Recharts:** Librería de renderizado de gráficos vectoriales (SVG) para las estadísticas.

### Flujo de Navegación y Páginas
- **App.tsx & Layout.tsx:** Contienen el enrutador y la estructura global (barra lateral, fondo gris, validación de ruta privada). Si no tienes token, te devuelve al /login.
- **AuthContext.tsx:** Mantiene el estado global del usuario y su JWT token mediante el localStorage.
- **Login.tsx:** Pantalla híbrida que permite Iniciar Sesión o Registrar un nuevo administrador en el sistema.
- **Dashboard.tsx:** El panel principal. Obtiene datos analíticos desde /api/stats/dashboard y renderiza tarjetas de estadísticas totales y un gráfico interactivo (Barras) de los ingresos de la última semana.
- **ParkingLots.tsx:** El ABM (Alta, Baja, Modificación) de las Cocheras. Utiliza un modal emergente para crear o editar datos y los envía al backend (POST/PUT).
- **Reservations.tsx:** Lista el historial global de todas las reservas de la plataforma.
- **Users.tsx:** Lista de todos los usuarios registrados (Admins y Drivers).

---

## 🚀 Cómo Iniciar el Proyecto

### 1. Iniciar la Base de Datos (Docker)
Abre una terminal en la carpeta principal \ParkingPlatform\ y ejecuta:
\\\ash
cd devops
docker-compose up -d
\\\
*(Esto iniciará PostgreSQL con un volumen persistente para no perder los datos).*

### 2. Iniciar el Backend (.NET)
En una nueva terminal, levanta la API:
\\\ash
cd backend/Parking.API
dotnet run
\\\
*(La API estará disponible en http://localhost:5190. Puedes ver los endpoints en http://localhost:5190/scalar/v1).*

### 3. Iniciar el Frontend (React)
En una tercera terminal, arranca la web:
\\\ash
cd frontend-web/parking-web-admin
npm run dev
\\\
*(El portal de administración estará en http://localhost:5173).*
