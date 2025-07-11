# replit.md

## Overview

This is a comprehensive candidate management system called "Sistema de Gestión de Candidatos APLI" built for retail companies. The system provides an advanced job application form with intelligent validations, real-time processing, and webhook integrations. It's designed to handle candidate data collection with sophisticated validation rules, particularly for Mexican identification documents like CURP, RFC, and NSS.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for type safety
- **Vite** for fast development and optimized builds
- **React Hook Form** for advanced form management with validation
- **Tailwind CSS** with custom design system based on Apli brand colors
- **Wouter** for lightweight client-side routing
- **TanStack Query** for server state management
- **Zod** for schema validation and type inference

### Backend Architecture
- **Node.js with Express** server in TypeScript
- **RESTful API** design with comprehensive error handling
- **Drizzle ORM** for database operations with PostgreSQL
- **Rate limiting** and authentication middleware
- **Webhook integration** for external processing

### Key Design Decisions

1. **Monorepo Structure**: Client and server code in single repository with shared schemas
2. **Form-First Approach**: Complex multi-step form with 28+ fields and intelligent validation
3. **Real-time Validation**: Immediate feedback on user input with context-aware rules
4. **Iframe Embedding**: Designed to be embedded in third-party applications with security controls
5. **Progressive Enhancement**: Works without JavaScript but enhanced with React

## Key Components

### Form System
- **Sequential 28-field form** with dependencies between fields
- **Advanced CURP validation** with official check digit algorithm
- **Smart municipality filtering** based on selected state
- **Real-time field validation** with immediate user feedback
- **Auto-formatting** of user inputs (names, addresses, etc.)

### Validation Engine
- **CURP validation** with birth date consistency checking
- **RFC format validation** for tax identification
- **NSS validation** for social security numbers
- **CLABE validation** for bank account numbers
- **Date validation** with temporal logic checks
- **Phone number validation** with Mexican format rules

### Security Features
- **Domain-based iframe protection** with allowlist
- **API key authentication** for external integrations
- **Rate limiting** to prevent abuse
- **Input sanitization** and XSS protection
- **CORS configuration** for controlled access

### Integration Layer
- **n8n webhook integration** for async processing
- **Polling mechanism** for status updates
- **Notification system** with inline feedback
- **Error handling** with retry mechanisms

## Data Flow

1. **User Input**: Form data collected through React Hook Form
2. **Client Validation**: Zod schemas validate data before submission
3. **Server Processing**: Express API validates and stores data
4. **Database Storage**: Drizzle ORM handles PostgreSQL operations
5. **Webhook Trigger**: External n8n workflow processes candidate data
6. **Status Polling**: Client polls for processing completion
7. **User Feedback**: Success/error notifications displayed inline

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **@radix-ui/react-***: Accessible UI component primitives
- **@tanstack/react-query**: Server state management
- **drizzle-orm**: Type-safe database operations
- **react-hook-form**: Form state management
- **zod**: Schema validation

### Development Dependencies
- **Vite**: Build tool and dev server
- **TypeScript**: Static type checking
- **Tailwind CSS**: Utility-first CSS framework
- **ESBuild**: Fast JavaScript bundler

### External Services
- **n8n**: Workflow automation platform for webhook processing
- **PostgreSQL**: Primary database for candidate storage
- **Replit**: Development and deployment platform

## Deployment Strategy

### Development Environment
- **Vite dev server** with HMR for fast development
- **Express middleware** integration for API routes
- **Environment variables** for configuration
- **TypeScript compilation** with strict mode

### Production Build
- **Vite build** for optimized client bundle
- **ESBuild** for server-side bundling
- **Static asset serving** from Express
- **Environment-based configuration**

### Database Management
- **Drizzle migrations** for schema management
- **Connection pooling** for performance
- **Environment-specific databases** (dev/prod)

### Monitoring and Logging
- **Request/response logging** with timing
- **Error tracking** with detailed context
- **Performance monitoring** for form submissions
- **Webhook status tracking** for external integrations

The system is designed to be scalable, maintainable, and secure while providing an excellent user experience for candidate registration and management.