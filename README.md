# TaskFlow AI

<div align="center">

![TaskFlow AI](./public/images/landing-page.png)

**An AI-powered task management and project planning platform built with Next.js 15, React 19, and Prisma.**

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.17.0-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Routes](#api-routes)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**TaskFlow AI** is a modern, full-stack task management platform that leverages artificial intelligence to help you organize, prioritize, and complete your tasks more efficiently. Built with the latest web technologies, it offers real-time collaboration, intelligent task analysis, and seamless project management capabilities.

### Why TaskFlow AI?

- **AI-Powered Insights**: Get intelligent suggestions and task analysis using OpenAI
- **Real-Time Updates**: Stay synchronized with live notifications and updates
- **Drag-and-Drop Interface**: Intuitive task organization with @dnd-kit
- **Subscription Management**: Integrated Stripe payments for premium features
- **Modern Stack**: Built on Next.js 15 with React 19 and Turbopack for blazing-fast development
- **Fully Typed**: End-to-end type safety with TypeScript and Prisma
- **Responsive Design**: Beautiful UI that works on all devices

---

## Features

### Core Features

- **AI-Powered Task Analysis** - Leverage OpenAI to analyze tasks, generate insights, and provide intelligent recommendations
- **Project Management** - Organize tasks into projects with custom colors, detailed tracking, and progress monitoring
- **Task Organization** - Create, update, and manage tasks with priorities, statuses, due dates, and subtasks
- **Drag-and-Drop Interface** - Intuitive task reordering and organization with smooth animations
- **User Authentication** - Secure authentication system with NextAuth.js
- **Real-Time Notifications** - Stay updated with task changes, comments, and project updates
- **Search Functionality** - Quickly find tasks and projects with powerful search capabilities
- **Comments & Activity Log** - Collaborate with team members through task comments and track all changes
- **Subscription Management** - Flexible pricing tiers with Stripe integration (Free, Pro, Enterprise)
- **Dark Mode Support** - Eye-friendly dark theme with next-themes
- **Responsive Design** - Seamless experience across desktop, tablet, and mobile devices

### AI Features

- **Task Analysis**: Get AI-powered insights on task complexity, estimated time, and suggested subtasks
- **Project Insights**: Analyze entire projects for bottlenecks and optimization opportunities
- **Smart Suggestions**: Receive contextual recommendations based on your work patterns
- **AI Chat**: Interactive AI assistant to help with task planning and organization
- **Automated Notifications**: Smart notifications for overdue tasks and upcoming deadlines

### User Management

- **Secure Authentication**: Email/password authentication with bcrypt encryption
- **User Profiles**: Customizable profiles with avatar support
- **Subscription Tiers**: Free, Pro, and Enterprise plans
- **Usage Tracking**: Monitor AI feature usage and costs

---

## Screenshots

### Landing Page
![Landing Page](./public/images/landing-page.png)
*Modern, responsive landing page showcasing the platform's features*

### Authentication

<table>
  <tr>
    <td width="50%">
      <h4>Login Page</h4>
      <img src="./public/images/login.png" alt="Login Page" />
    </td>
    <td width="50%">
      <h4>Register Page</h4>
      <img src="./public/images/register.png" alt="Register Page" />
    </td>
  </tr>
</table>

*Secure authentication with modern UI design*

### Dashboard

<table>
  <tr>
    <td width="50%">
      <h4>Dashboard Overview</h4>
      <img src="./public/images/dashboard-stats.png" alt="Dashboard Stats" />
      <p><em>Comprehensive statistics and insights at a glance</em></p>
    </td>
    <td width="50%">
      <h4>Recent Tasks</h4>
      <img src="./public/images/dashboard-tasks.png" alt="Dashboard Tasks" />
      <p><em>Quick access to your most recent and important tasks</em></p>
    </td>
  </tr>
</table>

### Task Management

<table>
  <tr>
    <td width="50%">
      <h4>Tasks List View</h4>
      <img src="./public/images/tasks-list.png" alt="Tasks List" />
      <p><em>Organize and filter tasks by status, priority, and project</em></p>
    </td>
    <td width="50%">
      <h4>Task Detail View</h4>
      <img src="./public/images/task-detail.png" alt="Task Detail" />
      <p><em>Detailed task view with comments, activity log, and AI insights</em></p>
    </td>
  </tr>
</table>

### Project Management

<table>
  <tr>
    <td width="50%">
      <h4>Projects Overview</h4>
      <img src="./public/images/projects-list.png" alt="Projects List" />
      <p><em>Manage multiple projects with color-coded organization</em></p>
    </td>
    <td width="50%">
      <h4>Project Details</h4>
      <img src="./public/images/projects-detail.png" alt="Project Details" />
      <p><em>Track project progress and manage tasks within projects</em></p>
    </td>
  </tr>
</table>

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **[Next.js](https://nextjs.org/)** | 15.5.4 | React framework with App Router and Server Components |
| **[React](https://react.dev/)** | 19.1.0 | UI library with latest features |
| **[TypeScript](https://www.typescriptlang.org/)** | 5 | Type-safe development |
| **[Tailwind CSS](https://tailwindcss.com/)** | 4 | Utility-first styling |
| **[Radix UI](https://www.radix-ui.com/)** | Latest | Accessible UI components |
| **[Framer Motion](https://www.framer.com/motion/)** | 12.23.22 | Animation library |
| **[Lucide React](https://lucide.dev/)** | 0.545.0 | Icon library |
| **[@dnd-kit](https://dndkit.com/)** | 6.3.1 | Drag-and-drop functionality |
| **[next-themes](https://github.com/pacocoursey/next-themes)** | 0.4.6 | Dark mode support |
| **[Sonner](https://sonner.emilkowal.ski/)** | 2.0.7 | Toast notifications |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **[Prisma](https://www.prisma.io/)** | 6.17.0 | ORM for database management |
| **[PostgreSQL](https://www.postgresql.org/)** | - | Relational database |
| **[NextAuth.js](https://next-auth.js.org/)** | 4.24.11 | Authentication solution |
| **[bcryptjs](https://github.com/dcodeIO/bcrypt.js)** | 3.0.2 | Password hashing |
| **[Zod](https://zod.dev/)** | 4.1.12 | Schema validation |

### AI & Integrations

| Technology | Version | Purpose |
|------------|---------|---------|
| **[OpenAI](https://openai.com/)** | 6.2.0 | AI-powered features |
| **[Stripe](https://stripe.com/)** | 19.1.0 | Payment processing |

### Development Tools

| Technology | Version | Purpose |
|------------|---------|---------|
| **[Turbopack](https://turbo.build/pack)** | Built-in | Fast bundler for development |
| **[ESLint](https://eslint.org/)** | 9 | Code linting |
| **[tsx](https://github.com/privatenumber/tsx)** | 4.20.6 | TypeScript execution |

---

## Project Architecture

```
taskflow-ai/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes (public)
│   │   ├── login/
│   │   │   └── page.tsx          # Login page
│   │   └── register/
│   │       └── page.tsx          # Registration page
│   │
│   ├── (dashboard)/              # Protected dashboard routes
│   │   └── dashboard/
│   │       ├── layout.tsx        # Dashboard layout with navigation
│   │       ├── page.tsx          # Dashboard home (stats & overview)
│   │       ├── tasks/
│   │       │   ├── page.tsx      # All tasks list
│   │       │   └── [id]/
│   │       │       └── page.tsx  # Task detail page
│   │       ├── projects/
│   │       │   ├── page.tsx      # Projects list
│   │       │   └── [id]/
│   │       │       └── page.tsx  # Project detail page
│   │       ├── ai/
│   │       │   └── page.tsx      # AI assistant & insights
│   │       ├── notifications/
│   │       │   └── page.tsx      # Notifications center
│   │       ├── pricing/
│   │       │   └── page.tsx      # Subscription pricing
│   │       └── settings/
│   │           └── page.tsx      # User settings
│   │
│   ├── api/                      # API routes
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts      # NextAuth configuration
│   │   ├── ai/
│   │   │   ├── analyze-task/
│   │   │   │   └── route.ts      # Task analysis endpoint
│   │   │   ├── analyze-project/
│   │   │   │   └── route.ts      # Project analysis endpoint
│   │   │   ├── suggestions/
│   │   │   │   └── route.ts      # AI suggestions
│   │   │   ├── insights/
│   │   │   │   └── route.ts      # AI insights
│   │   │   ├── chat/
│   │   │   │   └── route.ts      # AI chat endpoint
│   │   │   └── stream/
│   │   │       └── route.ts      # Streaming AI responses
│   │   ├── tasks/
│   │   │   └── [id]/
│   │   │       ├── route.ts      # Task CRUD operations
│   │   │       └── comments/
│   │   │           └── route.ts  # Task comments
│   │   ├── notifications/
│   │   │   ├── route.ts          # Get/create notifications
│   │   │   ├── [id]/
│   │   │   │   └── route.ts      # Update/delete notification
│   │   │   └── mark-all-read/
│   │   │       └── route.ts      # Mark all as read
│   │   ├── webhooks/
│   │   │   └── stripe/
│   │   │       └── route.ts      # Stripe webhook handler
│   │   ├── create-checkout-session/
│   │   │   └── route.ts          # Stripe checkout
│   │   ├── search/
│   │   │   └── route.ts          # Search endpoint
│   │   └── cron/
│   │       └── check-tasks/
│   │           └── route.ts      # Task deadline checks
│   │
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── providers.tsx             # Context providers
│
├── components/                   # React components
│   ├── ui/                       # Reusable UI components (Radix UI)
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── avatar.tsx
│   │   ├── progress.tsx
│   │   ├── tabs.tsx
│   │   └── ...
│   ├── dashboard/                # Dashboard-specific components
│   │   ├── navbar.tsx
│   │   ├── sidebar.tsx
│   │   ├── stats-card.tsx
│   │   └── ...
│   ├── tasks/                    # Task-related components
│   │   ├── task-card.tsx
│   │   ├── task-list.tsx
│   │   ├── task-form.tsx
│   │   └── ...
│   ├── projects/                 # Project components
│   │   ├── project-card.tsx
│   │   ├── project-form.tsx
│   │   └── ...
│   └── shared/                   # Shared components
│       ├── search-dialog.tsx
│       ├── notification-bell.tsx
│       └── ...
│
├── lib/                          # Utility libraries
│   ├── auth.ts                   # NextAuth configuration
│   ├── prisma.ts                 # Prisma client instance
│   ├── stripe.ts                 # Stripe client
│   ├── openai.ts                 # OpenAI client
│   ├── utils.ts                  # Helper utilities (cn, etc.)
│   └── validations.ts            # Zod schemas
│
├── prisma/
│   ├── schema.prisma             # Database schema
│   ├── migrations/               # Database migrations
│   └── seed.ts                   # Seed data (optional)
│
├── actions/                      # Server actions
│   ├── task-actions.ts           # Task server actions
│   ├── project-actions.ts        # Project server actions
│   └── user-actions.ts           # User server actions
│
├── hooks/                        # Custom React hooks
│   ├── use-tasks.ts
│   ├── use-projects.ts
│   ├── use-notifications.ts
│   └── ...
│
├── types/                        # TypeScript type definitions
│   ├── index.ts
│   └── ...
│
├── config/                       # Configuration files
│   ├── site.ts                   # Site configuration
│   └── ...
│
├── public/                       # Static assets
│   ├── images/                   # Screenshots and images
│   └── *.svg                     # SVG icons
│
├── .env                          # Environment variables (not in git)
├── .env.example                  # Example environment variables
├── next.config.js                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

---

## Database Schema

### Entity Relationship Overview

The application uses a PostgreSQL database with the following main entities:

#### User
- **Authentication**: Email/password with bcrypt hashing
- **Profile**: Name, image, email verification
- **Relations**: Tasks, Projects, Subscriptions, AI Usage, Notifications

#### Task
- **Properties**: Title, description, priority (LOW/MEDIUM/HIGH/URGENT), status (TODO/IN_PROGRESS/REVIEW/DONE), due date
- **AI Features**: AI-generated suggestions stored as JSON
- **Relations**: User, Project, Comments, Activities, Notifications
- **Subtasks**: Stored as JSON for nested task structures

#### Project
- **Properties**: Name, description, custom color
- **Relations**: User, Tasks, Notifications
- **Organization**: Groups related tasks together

#### Comment
- **Properties**: Content, timestamps
- **Relations**: Task, Author (User)
- **Purpose**: Collaboration and discussion on tasks

#### Activity
- **Properties**: Action description, metadata (JSON)
- **Relations**: Task, User
- **Purpose**: Audit log for all task changes

#### Subscription
- **Tiers**: FREE, PRO, ENTERPRISE
- **Status**: ACTIVE, CANCELED, TRIALING, etc.
- **Stripe Integration**: Customer ID, subscription ID, price ID, billing period
- **Relations**: User (one-to-one)

#### AIUsage
- **Tracking**: Feature name, tokens used, cost
- **Relations**: User
- **Purpose**: Monitor AI usage and billing

#### Notification
- **Types**: INFO, SUCCESS, WARNING, ERROR, TASK_ASSIGNED, TASK_COMPLETED, TASK_DUE_SOON, TASK_OVERDUE, COMMENT_ADDED, PROJECT_UPDATE, SYSTEM
- **Properties**: Title, message, read status, action URL, metadata
- **Relations**: User, Task (optional), Project (optional)

### Database Management

View and manage your database using Prisma Studio:

```bash
npx prisma studio
```

Create a new migration after schema changes:

```bash
npx prisma migrate dev --name your_migration_name
```

---

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20.x or higher ([Download](https://nodejs.org/))
- **PostgreSQL** database ([Download](https://www.postgresql.org/download/) or use a cloud provider)
- **npm**, **yarn**, **pnpm**, or **bun** package manager
- **Git** for version control

Optional but recommended:
- **Stripe Account** for payment features ([Sign up](https://stripe.com/))
- **OpenAI API Key** for AI features ([Sign up](https://platform.openai.com/))

### Installation

#### 1. Clone the repository

```bash
git clone <repository-url>
cd taskflow-ai
```

#### 2. Install dependencies

Using npm:
```bash
npm install
```

Using yarn:
```bash
yarn install
```

Using pnpm:
```bash
pnpm install
```

Using bun:
```bash
bun install
```

#### 3. Set up environment variables

Create a `.env` file in the root directory by copying the example:

```bash
cp .env.example .env
```

Then edit `.env` with your configuration:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/taskflow_ai"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key-here"
# Generate a secret: openssl rand -base64 32

# Stripe Configuration (Optional)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Stripe Price IDs
STRIPE_PRO_PRICE_ID="price_..."
STRIPE_ENTERPRISE_PRICE_ID="price_..."

# OpenAI Configuration (Optional)
OPENAI_API_KEY="sk-..."
OPENAI_MODEL="gpt-4"  # or gpt-3.5-turbo

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

#### 4. Set up the database

Generate Prisma client:
```bash
npx prisma generate
```

Run database migrations:
```bash
npx prisma migrate dev
```

(Optional) Seed the database with sample data:
```bash
npx prisma db seed
```

#### 5. Run the development server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

#### 6. Create your first account

1. Navigate to [http://localhost:3000](http://localhost:3000)
2. Click "Get Started" or "Sign Up"
3. Register with your email and password
4. Start creating tasks and projects!

---

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/dbname` |
| `NEXTAUTH_URL` | Application URL | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js | Generate with `openssl rand -base64 32` |

### Optional Variables (AI Features)

| Variable | Description | Example |
|----------|-------------|---------|
| `OPENAI_API_KEY` | OpenAI API key for AI features | `sk-...` |
| `OPENAI_MODEL` | OpenAI model to use | `gpt-4` or `gpt-3.5-turbo` |

### Optional Variables (Payments)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | `pk_test_...` |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | `whsec_...` |
| `STRIPE_PRO_PRICE_ID` | Price ID for Pro plan | `price_...` |
| `STRIPE_ENTERPRISE_PRICE_ID` | Price ID for Enterprise plan | `price_...` |

### Optional Variables (General)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_APP_URL` | Public application URL | `https://taskflow-ai.com` |

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack (fast refresh) |
| `npm run build` | Build the application for production |
| `npm start` | Start the production server |
| `npm run lint` | Run ESLint to check code quality |
| `npx prisma studio` | Open Prisma Studio (database GUI) |
| `npx prisma migrate dev` | Create and apply a new migration |
| `npx prisma generate` | Generate Prisma Client |
| `npx prisma db seed` | Seed the database with initial data |

---

## API Routes

### Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/[...nextauth]` | GET, POST | NextAuth.js authentication endpoints |

### AI Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/ai/analyze-task` | POST | Analyze a task and generate AI insights |
| `/api/ai/analyze-project` | POST | Analyze entire project for bottlenecks |
| `/api/ai/suggestions` | POST | Get AI-powered task suggestions |
| `/api/ai/insights` | GET | Get personalized AI insights |
| `/api/ai/chat` | POST | Interactive AI chat for task planning |
| `/api/ai/stream` | POST | Streaming AI responses |

### Task Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/tasks` | GET | Get all tasks for the authenticated user |
| `/api/tasks` | POST | Create a new task |
| `/api/tasks/[id]` | GET | Get a specific task |
| `/api/tasks/[id]` | PATCH | Update a task |
| `/api/tasks/[id]` | DELETE | Delete a task |
| `/api/tasks/[id]/comments` | GET, POST | Get/create comments on a task |

### Notifications

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/notifications` | GET | Get all notifications |
| `/api/notifications/[id]` | PATCH | Mark notification as read |
| `/api/notifications/mark-all-read` | POST | Mark all notifications as read |

### Search

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/search` | GET | Search tasks and projects |

### Payments

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/create-checkout-session` | POST | Create Stripe checkout session |
| `/api/webhooks/stripe` | POST | Handle Stripe webhook events |

### Cron Jobs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/cron/check-tasks` | GET | Check for overdue tasks (scheduled job) |

---

## Deployment

### Deploy on Vercel (Recommended)

The easiest way to deploy TaskFlow AI is using the [Vercel Platform](https://vercel.com):

#### Step-by-Step Deployment

1. **Push to Git Repository**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your Git repository
   - Select the project

3. **Configure Environment Variables**
   - Add all environment variables from your `.env` file
   - Make sure to use production values (production database, etc.)

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your application

5. **Set up Stripe Webhooks** (if using payments)
   - Get your production webhook URL: `https://your-app.vercel.app/api/webhooks/stripe`
   - Add it to your Stripe dashboard
   - Update `STRIPE_WEBHOOK_SECRET` in Vercel environment variables

6. **Run Database Migrations**
   - Use Vercel CLI or run migrations from your local machine:
   ```bash
   DATABASE_URL="your-production-db-url" npx prisma migrate deploy
   ```

### Deploy on Other Platforms

TaskFlow AI can be deployed on any platform that supports Next.js:

- **[Railway](https://railway.app/)** - Simple deployment with PostgreSQL
- **[Render](https://render.com/)** - Free tier available
- **[DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform)** - Managed deployment
- **Self-hosted** - Use Docker or PM2

### Production Checklist

- [ ] Set up production PostgreSQL database
- [ ] Configure all environment variables
- [ ] Set `NEXTAUTH_URL` to production URL
- [ ] Generate strong `NEXTAUTH_SECRET`
- [ ] Set up Stripe webhooks (if using payments)
- [ ] Configure OpenAI API limits (if using AI features)
- [ ] Enable SSL/HTTPS
- [ ] Set up monitoring and error tracking
- [ ] Configure cron jobs for task deadline checks
- [ ] Test authentication flow
- [ ] Test payment flow
- [ ] Backup database regularly

---

## Features in Detail

### 1. AI-Powered Task Analysis

TaskFlow AI uses OpenAI's GPT models to provide intelligent insights:

- **Complexity Analysis**: Automatically assess task difficulty
- **Time Estimation**: AI-generated time estimates based on task description
- **Subtask Suggestions**: Break down complex tasks into manageable subtasks
- **Priority Recommendations**: Get suggestions for task prioritization
- **Productivity Insights**: Analyze your work patterns and get personalized tips

### 2. Project Management

Organize your work into projects for better structure:

- **Color Coding**: Assign custom colors to projects for visual organization
- **Task Grouping**: Automatically group tasks by project
- **Progress Tracking**: Visual progress bars for project completion
- **Project Analytics**: View statistics and insights per project
- **Bulk Operations**: Manage multiple tasks within a project

### 3. Task Organization

Powerful task management capabilities:

- **Priorities**: LOW, MEDIUM, HIGH, URGENT
- **Statuses**: TODO, IN_PROGRESS, REVIEW, DONE
- **Due Dates**: Set deadlines with automatic reminders
- **Subtasks**: Create nested task hierarchies
- **Drag-and-Drop**: Reorder tasks intuitively
- **Filtering & Sorting**: Find tasks quickly

### 4. Real-Time Notifications

Stay informed with intelligent notifications:

- **Task Updates**: Get notified when tasks change status
- **Comments**: Receive alerts for new comments
- **Deadlines**: Automatic reminders for due and overdue tasks
- **System Alerts**: Important system notifications
- **In-App Notifications**: Real-time updates without page refresh

### 5. Subscription Management

Flexible pricing tiers powered by Stripe:

- **Free Tier**: Basic task management (50 tasks, 5 projects)
- **Pro Tier**: Advanced features (unlimited tasks/projects, AI analysis)
- **Enterprise Tier**: Full features with priority support
- **Secure Payments**: PCI-compliant payment processing
- **Subscription Management**: Easy upgrades, downgrades, and cancellations

### 6. Collaboration

Work together with your team:

- **Comments**: Discuss tasks with team members
- **Activity Log**: Track all changes and updates
- **Mentions**: Tag users in comments (future feature)
- **Shared Projects**: Collaborate on projects (future feature)

---

## Development

### Code Style

This project uses ESLint for code quality. Run linting:

```bash
npm run lint
```

### Database Changes

When making schema changes:

1. Update `prisma/schema.prisma`
2. Create a migration:
   ```bash
   npx prisma migrate dev --name describe_your_change
   ```
3. Generate new Prisma Client:
   ```bash
   npx prisma generate
   ```

### Adding New Features

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Test thoroughly
4. Submit a pull request

---

## Troubleshooting

### Common Issues

**Database Connection Error**
- Check your `DATABASE_URL` in `.env`
- Ensure PostgreSQL is running
- Verify database credentials

**Authentication Not Working**
- Check `NEXTAUTH_SECRET` is set
- Verify `NEXTAUTH_URL` matches your app URL
- Clear browser cookies and try again

**AI Features Not Working**
- Verify `OPENAI_API_KEY` is valid
- Check OpenAI API quota and billing
- Review API error messages in console

**Stripe Integration Issues**
- Confirm all Stripe environment variables are set
- Test with Stripe test mode keys first
- Check webhook signature verification

---

## Learn More

### Documentation

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [React Documentation](https://react.dev) - Learn React 19 features
- [Prisma Documentation](https://www.prisma.io/docs) - Database ORM guide
- [NextAuth.js Documentation](https://next-auth.js.org/) - Authentication setup
- [Stripe Documentation](https://stripe.com/docs) - Payment integration
- [OpenAI API Documentation](https://platform.openai.com/docs) - AI integration
- [Tailwind CSS](https://tailwindcss.com/docs) - Utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) - Accessible component library

### Tutorials

- [Next.js 15 Tutorial](https://nextjs.org/learn)
- [Prisma Getting Started](https://www.prisma.io/docs/getting-started)
- [Building with Radix UI](https://www.radix-ui.com/primitives/docs/overview/introduction)

---

## Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

---

## License

This project is **private and proprietary**. All rights reserved.

For licensing inquiries, please contact the development team.

---

## Support

### Getting Help

- **Documentation**: Check this README and linked documentation
- **Issues**: Open an issue on GitHub for bugs or feature requests
- **Discussions**: Join GitHub Discussions for questions and community support

### Contact

For additional support or inquiries:
- Email: support@taskflow-ai.com (update with your email)
- GitHub Issues: [Create an issue](../../issues)

---

## Acknowledgments

Built with amazing open-source technologies:

- [Next.js](https://nextjs.org/) by Vercel
- [React](https://react.dev/) by Meta
- [Prisma](https://www.prisma.io/) by Prisma
- [Radix UI](https://www.radix-ui.com/) by WorkOS
- [Tailwind CSS](https://tailwindcss.com/) by Tailwind Labs
- [Stripe](https://stripe.com/) for payments
- [OpenAI](https://openai.com/) for AI capabilities

---

## Roadmap

### Upcoming Features

- [ ] Team collaboration and workspaces
- [ ] Real-time collaboration with WebSockets
- [ ] Calendar view for tasks
- [ ] Email notifications
- [ ] Mobile applications (iOS/Android)
- [ ] Kanban board view
- [ ] Time tracking integration
- [ ] Advanced AI features (voice input, smart scheduling)
- [ ] Third-party integrations (Slack, GitHub, etc.)
- [ ] Custom workflows and automation
- [ ] Analytics and reporting dashboard
- [ ] API documentation and public API

---

<div align="center">

**Built with ❤️ using Next.js 15 and modern web technologies**

[Report Bug](../../issues) · [Request Feature](../../issues) · [Documentation](https://nextjs.org/docs)

</div>
