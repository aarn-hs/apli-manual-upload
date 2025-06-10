# Sistema de Gestión de Candidatos APLI

Un sistema completo de gestión de candidatos con formulario avanzado de solicitud de empleo, validaciones inteligentes y integración con webhooks.

## 🚀 Características Principales

### Formulario de Candidatos
- **28 campos secuenciales** con validación en tiempo real
- **Validación avanzada de CURP** con algoritmo de dígito verificador oficial
- **Búsqueda inteligente** con capacidades insensibles a acentos
- **Campos dependientes** que se actualizan dinámicamente
- **Interfaz unificada** con componentes UI consistentes

### Validaciones Avanzadas
- **CURP**: Validación completa con códigos de estado, dígito verificador y consistencia con fecha de nacimiento
- **RFC**: Validación de formato y estructura
- **NSS**: Validación de Número de Seguridad Social
- **CLABE**: Validación de cuentas bancarias
- **Fechas**: Validación de fechas de trabajo y coherencia temporal
- **Datos personales**: Validación de nombres, direcciones, teléfonos y emails

### Seguridad
- **Protección iframe** con validación de dominios autorizados
- **Rate limiting** para prevenir abuso
- **Autenticación API** con tokens Bearer
- **Variables de entorno** para configuración segura

### Integración
- **Webhooks n8n** para procesamiento asíncrono
- **Sistema de notificaciones** inline con seguimiento de estado
- **Polling inteligente** para verificar estado de procesamiento
- **Manejo de errores** robusto con reintentos automáticos

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** con TypeScript
- **React Hook Form** para manejo de formularios
- **Zod** para validación y esquemas
- **Tailwind CSS** para estilos responsivos
- **TanStack Query** para manejo de estado del servidor
- **Wouter** para enrutamiento

### Backend
- **Node.js** con Express
- **TypeScript** para tipado estático
- **Drizzle ORM** para base de datos
- **PostgreSQL** como base de datos principal
- **Vite** para desarrollo y build

### Componentes UI
- **Radix UI** para componentes accesibles
- **Lucide React** para iconografía
- **Framer Motion** para animaciones
- **shadcn/ui** como sistema de diseño

## 📋 Requisitos

- Node.js 18+ 
- PostgreSQL 13+
- Variables de entorno configuradas

## 🚦 Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd apli-candidate-system
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Configurar las siguientes variables:
```env
# Protección de dominios
TESTING_MODE=true
ALLOWED_DOMAINS=https://manual-upload.apli.app,https://demo.apli.app,https://apli.app
BLOCK_LOCALHOST=false

# Autenticación API
API_KEYS=tu_api_key_aqui
VITE_WEBHOOK_AUTH_TOKEN=tu_token_webhook

# Webhook n8n
N8N_WEBHOOK_URL=https://tu-instancia-n8n.com/webhook/candidate
VITE_APLI_CANDIDATES_BASE_URL=https://demo.apli.app/candidates
```

4. **Configurar base de datos**
```bash
npm run db:generate
npm run db:migrate
```

5. **Ejecutar en desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5000`

## 🔧 Scripts Disponibles

- `npm run dev` - Ejecutar en modo desarrollo
- `npm run build` - Construir para producción
- `npm run preview` - Previsualizar build de producción
- `npm run db:generate` - Generar migraciones de base de datos
- `npm run db:migrate` - Ejecutar migraciones
- `npm run db:studio` - Abrir Drizzle Studio

## 📐 Arquitectura

### Estructura del Proyecto
```
├── client/               # Frontend React
│   ├── src/
│   │   ├── components/   # Componentes reutilizables
│   │   ├── pages/        # Páginas de la aplicación
│   │   ├── hooks/        # Hooks personalizados
│   │   ├── lib/          # Utilidades y validaciones
│   │   └── main.tsx      # Punto de entrada
├── server/               # Backend Express
│   ├── index.ts          # Servidor principal
│   ├── routes.ts         # Rutas API
│   └── vite.ts          # Configuración Vite
├── shared/               # Código compartido
│   └── schema.ts         # Esquemas de base de datos
└── package.json
```

### Flujo de Datos
1. **Usuario completa formulario** → Validación en tiempo real
2. **Envío de formulario** → Validación servidor + webhook n8n
3. **Procesamiento asíncrono** → Polling de estado
4. **Notificación resultado** → UI actualizada

## 🔒 Seguridad

### Protección Iframe
- Validación de dominios autorizados
- Headers CSP configurados
- Bypass automático en desarrollo

### Autenticación API
- Tokens Bearer para autenticación
- Rate limiting por IP
- Validación de claves API

### Validaciones
- Sanitización de entrada
- Validación servidor y cliente
- Manejo seguro de errores

## 🌐 Dominios Autorizados

### Producción
- `https://manual-upload.apli.app`
- `https://demo.apli.app`
- `https://apli.app`
- `https://recruitment.apli.app`
- `https://manual-upload-apli.replit.app`

### Desarrollo
- `*.replit.dev`
- `*.replit.app`
- `localhost`

## 📊 Validaciones CURP

### Algoritmo Dígito Verificador
```javascript
function calculateCURPCheckDigit(curp: string): string {
  const first17 = curp.substring(0, 17);
  const dictionary = "0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
  let sum = 0;
  
  for (let i = 0; i < 17; i++) {
    const charValue = dictionary.indexOf(first17[i]);
    sum += charValue * (18 - i);
  }
  
  const remainder = sum % 10;
  return remainder === 0 ? '0' : (10 - remainder).toString();
}
```

### Validaciones Incluidas
- Formato correcto (18 caracteres)
- Códigos de estado mexicanos válidos
- Dígito verificador oficial
- Consistencia con fecha de nacimiento
- Validación de nacionalidad

## 🔄 API Endpoints

### Candidatos
- `POST /api/candidates` - Crear nuevo candidato
- `GET /api/check-status/:id` - Verificar estado de procesamiento

### Webhooks
- `POST /api/webhook` - Recibir notificaciones n8n
- `POST /api/webhook-result` - Resultado de procesamiento

### Administración
- `GET /api/admin/queue-status` - Estado de cola
- `GET /api/admin/api-keys/stats` - Estadísticas de uso

## 🐛 Troubleshooting

### Errores Comunes

**Error 403 - Access Denied**
- Verificar dominios en `ALLOWED_DOMAINS`
- Confirmar `TESTING_MODE=true` en desarrollo

**Webhook no funciona**
- Verificar `N8N_WEBHOOK_URL` y `VITE_WEBHOOK_AUTH_TOKEN`
- Comprobar conectividad de red

**Validación CURP falla**
- Verificar formato exacto (18 caracteres)
- Comprobar códigos de estado válidos

## 📝 Licencia

Proyecto propietario - APLI © 2024

## 👥 Contribuir

Para contribuir al proyecto:
1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

---

**Desarrollado con ❤️ para APLI**