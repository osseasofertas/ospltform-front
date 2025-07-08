# SafeMoney - Product Evaluation Mobile App

## Overview

SafeMoney is a mobile-first web application built with React and Express.js that allows users to register, receive a welcome bonus, and earn money by evaluating products through structured questionnaires. The application features a three-stage evaluation system with different question types, real-time balance tracking, and a comprehensive transaction history system.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: Zustand with persistence for global app state
- **Data Fetching**: TanStack Query (React Query) for server state management
- **UI Components**: Radix UI primitives with custom styling
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **Authentication**: Session-based with bcrypt password hashing
- **API Design**: RESTful endpoints with JSON responses
- **Development**: TypeScript with hot reloading via Vite middleware

## Key Components

### Database Schema
The application uses five main tables:
- **Users**: Stores user information, balance, and daily evaluation limits
- **Products**: Contains product details and earning ranges
- **Evaluations**: Tracks user progress through product evaluations
- **Transactions**: Records all financial movements and earnings
- **Questions**: Stores evaluation questions with different types (multiple choice, star rating, free text)

### User Management
- Registration with R$ 289,00 welcome bonus
- Demo account option for testing
- Session-based authentication with password hashing
- Daily evaluation limits (25 per day) with reset mechanism

### Evaluation System
- Three-stage evaluation process per product
- Five questions per stage with varied question types
- Auto-save functionality for user progress
- Progressive earnings (R$ 1,00 - R$ 4,00 per evaluation)
- Resume capability for incomplete evaluations

### Question Types
- **Multiple Choice**: Radio button selection from predefined options
- **Star Rating**: 1-5 star rating system with custom labels
- **Free Text**: Textarea input for detailed feedback

## Data Flow

1. **User Registration**: Creates user account with welcome bonus transaction
2. **Product Selection**: Users browse available products with earning potential
3. **Evaluation Process**: 
   - Create evaluation record
   - Progress through three stages
   - Auto-save answers after each response
   - Calculate earnings upon completion
4. **Transaction Recording**: All earnings and bonuses are tracked in transaction history
5. **Balance Updates**: Real-time balance updates reflect completed evaluations

## External Dependencies

### Core Libraries
- **Database**: @neondatabase/serverless, drizzle-orm, drizzle-kit
- **Authentication**: bcryptjs for password hashing
- **UI Components**: Complete Radix UI suite for accessibility
- **State Management**: zustand with persist middleware
- **Data Fetching**: @tanstack/react-query
- **Forms**: react-hook-form with @hookform/resolvers
- **Styling**: tailwindcss, class-variance-authority, clsx

### Development Tools
- **Build**: Vite with React plugin
- **TypeScript**: Full type safety across frontend and backend
- **Replit Integration**: Custom plugins for development environment

## Deployment Strategy

The application is designed for deployment on Replit with the following structure:

### Build Process
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Database**: Drizzle migrations stored in `migrations/` folder

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string for Neon database
- `NODE_ENV`: Environment setting (development/production)

### Scripts
- `dev`: Development server with TypeScript compilation
- `build`: Production build for both frontend and backend
- `start`: Production server startup
- `db:push`: Database schema deployment

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- July 08, 2025. Initial setup