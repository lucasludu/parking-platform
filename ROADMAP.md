# Hoja de Ruta: ParkingPlatform

Hemos sentado unas bases muy sólidas. Tienes la base de datos corriendo, la arquitectura del backend en .NET armada con CQRS (MediatR), y los proyectos base de frontend funcionando. 

Para llegar al producto final y tener el sistema operando al 100%, esta es la lista de tareas pendientes agrupadas por áreas:

## 1. Backend y Lógica de Negocio (.NET)
- [x] **Flujo de Reservas:** Crear los DTOs, Commands, Queries y Controladores para gestionar las reservas. Esto incluye la lógica para "reducir un lugar disponible" y evitar el *overbooking*.
- [x] **Autenticación y Seguridad (JWT):** Implementar login y registro. Proteger los endpoints para que solo el "Admin" pueda crear o editar cocheras, y los "Drivers" solo puedan hacer reservas a su nombre.
- [x] **Integración de Redis:** Utilizar el contenedor de Redis que ya tenemos para almacenar en caché las consultas de "Cocheras Disponibles". Al ser la consulta más frecuente desde la app móvil, esto evitará sobrecargar la base de datos PostgreSQL.

## 2. Web Dashboard (React)
- [x] **Autenticación:** Pantalla de Login y protección de las rutas internas.
- [x] **Formularios ABM:** Crear la interfaz (pantalla y modales) para que el administrador pueda Dar de Alta, Editar y Borrar cocheras reales a través de la interfaz (ahora mismo solo listamos).
- [x] **Visualización de Datos:** Integrar una librería de gráficos (como *Recharts*) en el `Dashboard.tsx` para mostrar gráficamente los ingresos diarios y la ocupación histórica.

## 3. App Móvil (React Native)
- [x] **Geolocalización y Mapas:** Instalar y configurar `react-native-maps`. Renderizar las cocheras almacenadas en la base de datos como marcadores interactivos en un mapa.
- [x] **Hoja de Detalle (Bottom Sheet):** La interfaz inferior que emerge al tocar un estacionamiento, mostrando precio, lugares libres y el botón de "Reservar".
- [x] **Historial de Conductor:** Una pantalla donde el usuario pueda ver sus "Reservas Activas" y mostrar quizás un código QR generado para presentar en la entrada de la cochera.

## 4. DevOps y Despliegue (Combo "Frankenstein")
- [x] **Dockerización y Backend:** Crear el `Dockerfile` de producción para compilar .NET y publicarlo en **Render** o **Fly.io**.
- [x] **Bases de Datos Gratuitas:** Crear una instancia de PostgreSQL en **Neon** (o Supabase) y una de Redis en **Upstash**.
- [ ] **Despliegue del Frontend:** Alojamiento de la Web App en **Vercel** para que se despliegue automáticamente desde GitHub.
