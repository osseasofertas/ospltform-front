# SafeMoney - Product Evaluation Mobile App

## Overview

SafeMoney is a mobile-first web application built with React and Express.js that allows users to register, receive a welcome bonus, and earn money by evaluating products through structured questionnaires. The application features a three-stage evaluation system with different question types, real-time balance tracking, and a comprehensive transaction history system. All monetary values are displayed in USD currency.

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
- Registration with $50.00 welcome bonus
- Demo account option for testing
- Session-based authentication with password hashing
- Daily evaluation limits (25 per day) with reset mechanism

### Evaluation System
- Three-stage evaluation process per product
- Five questions per stage with varied question types
- Auto-save functionality for user progress
- Progressive earnings ($1.00 - $4.00 per evaluation)
- Resume capability for incomplete evaluations

### Question Types
- **Multiple Choice**: Radio button selection from predefined options
- **Star Rating**: 1-5 star rating system with custom labels
- **Free Text**: Textarea input for detailed feedback

## Data Flow

1. **User Registration**: Creates user account with $50.00 welcome bonus transaction
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

The application is designed for deployment on both Replit and Vercel with the following structure:

### Build Process
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Database**: Drizzle migrations stored in `migrations/` folder

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string for Neon database
- `NODE_ENV`: Environment setting (development/production)
- `PGHOST`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`, `PGPORT`: Database connection details

### Scripts
- `dev`: Development server with TypeScript compilation
- `build`: Production build for both frontend and backend
- `start`: Production server startup
- `db:push`: Database schema deployment

### Vercel Deployment Configuration
- **vercel.json**: Main deployment configuration with serverless functions
- **api/index.ts**: Serverless function entry point for Express.js backend
- **tsconfig.server.json**: TypeScript configuration for server compilation
- **.vercelignore**: Files excluded from deployment
- **VERCEL_DEPLOYMENT.md**: Complete deployment guide and troubleshooting
- **scripts/deploy.sh**: Automated deployment script

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

- **Complete Backend Removal & Full localStorage Migration (July 12, 2025)**:
  - Removed entire backend (Express.js, database, API routes)
  - Migrated all data to localStorage/sessionStorage using Zustand persist
  - Enhanced daily statistics tracking with detailed content evaluation history
  - Added comprehensive earnings tracking by day, content type, and individual evaluations
  - Implemented weekly earnings calculation and today's activity summary
  - Updated wallet page with detailed daily breakdown, transaction history, and real-time stats
  - Application now runs completely frontend-only with Vite dev server
  - Ready for export as standalone HTML/JS/CSS with images in public folder
  - All balance, evaluation counts, earnings, and user data stored in browser storage
  - No API calls or server dependencies remaining

- **Content-Based Evaluation System with Video Support (July 11, 2025)**:
  - Converted from product evaluation to content evaluation system
  - Added support for 2 videos + 8 photos daily, rotating every 7 days
  - Implemented new reward structure: $6-$10 for photos, $20-$40 for videos
  - Created specialized evaluation forms: 3 targeted questions for photos, star rating + feedback for videos
  - Photo questions focus on imagination provocation, body presentation, and feed engagement
  - Added video completion requirement - users must watch entire video before rating
  - Built content rotation system that changes every 7 days automatically
  - Prepared structure for frontend-only hosting without backend dependencies
  - Updated OnlyFans-style blue branding throughout application

- **Complete Frontend-Only Authentication & Global Security System (July 10, 2025)**:
  - 100% frontend-only authentication using localStorage (no backend API calls)
  - Email-only login creates user profiles automatically with $50.00 starting balance
  - All user data stored in browser localStorage through Zustand persist middleware
  - Global 7-day security lockout: after ANY logout, ALL login attempts blocked for 7 days
  - Daily evaluation limits (10/day) enforced entirely in frontend with automatic reset
  - Complete transaction history and balance management in localStorage
  - Real-time statistics tracking without any database dependencies
  - Universal blocking system prevents access with any email after logout

- **Authentication System Streamlining & Email Enhancement (July 10, 2025)**:
  - Removed registration functionality, keeping only login system
  - Added email masks for popular English-speaking country domains (@gmail.com, @yahoo.com, @outlook.com, @hotmail.com, @icloud.com, @aol.com, @protonmail.com)
  - Implemented clickable email domain suggestions for quick completion
  - Added payment email instruction text: "Fill in with your payment email"
  - Simplified user authentication flow for better user experience
  - Maintained demo account functionality for testing purposes

- **Complete Spanish to English Translation (July 10, 2025)**:
  - Translated all Spanish content throughout the application to English
  - Updated all user interface text, error messages, and navigation elements
  - Translated comprehensive survey questions (15 questions across 3 stages)
  - Converted product categories and descriptions to English
  - Updated server-side error messages and API responses
  - Translated transaction descriptions and user feedback messages
  - Completed support/FAQ page translation with updated content for localStorage system
  - Maintained consistent English terminology across frontend and backend
  - Ensured all user-facing content is now in English for better accessibility

- **Vercel Deployment Configuration & Fixes (July 08, 2025)**:
  - Created complete Vercel deployment setup with vercel.json configuration
  - Implemented serverless function architecture in api/index.ts
  - Fixed deployment errors by removing incorrect secret references from vercel.json
  - Simplified environment variable configuration to use only DATABASE_URL
  - Added health check endpoint (/api/health) for deployment verification
  - Optimized CORS configuration specifically for Vercel environment
  - Created comprehensive troubleshooting guide (VERCEL_DEPLOY_FIX.md)
  - Added TypeScript configuration for server compilation (tsconfig.server.json)
  - Prepared .vercelignore file for optimized deployment

- **Enhanced User Experience & Visual Design (July 08, 2025)**:
  - Fixed evaluation progress bar to show accurate question counts dynamically
  - Implemented Instagram-style product images with square aspect ratio for better visualization
  - Added daily evaluation limit of 10 products per day with proper error handling
  - Hidden total product count from users to improve UX flow
  - Updated product grid to 2-column layout for mobile-first Instagram-style display
  - Enhanced question variety with strategic mix of multiple choice and open-ended questions
  - Created comprehensive 15-question evaluation system (5 per stage, 3 open-ended per stage)
  - Fixed single-click auto-advance for radio buttons and star ratings (300ms delay)
  - Resolved infinite loop issues in evaluation component for smooth user experience

## Changelog

- July 08, 2025: **Currency conversion from Brazilian Real to USD** - All monetary values converted from R$ to $ (USD): welcome bonus from R$ 289,00 to $50.00, evaluation earnings from R$ 1,00-4,00 to $1.00-4.00, updated budget questions and all UI displays
- July 08, 2025: Enhanced evaluation system with draft recovery and improved autosave
- July 08, 2025: Initial setup with basic functionality