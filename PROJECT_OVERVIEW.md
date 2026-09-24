# ParkingPlatform - Visión General y Solución Objetivo

Este documento describe la visión global de ParkingPlatform, su arquitectura, los roles del sistema y el flujo principal de funcionamiento.

## 🎯 Objetivo del Proyecto

**ParkingPlatform** es una solución digital centralizada (con un modelo similar a un Marketplace o SaaS) diseñada para modernizar y gestionar el uso de estacionamientos privados o comerciales. 

Busca conectar eficientemente:
1. **La Oferta (Administradores/Dueños):** Proveyéndoles herramientas para digitalizar su gestión, controlar el flujo de ocupación y monitorear los ingresos económicos en tiempo real.
2. **La Demanda (Conductores):** Brindándoles una herramienta ágil para buscar, verificar disponibilidad y reservar lugares de estacionamiento de antemano, reduciendo el estrés y el tiempo de búsqueda física.

## 🏗️ Arquitectura y Tecnologías

El sistema se basa en una arquitectura escalable y moderna dividida en tres frentes:

- **Backend (API REST):** Construido en **.NET 10** bajo el paradigma de **Clean Architecture** y el patrón **CQRS** (Command Query Responsibility Segregation) con MediatR. Esto permite que las operaciones de lectura (consultas) y escritura (transacciones) estén completamente separadas, mejorando el rendimiento y la mantenibilidad.
- **Base de Datos y Caché:** **PostgreSQL** actúa como la base de datos relacional principal a través de Entity Framework Core. Se apoya en **Redis** como motor en memoria para cachear las consultas de disponibilidad frecuentes, reduciendo la latencia de respuesta en la aplicación móvil.
- **Frontend Web (Backoffice):** Desarrollado en **React 19**, TypeScript, Vite y TailwindCSS. Integra gráficos con Recharts.
- **Frontend Móvil (App):** Aplicación híbrida en **React Native (Expo)** pensada para los conductores.

## 👥 Roles y Funciones del Sistema

La plataforma distingue estrictamente dos perfiles de usuario mediante autenticación **JWT (JSON Web Token)**:

### 1. Administrador (Admin / Dueño de Cochera)
El administrador interactúa exclusivamente con el **Frontend Web (Dashboard)**.
* **Gestión (ABM):** Tiene permisos de escritura para crear, editar o dar de baja infraestructuras de estacionamiento (cocheras).
* **Monitoreo:** Visualiza datos analíticos a través de un panel gráfico (ingresos semanales, tasas de ocupación, etc.).
* **Auditoría:** Posee acceso a un registro global con el historial de todos los usuarios registrados y todas las reservas cursadas en la plataforma.

### 2. Conductor (Driver)
El conductor es el usuario final e interactúa exclusivamente con el **Frontend Móvil (App)**.
* **Búsqueda Georeferenciada:** Navega por un mapa interactivo para localizar cocheras cercanas y consultar su tarifa y capacidad en tiempo real.
* **Operativa:** Realiza la reserva del espacio (bloqueando lógicamente un lugar en la base de datos).
* **Control Personal:** Accede a un historial de sus "Reservas Activas" e interactúa con los controles de acceso de la cochera física mediante **Códigos QR** generados en su dispositivo.

## 🔄 Flujo Core: La Reserva
El proceso más crítico del negocio es la Reserva. El backend está diseñado para recibir la solicitud, comprobar disponibilidad real, y ejecutar un "Command" que reduce la capacidad actual de la cochera de manera transaccional. Esto es fundamental para asegurar la consistencia de los datos y evitar ventas de espacios inexistentes (*overbooking*).
