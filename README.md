# Sistema de Seguimiento de Candidatos (ATS)

Un sofisticado formulario de seguimiento de candidatos con capacidades dinámicas avanzadas y diseño de experiencia de usuario inteligente.

## 🚀 Características Principales

- **Arquitectura de formulario dinámico** basado en React con diseños responsivos para móvil y escritorio
- **Validación de formulario en tiempo real** con interacciones de campo adaptativas
- **Flujo de trabajo integral** de captura de información de candidatos en múltiples secciones
- **Generación de identificadores únicos** para seguimiento de envíos
- **Integración con webhook mejorada** con manejo flexible de datos de usuario

## 🛠️ Stack Tecnológico

### Frontend
- **React** con TypeScript
- **Vite** para desarrollo y construcción
- **React Hook Form** con validación Zod
- **Tailwind CSS** para estilos
- **Radix UI** para componentes de interfaz
- **Wouter** para enrutamiento

### Backend
- **Express.js** con TypeScript
- **Drizzle ORM** para manejo de base de datos
- **Zod** para validación de esquemas
- **PostgreSQL** (opcional)

### Herramientas de Desarrollo
- **TypeScript** para tipado estático
- **ESBuild** para construcción rápida
- **PostCSS** para procesamiento de CSS

## 📋 Requisitos Previos

- Node.js (versión 18 o superior)
- npm o yarn
- Base de datos PostgreSQL (opcional, se puede usar almacenamiento en memoria)

## 🔧 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd ats-form-system
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno** (opcional)
   ```bash
   cp .env.example .env
   ```
   Edita el archivo `.env` con tus configuraciones específicas.

4. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

El servidor se ejecutará en `http://localhost:5000`

## 📁 Estructura del Proyecto

```
├── client/                     # Frontend React
│   ├── src/
│   │   ├── components/         # Componentes reutilizables
│   │   │   ├── ui/            # Componentes de UI base
│   │   │   ├── FormSections/  # Secciones del formulario
│   │   │   └── layout/        # Componentes de layout
│   │   ├── hooks/             # Custom hooks
│   │   ├── lib/               # Utilidades y configuraciones
│   │   ├── pages/             # Páginas de la aplicación
│   │   └── main.tsx           # Punto de entrada
├── server/                     # Backend Express
│   ├── index.ts               # Servidor principal
│   ├── routes.ts              # Rutas de la API
│   └── vite.ts                # Configuración de Vite
├── shared/                     # Código compartido
│   └── schema.ts              # Esquemas de base de datos
└── README.md
```

## 🎯 Funcionalidades del Formulario

### Secciones del Formulario

1. **Información Básica**
   - Fuente/Agencia
   - Posición y ubicación
   - PMX (identificador único)

2. **Datos Personales**
   - Nombres y apellidos
   - Fecha de nacimiento
   - Contacto (email, teléfono)
   - Género y nacionalidad

3. **Información de Dirección**
   - Dirección completa
   - Estado y municipio
   - Código postal

4. **Información Adicional**
   - Nivel educativo
   - Estado civil
   - Experiencia laboral previa
   - Motivación

5. **Información Legal**
   - CURP con validación automática
   - Ajustes por discapacidad (opcional)

### Validaciones Incluidas

- **CURP**: Validación de formato y consistencia con fecha de nacimiento
- **Teléfono**: Formato mexicano (10 dígitos)
- **Email**: Validación estándar de email
- **Código Postal**: Formato mexicano (5 dígitos)
- **Campos requeridos**: Marcados con asterisco rojo

## 🔄 API y Webhook

### Endpoint Principal
```
POST /api/candidates
```

### Estructura de Datos Enviados
```json
{
  "source": "string",
  "position": "string",
  "location": "string",
  "pmx": "string",
  "firstName": "string",
  "firstLastName": "string",
  "secondLastName": "string",
  "birthDate": "string",
  "email": "string",
  "phone": "string",
  "gender": "string",
  "nationality": "string",
  "streetAndNumber": "string",
  "interiorNumber": "string",
  "neighborhood": "string",
  "municipality": "string",
  "state": "string",
  "postalCode": "string",
  "education": "string",
  "maritalStatus": "string",
  "previousCompany": "string",
  "previousPosition": "string",
  "previousTasks": "string",
  "retailExperience": "string",
  "motivation": "string",
  "curp": "string",
  "hasDisability": "string"
}
```

## 🎨 Personalización

### Estilos
Los estilos se pueden personalizar editando:
- `client/src/index.css` - Estilos globales
- `tailwind.config.ts` - Configuración de Tailwind

### Validaciones
Las validaciones se definen en:
- `client/src/lib/validation.ts` - Funciones de validación
- `client/src/lib/simplified-schema.ts` - Esquema Zod del formulario

### Datos de Opciones
Los datos para dropdowns se configuran en:
- `client/src/lib/data.ts` - Todas las opciones de selección

## 🚀 Despliegue

### Desarrollo
```bash
npm run dev
```

### Construcción para Producción
```bash
npm run build
```

### Ejecutar en Producción
```bash
npm start
```

## 📝 Configuración de Base de Datos

El proyecto está configurado para usar PostgreSQL con Drizzle ORM. Para configurar:

1. **Crear base de datos PostgreSQL**
2. **Configurar variables de entorno**
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/ats_db
   ```
3. **Ejecutar migraciones**
   ```bash
   npm run db:push
   ```

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Para soporte o preguntas sobre el proyecto, por favor:
- Abre un issue en GitHub
- Contacta al equipo de desarrollo

## 📈 Roadmap

- [ ] Integración con sistemas de RRHH externos
- [ ] Dashboard de administración
- [ ] Reportes y analytics
- [ ] Notificaciones por email
- [ ] API para integraciones externas
- [ ] Modo offline con sincronización

---

**Desarrollado con ❤️ para optimizar el proceso de reclutamiento**