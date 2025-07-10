# APLI Candidate Management System

## Overview

This is a comprehensive candidate management system for APLI, designed to handle job applications with advanced form validation, iframe security, and webhook integration. The system provides a sophisticated form with 28 sequential fields, intelligent validation including CURP (Mexican ID) verification, and secure iframe embedding capabilities for integration with external platforms.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for type safety and modern development
- **Single Page Application (SPA)** using Wouter for lightweight routing
- **Component-based architecture** with shadcn/ui components for consistent UI
- **Form management** using React Hook Form with Zod schema validation
- **State management** via TanStack Query for server state and React hooks for local state
- **Responsive design** with Tailwind CSS following APLI design guidelines

### Backend Architecture
- **Node.js/Express** server with TypeScript
- **RESTful API** design with structured endpoints
- **Middleware-based architecture** for security, CORS, and domain validation
- **Rate limiting** and request queuing to prevent abuse
- **Session management** using connect-pg-simple for PostgreSQL sessions

### Data Storage
- **PostgreSQL** database with Drizzle ORM for type-safe database operations
- **Candidate schema** with 28+ validated fields including personal data, work history, and preferences
- **Database migrations** managed through Drizzle Kit
- **Connection pooling** via Neon serverless PostgreSQL

## Key Components

### Form Validation System
- **CURP Validation**: Complete Mexican CURP validation with check digit algorithm, state codes verification, and birth date consistency
- **Real-time validation**: Field-level validation with immediate feedback
- **Dependent field updates**: Dynamic field updates based on user input (e.g., municipalities based on state selection)
- **Input sanitization**: Automatic text cleaning, case conversion, and space normalization

### Security Features
- **API Key Authentication**: Bearer token authentication for API endpoints (maintained for webhook security)
- **Open CORS Policy**: Permissive cross-origin resource sharing for iframe embedding
- **Universal Iframe Access**: Application can be embedded in any domain including localhost

### External Integrations
- **n8n Webhook Integration**: Asynchronous candidate processing through webhook endpoints
- **Polling System**: Intelligent status checking for long-running processes
- **Notification System**: Inline notifications with success/error handling
- **Cross-domain Communication**: PostMessage API for iframe height adjustment

## Data Flow

1. **User Input**: Candidate fills out the 28-field form with real-time validation
2. **Client Validation**: Zod schema validation on the frontend with immediate feedback
3. **Submission**: Form data sent to Express API without restrictions
4. **Server Validation**: Additional server-side validation and sanitization
5. **Database Storage**: Candidate data stored in PostgreSQL via Drizzle ORM
6. **Webhook Processing**: Data sent to n8n webhook for external processing
7. **Status Tracking**: Polling system monitors webhook processing status
8. **User Feedback**: Success/error notifications displayed to user

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React 18, React Hook Form, React Query
- **UI Framework**: Radix UI primitives with shadcn/ui components
- **Validation**: Zod for schema validation
- **Database**: Drizzle ORM with PostgreSQL via Neon
- **Build Tools**: Vite for development and production builds
- **Styling**: Tailwind CSS with custom APLI color palette

### Development Dependencies
- **TypeScript**: Static typing across frontend and backend
- **ESBuild**: Fast bundling for production builds
- **PostCSS**: CSS processing with autoprefixer

## Deployment Strategy

### Replit Configuration
- **Autoscale deployment** target for production
- **Node.js 20** runtime with PostgreSQL 16 database
- **Port configuration**: Application runs on port 5000, exposed on port 80
- **Development workflow**: Automatic restart on file changes

### Environment Configuration
- **Open Access**: Application accessible from any domain without restrictions
- **API Authentication**: Environment-based API key management for webhook endpoints
- **Webhook URLs**: Configurable n8n integration endpoints

### Build Process
1. **Frontend Build**: Vite builds React application to static assets
2. **Backend Build**: ESBuild bundles Express server for production
3. **Database Setup**: Drizzle migrations ensure database schema consistency
4. **Asset Optimization**: Static assets served efficiently in production

## Changelog

- July 10, 2025. Removed all domain verification, IP rate limiting, and iframe blocking restrictions for universal iframe access
- June 17, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.