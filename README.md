# Autico Web

Frontend de una plataforma de compra/venta de vehiculos construida con React + Vite.

## Descripcion

Autico Web permite:

- Publicar vehiculos.
- Buscar y filtrar catalogo.
- Ver detalle de vehiculo con preguntas/respuestas.
- Gestionar panel privado (mis vehiculos, preguntas, edicion).
- Autenticacion tradicional (registro/login).
- Autenticacion con Google OAuth2 integrada contra backend.

## Stack Tecnico

- React 18
- Vite 5
- React Router DOM 6
- Tailwind CSS 3
- Framer Motion
- Axios
- React Hook Form + Zod
- React Hot Toast

## Estructura Principal

```text
src/
  api/
    axiosConfig.js
    authService.js
    questionService.js
    vehicleService.js
  components/
    common/
    layout/
    vehicles/
  context/
    authContext.js
    AuthContext.jsx
  hooks/
    useAuth.js
    useVehicles.js
  pages/
    GoogleAuthSuccess.jsx
    Home.jsx
    Login.jsx
    Register.jsx
    VehicleDetail.jsx
    VehiclesList.jsx
    dashboard/
  App.jsx
  main.jsx
```

## Requisitos

- Node.js 18+
- npm 9+
- Backend disponible (por defecto en `http://localhost:3000`)

## Instalacion

```bash
npm install
```

## Variables de Entorno

Puedes crear un `.env` en la raiz para ajustar URLs:

```bash
VITE_API_BASE_URL=http://localhost:3000/api
VITE_GOOGLE_AUTH_URL=http://localhost:3000/api/auth/google
```

Si no defines variables, el frontend usa los valores por defecto del codigo.

## Scripts

```bash
npm run dev      # desarrollo
npm run build    # build produccion
npm run preview  # preview build
npm run lint     # eslint (sin warnings)
```

## Flujo de Autenticacion

### 1) Tradicional

- `POST /api/auth/register`
- `POST /api/auth/login`
- Guarda `token` y `user` en `localStorage`.

### 2) Google OAuth2

- Boton en Login/Register redirige a `GET /api/auth/google`.
- Backend redirige al frontend en:
  - `/auth/google/callback?success=true&requiresCedula=false&token=...`
  - `/auth/google/callback?success=true&requiresCedula=true&tempToken=...`
  - `/auth/google/callback?success=false&message=...`
- Si `requiresCedula=true`, se solicita cedula y se completa con:
  - `POST /api/auth/google/complete-registration`
  - Header: `Authorization: Bearer TEMP_TOKEN`

## Rutas Relevantes

- Publicas:
  - `/`
  - `/vehicles`
  - `/vehicles/:id`
  - `/login`
  - `/register`
  - `/auth/google/callback`

- Privadas:
  - `/dashboard`
  - `/dashboard/vehicles`
  - `/dashboard/vehicles/new`
  - `/dashboard/vehicles/:id/edit`
  - `/dashboard/questions`

## Notas de Integracion Backend

Para evitar inconsistencias en UI, el backend debe intentar devolver en sesiones Google:

- `user.username` o `user.name` o `user.email`
- `token` valido con claims de identidad

El frontend aplica normalizacion de usuario para mostrar nombre consistente aun cuando el payload venga parcial.

## Estado de Calidad

- `npm run lint` en verde (sin errores ni warnings).
- Auditoria de codigo sin uso aplicada en imports, hooks y archivos huerfanos.

## Despliegue

Compatible con hosting estatico (Vercel, Netlify, etc.).

En produccion, asegurese de:

- Configurar correctamente `VITE_API_BASE_URL`.
- Configurar CORS y callback URLs en backend OAuth.
