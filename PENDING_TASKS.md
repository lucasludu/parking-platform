# Tareas Pendientes y Propuestas Adicionales

Este documento consolida las tareas pendientes originales del proyecto junto con nuevas funcionalidades recomendadas para robustecer la plataforma.

## 1. Tareas Pendientes (Roadmap Original)

### Backend y Lógica de Negocio (.NET)
- [x] **Autenticación y Seguridad Estricta (JWT):** Implementar la validación de roles en los endpoints. Asegurar que solo el "Admin" pueda crear/editar cocheras, y los "Drivers" solo puedan hacer reservas a su nombre.
- [x] **Integración de Redis:** Implementar el uso de caché para las consultas de "Cocheras Disponibles" para reducir la carga sobre PostgreSQL.

### App Móvil (React Native)
- [x] **Geolocalización y Mapas:** Integrar `react-native-maps` para renderizar las cocheras almacenadas en la base de datos como marcadores interactivos.
- [x] **Hoja de Detalle (Bottom Sheet):** Desarrollar la interfaz emergente al seleccionar un estacionamiento, mostrando precio, lugares libres y el botón de "Reservar".
- [x] **Historial de Conductor:** Crear pantalla para visualizar "Reservas Activas" y generar un código QR representativo de la reserva.

### DevOps y Despliegue (Combo "Frankenstein" Gratis)
- [x] **Dockerización del Backend:** Crear el `Dockerfile` optimizado para subir la API en .NET a **Render** o **Fly.io**.
- [x] **Bases de Datos Serverless:** Configurar el cluster de PostgreSQL en **Neon.tech** o **Supabase**, y configurar la caché en **Upstash** (Redis).
- [ ] **Despliegue del Frontend:** Configurar el despliegue automático de la Web de Administrador en **Vercel** o **Netlify**.

---

## 2. Nuevas Funcionalidades Agregadas (Propuestas de Valor)

### Features de Negocio
- [ ] **Pasarela de Pagos:** Integración con Stripe o MercadoPago para cobrar la reserva en tiempo real desde la app móvil. Esto disminuye la tasa de *no-shows* (usuarios que reservan y no asisten).
- [ ] **Flujo de Salida (Checkout) y Control de Excedentes:** Lógica para registrar la salida real del vehículo validando el QR. Si el conductor se excede del tiempo reservado, se le bloquea la salida y se genera un cargo automático por el tiempo de mora.
- [ ] **Sistema de Notificaciones Push:** Integración (ej. Firebase Cloud Messaging) para alertar sobre reservas próximas a expirar, pedir extensiones de tiempo, o confirmar pagos y cancelaciones.
- [ ] **Sistema de Reseñas y Calificaciones:** Permitir a los conductores puntuar y dejar comentarios sobre las cocheras (seguridad, iluminación, accesibilidad) para generar un ecosistema de confianza.

### Mejoras Técnicas y de Rendimiento
- [ ] **Sincronización en Tiempo Real (SignalR):** Implementar WebSockets en el backend y en la app móvil. Cuando un usuario reserva un lugar, el contador de lugares disponibles de esa cochera se debe actualizar instantáneamente en las pantallas de todos los demás conductores buscando en esa zona.
- [ ] **Manejo de Concurrencia (Anti-Overbooking):** Implementar `Optimistic Concurrency` (control de concurrencia optimista mediante tokens/row versions) en Entity Framework Core. Evita que dos usuarios reserven simultáneamente el último lugar disponible.
- [x] **Estrategia de Invalidación de Caché:** Lógica ligada a Redis para purgar o actualizar instantáneamente la caché de "Lugares Disponibles" cada vez que se genera o cancela una reserva.
