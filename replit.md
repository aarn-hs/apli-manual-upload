# Apli - Candidate Management System

## Overview

This project is a full-stack candidate management system for retail companies, built with React, Express, and Drizzle ORM. The application allows users to register and manage candidate information with a multi-step form process, storing the data in a database.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern client-server architecture:

1. **Frontend**: React-based SPA with TypeScript, built using Vite.
2. **Backend**: Express.js server providing RESTful API endpoints.
3. **Database**: Drizzle ORM for database operations, configured for PostgreSQL.
4. **Styling**: TailwindCSS with shadcn/ui components.

The frontend and backend are clearly separated but share type definitions through a shared folder structure. The application uses a single-page architecture with routing handled by Wouter on the client side.

## Key Components

### Frontend

1. **Component Structure**:
   - UI components based on shadcn/ui and Radix UI primitives
   - Custom form components for the candidate registration process
   - Layout components (Header, Footer) for consistent page structure

2. **State Management**:
   - React Hook Form for form state management and validation
   - Zod for schema validation
   - React Query for server-state management

3. **Multi-step Form**:
   - The candidate registration form is divided into sections:
     - Basic Information
     - Employment Information
     - Personal Information
     - Contract Information
     - Emergency Contacts
     - Dependents

### Backend

1. **Server**:
   - Express.js server with JSON parsing middleware
   - API routes for candidate management
   - Request logging for debugging

2. **Storage**:
   - Drizzle ORM for database interactions
   - Schema definitions for candidates and dependents
   - In-memory storage fallback implementation

3. **API Endpoints**:
   - POST `/api/candidates` - Create a new candidate with optional dependents

### Shared

1. **Schema Definitions**:
   - Candidate schema with personal and employment information
   - Dependent schema for candidate family members
   - Zod validation schemas for form validation

2. **Type Definitions**:
   - TypeScript interfaces for data models
   - Shared validation utilities

## Data Flow

1. **Candidate Registration**:
   - User fills out a multi-step form with candidate information
   - Form data is validated using Zod schemas
   - On submission, data is sent to the backend API
   - Backend validates the data again and stores it in the database
   - Success confirmation is shown to the user

2. **API Interaction**:
   - API requests are made using the Fetch API
   - Response data is handled with React Query for caching and state management
   - Error handling is implemented at both client and server levels

## External Dependencies

### Frontend Libraries
- React and React DOM for UI rendering
- React Hook Form with Zod resolver for form management
- Radix UI components for accessible UI primitives
- TailwindCSS for styling
- Wouter for client-side routing
- Lucide for icons

### Backend Libraries
- Express for the HTTP server
- Drizzle ORM for database operations
- Zod for validation

### Development Tools
- TypeScript for type safety
- Vite for frontend development and building
- ESBuild for backend building
- Tailwind for CSS generation

## Deployment Strategy

The application is set up for deployment on Replit with the following configuration:

1. **Development Mode**:
   - `npm run dev` starts both the frontend Vite server and backend Express server
   - Hot module reloading is enabled for frontend changes

2. **Production Build**:
   - `npm run build` compiles both frontend and backend
   - Frontend is built with Vite and outputs to `dist/public`
   - Backend is bundled with ESBuild to `dist/index.js`

3. **Production Start**:
   - `npm run start` runs the built application in production mode
   - Static assets are served from the `dist/public` directory

4. **Database**:
   - The application requires a PostgreSQL database configured via `DATABASE_URL` environment variable
   - Drizzle is used for schema management and migrations

## Getting Started

1. Make sure PostgreSQL is provisioned in your Replit
2. Set the `DATABASE_URL` environment variable to your PostgreSQL connection string
3. Run `npm run dev` to start the development server
4. Visit the preview URL to see the application

## Code Structure

- `/client` - Frontend React application
  - `/src` - Source code
    - `/components` - UI components including shadcn/ui components
    - `/hooks` - Custom React hooks
    - `/lib` - Utilities, schemas, and helper functions
    - `/pages` - Page components

- `/server` - Backend Express server
  - `index.ts` - Server entry point
  - `routes.ts` - API route definitions
  - `storage.ts` - Database abstraction layer
  - `vite.ts` - Vite middleware configuration

- `/shared` - Shared code between frontend and backend
  - `schema.ts` - Database schema and type definitions

## Common Tasks

1. **Adding a new API endpoint**:
   - Add the route handler in `server/routes.ts`
   - Create corresponding client-side fetch function in a React component or hook

2. **Adding a new form field**:
   - Update the schema in `shared/schema.ts`
   - Add the field to the appropriate form component
   - Update validation in `client/src/lib/schemas.ts`

3. **Modifying the database schema**:
   - Update the schema in `shared/schema.ts`
   - Run `npm run db:push` to apply changes to the database

4. **Adding a new page**:
   - Create a new component in `client/src/pages`
   - Add the route to the router in `client/src/App.tsx`