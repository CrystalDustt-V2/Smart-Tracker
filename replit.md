# Smart Tracker IoT Dashboard

## Overview

Smart Tracker is a comprehensive IoT dashboard application that combines GPS tracking, weather monitoring, activity reminders, and smart outfit recommendations into a unified platform. The system provides real-time monitoring capabilities for IoT devices with features like location tracking, environmental data collection, emergency alerts, and intelligent lifestyle recommendations.

The application follows a modern full-stack architecture with a React frontend, Express backend, and PostgreSQL database, designed to handle multiple IoT devices and provide users with actionable insights about their environment and activities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Framework**: Tailwind CSS with shadcn/ui component library for consistent, modern design
- **Theme System**: Custom dark/light theme provider with CSS variables for dynamic theming
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for enhanced developer experience and type safety
- **Authentication**: Replit Auth integration with OpenID Connect for secure user authentication
- **Session Management**: PostgreSQL-based session storage with connect-pg-simple
- **API Design**: RESTful endpoints with proper error handling and request/response validation
- **Real-time Communication**: WebSocket support for live device updates

### Database Design
- **Primary Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Cloud Provider**: Neon Database for managed PostgreSQL hosting
- **Schema**: Comprehensive relational model supporting:
  - User management and preferences
  - Device registration and status tracking
  - Location history with GPS coordinates
  - Weather data collection and history
  - Activity scheduling and completion tracking
  - Outfit recommendations based on weather conditions
  - Emergency contacts and alert system

### Design System
- **Visual Theme**: Dark-first design with neon green accents for IoT dashboard aesthetics
- **Typography**: Inter for UI text, JetBrains Mono for data displays and coordinates
- **Component Strategy**: Modular, reusable components with consistent spacing and interaction patterns
- **Responsive Design**: Mobile-first approach with adaptive layouts for different screen sizes

### Authentication & Security
- **Provider**: Replit Auth with OIDC for secure user authentication
- **Session Handling**: Server-side sessions with PostgreSQL storage
- **Authorization**: Route-level protection with user context management
- **Error Handling**: Centralized error handling with appropriate HTTP status codes

## External Dependencies

### Core Infrastructure
- **Neon Database**: Managed PostgreSQL hosting for data persistence
- **Replit Auth**: Identity provider for user authentication and session management

### Development Tools
- **Drizzle Kit**: Database schema management and migrations
- **shadcn/ui**: Pre-built component library with Radix UI primitives
- **TanStack Query**: Advanced data fetching and caching layer

### Frontend Libraries
- **Radix UI**: Headless UI primitives for accessible component foundations
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Wouter**: Minimalist routing library for React applications
- **Lucide React**: Icon library with consistent design language

### Backend Services
- **Express.js**: Web application framework for Node.js
- **connect-pg-simple**: PostgreSQL session store for Express sessions
- **ws**: WebSocket library for real-time communication capabilities

### Fonts & Assets
- **Google Fonts**: Inter and JetBrains Mono for typography consistency
- **Generated Images**: Custom IoT device imagery for hero sections and branding