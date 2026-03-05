# Autico Web - Plataforma de Compra-Venta de Automóviles

![Autico Logo](https://img.shields.io/badge/Autico-Automotive-yellow?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite)

Plataforma web moderna y profesional para publicar y consultar vehículos en venta, con diseño industrial/mecánico y funcionalidad completa de CRUD, autenticación y sistema de preguntas y respuestas.

## 🎨 Características de Diseño

- **Estilo Industrial/Mecánico**: Diseño moderno con paleta de colores oscuros y acentos metálicos
- **Responsive**: Optimizado para todos los dispositivos (mobile-first)
- **Animaciones Suaves**: Transiciones y efectos con Framer Motion
- **Componentes Reutilizables**: Arquitectura modular y mantenible
- **UI/UX Profesional**: Inspirado en sitios premium de marcas automotrices

## 🚀 Tecnologías Utilizadas

### Core
- **React 18.2** - Biblioteca de UI con Hooks
- **Vite 5.1** - Build tool y dev server ultra-rápido
- **React Router v6** - Navegación SPA

### Estilos
- **Tailwind CSS 3.4** - Framework CSS utility-first
- **Framer Motion 11** - Librería de animaciones
- **Lucide React** - Iconos modernos

### Estado y Datos
- **Zustand 4.5** - Gestión de estado global ligera
- **TanStack Query 5** - Data fetching y cache
- **Axios 1.6** - Cliente HTTP

### Formularios y Validación
- **React Hook Form 7.50** - Gestión de formularios
- **Zod 3.22** - Validación de schemas
- **@hookform/resolvers** - Integración con validadores

### Otros
- **React Hot Toast** - Notificaciones elegantes
- **Swiper 11** - Carrusel de imágenes táctil
- **clsx** - Utilidad para clases condicionales

## 📂 Estructura del Proyecto

```
src/
├── api/                    # Servicios de API
│   ├── axiosConfig.js     # Configuración de Axios
│   ├── authService.js     # Autenticación
│   ├── vehicleService.js  # CRUD de vehículos
│   └── questionService.js # Preguntas y respuestas
├── components/
│   ├── common/            # Componentes reutilizables
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── Badge.jsx
│   │   ├── EmptyState.jsx
│   │   └── ProtectedRoute.jsx
│   ├── layout/            # Componentes de layout
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── Layout.jsx
│   └── vehicles/          # Componentes de vehículos
│       ├── VehicleCard.jsx
│       ├── VehicleFilters.jsx
│       ├── VehicleForm.jsx
│       └── ImageGallery.jsx
├── context/
│   └── AuthContext.jsx    # Context de autenticación
├── hooks/
│   ├── useAuth.js         # Hook de autenticación
│   └── useVehicles.js     # Hook de vehículos
├── pages/
│   ├── Home.jsx           # Landing page
│   ├── VehiclesList.jsx   # Catálogo
│   ├── VehicleDetail.jsx  # Detalle con Q&A
│   ├── Login.jsx          # Inicio de sesión
│   ├── Register.jsx       # Registro
│   └── dashboard/         # Páginas privadas
│       ├── Dashboard.jsx
│       ├── MyVehicles.jsx
│       ├── CreateVehicle.jsx
│       ├── EditVehicle.jsx
│       └── MyQuestions.jsx
├── utils/
│   ├── formatters.js      # Funciones de formato
│   └── validators.js      # Validadores
├── App.jsx                # Rutas principales
├── main.jsx               # Punto de entrada
└── index.css              # Estilos globales
```

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js 18+ instalado
- npm o yarn
- Backend API corriendo en `http://localhost:3000`

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repo>
cd autico-web
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno** (opcional)
Si necesitas cambiar la URL de la API, edita `src/api/axiosConfig.js`:
```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

4. **Iniciar el servidor de desarrollo**
```bash
npm run dev
```

5. **Abrir en el navegador**
```
http://localhost:5173
```

## 📡 Integración con Backend

La aplicación está configurada para conectarse a la API en `http://localhost:3000/api`.

### Endpoints Utilizados

#### Autenticación
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Inicio de sesión (username o email)

#### Vehículos (Públicos)
- `GET /api/vehicles` - Lista con filtros y paginación
- `GET /api/vehicles/:id` - Detalle de vehículo

#### Vehículos (Privados - requieren token)
- `POST /api/vehicles` - Crear vehículo
- `PUT /api/vehicles/:id` - Actualizar vehículo
- `DELETE /api/vehicles/:id` - Eliminar vehículo
- `PATCH /api/vehicles/:id/sold` - Marcar como vendido

#### Preguntas y Respuestas
- `POST /api/vehicles/:vehicleId/questions` - Crear pregunta
- `GET /api/my/questions` - Mis preguntas
- `POST /api/questions/:questionId/answer` - Responder (solo owner)

### Autenticación
El token JWT se guarda en `localStorage` y se envía automáticamente en el header `Authorization: Bearer {token}` de todas las peticiones autenticadas.

## 🎯 Funcionalidades Principales

### Páginas Públicas
- ✅ **Landing Page** con búsqueda, categorías y últimos vehículos
- ✅ **Catálogo** con filtros avanzados (marca, modelo, año, precio, status)
- ✅ **Detalle del Vehículo** con galería de imágenes y sistema de Q&A
- ✅ **Login y Registro** con validación completa

### Dashboard (Privado)
- ✅ **Panel Principal** con estadísticas y accesos rápidos
- ✅ **Mis Vehículos** con opciones de editar, eliminar y marcar como vendido
- ✅ **Publicar Vehículo** con formulario validado y preview de imágenes
- ✅ **Editar Vehículo** con datos precargados
- ✅ **Mis Preguntas** para ver preguntas realizadas y sus respuestas

### Características Adicionales
- 🔒 **Rutas Protegidas** - Redirección automática a login
- 🎨 **Modo Oscuro en Navbar** - Diseño premium
- 📱 **Responsive Design** - Funciona perfecto en móviles
- 🔔 **Notificaciones Toast** - Feedback visual de acciones
- ⚡ **Carga Rápida** - Optimización con React Query
- 🖼️ **Galería con Lightbox** - Visualización ampliada de imágenes
- 🔍 **Búsqueda y Filtros** - Query params en URL para compartir búsquedas

## 🎨 Paleta de Colores

```css
/* Primarios */
--primary: #2C5F8D (Azul metálico)
--secondary: #FF6B35 (Naranja mecánico)
--warning: #FFC300 (Amarillo de advertencia)

/* Oscuros */
--dark-950: #1a1a1a (Negro carbón)
--dark-900: #3d3d3d
--dark-800: #454545

/* Neutros */
--gray-50: #f9fafb
--gray-100: #f3f4f6
```

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Construye para producción
npm run preview      # Preview de build de producción

# Linting
npm run lint         # Ejecuta ESLint
```

## 🚀 Build para Producción

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`.

### Despliegue
Puedes desplegar en cualquier hosting estático:
- **Vercel** (recomendado)
- **Netlify**
- **GitHub Pages**
- **AWS S3 + CloudFront**

## 🔐 Seguridad

- ✅ Tokens JWT almacenados de forma segura
- ✅ Validación de formularios con Zod
- ✅ Sanitización de inputs
- ✅ Protected routes con redirección
- ✅ Manejo de errores 401 (auto-logout)

## 🐛 Solución de Problemas

### Error de conexión a API
Si la aplicación no puede conectar con el backend:
1. Verifica que el backend esté corriendo en `http://localhost:3000`
2. Revisa la URL en `src/api/axiosConfig.js`
3. Verifica que no haya problemas de CORS en el backend

### Errores de autenticación
- Limpia el localStorage: `localStorage.clear()`
- Recarga la página
- Vuelve a iniciar sesión

### Problemas con imágenes
Las imágenes se manejan por URL. Asegúrate de usar URLs válidas de imágenes públicas.

## 📝 Ejemplos de Uso

### Crear un nuevo vehículo
```javascript
const vehicleData = {
  brand: "Toyota",
  model: "Corolla",
  year: 2023,
  price: 350000,
  description: "Vehículo en excelente estado...",
  images: [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ]
};
```

### Aplicar filtros
Los filtros se pueden compartir via URL:
```
/vehicles?brand=Toyota&minYear=2020&maxYear=2024&status=available
```

## 🤝 Contribuciones

Este proyecto fue creado como una solución completa y funcional. Si encuentras algún bug o tienes sugerencias:

1. Crea un issue describiendo el problema
2. Fork el proyecto
3. Crea una rama con tu feature (`git checkout -b feature/AmazingFeature`)
4. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
5. Push a la rama (`git push origin feature/AmazingFeature`)
6. Abre un Pull Request

## 📄 Licencia

Este proyecto es de uso educativo y demostrativo.

## 👨‍💻 Autor

Desarrollado con ❤️ por un Desarrollador Frontend Senior especializado en React y UI/UX moderno.

---

## 🎓 Aprendizajes Clave

Este proyecto demuestra:
- ✅ Arquitectura escalable de React
- ✅ Manejo de estado con Context API y React Query
- ✅ Integración completa con REST API
- ✅ Diseño responsive y moderno con Tailwind
- ✅ Formularios complejos con validación
- ✅ Autenticación y rutas protegidas
- ✅ Optimización de rendimiento
- ✅ Mejores prácticas de código limpio

---

**¡Disfruta construyendo con Autico Web!** 🚗⚙️✨
