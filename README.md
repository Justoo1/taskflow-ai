# TaskFlow AI

An AI-powered task management and project planning platform built with Next.js 15, React 19, and Prisma.

## Features

- 🤖 **AI-Powered Task Analysis** - Intelligent task insights and recommendations
- 📊 **Project Management** - Organize tasks into projects with detailed tracking
- 👤 **User Authentication** - Secure authentication system with NextAuth
- 💳 **Stripe Integration** - Payment processing and subscription management
- 🎨 **Modern UI** - Built with Radix UI and Tailwind CSS
- ⚡ **High Performance** - Powered by Next.js 15 with Turbopack
- 📱 **Responsive Design** - Works seamlessly across all devices

## Tech Stack

### Frontend
- **Framework**: Next.js 15.5.4 with App Router
- **UI Library**: React 19.1.0
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI (Dialog, Slot)
- **Icons**: Lucide React
- **Utilities**: clsx, tailwind-merge, class-variance-authority

### Backend
- **Database ORM**: Prisma 6.17.0
- **Database**: PostgreSQL
- **API Routes**: Next.js API Routes
- **Performance**: Prisma Accelerate Extension

### Authentication & Payments
- **Auth**: NextAuth.js
- **Payments**: Stripe

### Development
- **Language**: TypeScript 5
- **Build Tool**: Turbopack
- **Code Quality**: ESLint
- **Package Manager**: npm

## Project Structure

```
taskflow-ai/
├── app/
│   ├── (auth)/          # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/     # Protected dashboard pages
│   │   ├── dashboard/
│   │   ├── tasks/
│   │   ├── projects/
│   │   └── settings/
│   ├── (marketing)/     # Public marketing pages
│   │   ├── about/
│   │   └── pricing/
│   └── api/             # API routes
│       ├── auth/        # NextAuth endpoints
│       ├── webhooks/    # Stripe webhooks
│       └── ai/          # AI analysis endpoints
├── components/
│   ├── ui/              # Reusable UI components
│   ├── dashboard/       # Dashboard-specific components
│   ├── marketing/       # Marketing components
│   └── shared/          # Shared components
├── lib/
│   ├── auth.ts          # Authentication utilities
│   ├── prisma.ts        # Prisma client instance
│   ├── stripe.ts        # Stripe client configuration
│   ├── openai.ts        # OpenAI integration
│   └── utils.ts         # Helper utilities
├── prisma/
│   └── schema.prisma    # Database schema
├── actions/             # Server actions
├── config/              # Configuration files
├── hooks/               # Custom React hooks
└── types/               # TypeScript type definitions
```

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- PostgreSQL database
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd taskflow-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/taskflow"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret"

   # Stripe
   STRIPE_SECRET_KEY="your-stripe-secret-key"
   STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"

   # OpenAI (for AI features)
   OPENAI_API_KEY="your-openai-api-key"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run migrations
   npx prisma migrate dev

   # (Optional) Seed the database
   npx prisma db seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## Available Scripts

- `npm run dev` - Start the development server with Turbopack
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint for code quality checks

## Database Schema

The application uses Prisma with PostgreSQL. The schema is located in `prisma/schema.prisma`.

To view and manage your database:
```bash
npx prisma studio
```

## Deployment

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new):

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import your repository on Vercel
3. Configure environment variables
4. Deploy

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### Environment Variables for Production

Ensure all environment variables are properly configured in your deployment platform:
- Database connection string
- NextAuth configuration
- Stripe API keys
- OpenAI API key

## API Routes

- `/api/auth/*` - Authentication endpoints (NextAuth)
- `/api/webhooks/stripe` - Stripe webhook handler
- `/api/ai/analyze` - AI task analysis endpoint

## Features in Detail

### Authentication
Secure user authentication powered by NextAuth.js with support for multiple providers.

### Task Management
Create, organize, and track tasks across multiple projects with intelligent categorization.

### AI Analysis
Leverage AI to analyze tasks, provide insights, and optimize workflow efficiency.

### Payment Integration
Seamless subscription management and payment processing with Stripe.

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [React Documentation](https://react.dev) - Learn React
- [Prisma Documentation](https://www.prisma.io/docs) - Learn about Prisma ORM
- [Tailwind CSS](https://tailwindcss.com/docs) - Utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible components

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is private and proprietary.

## Support

For support, please contact the development team or open an issue in the repository.

---

**Built with ❤️ using Next.js and modern web technologies**
