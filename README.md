<p align="center">
  <img src="https://github.com/thelouisgram/nodoseoff/blob/master/public/assets/logo/logo-with-name-white.png?raw=true" alt="NodoseOff Logo" width="200"/>
</p>

**NodoseOff** is a comprehensive medication management and health tracking application designed to help users stay on top of their medication schedules, track health metrics, and maintain better health outcomes.

## ✨ Features

### 🏥 Medication Management

- **Drug Tracking**: Add, edit, and manage your medications with detailed information
- **Dosage Scheduling**: Set up custom dosage schedules and reminders
- **Medication History**: View comprehensive logs of your medication intake
- **Smart Reminders**: Never miss a dose with intelligent notification system

### 📊 Health Dashboard

- **Summary Cards**: Quick overview of your health metrics and medication adherence
- **Data Visualization**: Interactive charts and graphs to track your progress
- **Reports Generation**: Create and export detailed health reports (PDF format)
- **Analytics**: Insights into your medication patterns and health trends

### 👤 User Account Management

- **Profile Management**: Customize your profile and preferences
- **Account Settings**: Manage your account security and preferences
- **Dark Mode**: Eye-friendly dark theme for the dashboard
- **Contact & Support**: Easy access to help and support resources

### 🔒 Security & Privacy

- **Supabase Authentication**: Secure user authentication and authorization
- **Protected Routes**: Middleware-based route protection
- **Data Encryption**: Your health data is securely stored and encrypted
- **reCAPTCHA Integration**: Protection against spam and abuse
- **Rate Limiting**: Intelligent request throttling to prevent abuse and ensure fair usage
  - Authentication endpoints: 5 requests per 15 minutes
  - Email sending: 3 requests per hour
  - User deletion: 2 requests per hour
  - General API: 100 requests per minute

## 🛠️ Tech Stack

### Frontend

- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[React 18](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[Framer Motion](https://www.framer.com/motion/)** - Smooth animations
- **[Lucide React](https://lucide.dev/)** - Beautiful icons

### State Management & Data Fetching

Lightweight state management
- **[Axios](https://axios-http.com/)** - HTTP client

### Backend & Database

- **[Supabase](https://supabase.com/)** - Backend as a Service (BaaS)
  - Authentication & Authorization
  - PostgreSQL Database
  - Real-time subscriptions
  - Row Level Security (RLS)

### Additional Libraries

- **[date-fns](https://date-fns.org/)** & **[Day.js](https://day.js.org/)** - Date manipulation
- **[jsPDF](https://github.com/parallax/jsPDF)** & **[html2canvas](https://html2canvas.hertzen.com/)** - PDF generation
- **[React Email](https://react.email/)** - Email templates
- **[Nodemailer](https://nodemailer.com/)** - Email sending
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications
- **[Vercel Analytics](https://vercel.com/analytics)** - Performance monitoring

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm**, **yarn**, **pnpm**, or **bun**
- **Supabase Account** (for backend services)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/thelouisgram/nodoseoff.git
   cd nodoseoff
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory and add your environment variables:

   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # reCAPTCHA
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
   RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key

   # Email (Nodemailer/Resend)
   EMAIL_USER=your_email
   EMAIL_PASS=your_email_password
   RESEND_API_KEY=your_resend_api_key

   # Rate Limiting (Optional - for production with Redis)
   # UPSTASH_REDIS_REST_URL=your_upstash_redis_url
   # UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
   ```

   > **Note**: Rate limiting works with in-memory storage by default. For production deployments with multiple serverless instances, configure Upstash Redis or Vercel KV for persistent rate limiting.

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run email` - Email development mode

## 📁 Project Structure

```
nodoseoff/
├── src/
│   ├── Layout/          # Layout components (Hero, Footer, etc.)
│   ├── components/      # Reusable UI components
│   ├── contexts/        # React contexts
│   ├── emails/          # Email templates
│   ├── features/        # Feature-specific components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Library configurations (Supabase, etc.)
│   ├── pages/           # Next.js pages and API routes
│   ├── store/           # State management stores
│   ├── styles/          # Global styles
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── public/              # Static assets
├── .env                 # Environment variables
└── middleware.ts        # Next.js middleware for auth
```

## 🎨 Features in Detail

### Dashboard

The dashboard provides a comprehensive overview of your medication schedule and health metrics with:

- Real-time data synchronization using TanStack Query
- Dark mode support for comfortable viewing
- Interactive charts and visualizations
- Quick access to all key features

### Medication Forms

- **Add Medications**: Intuitive forms with validation
- **Edit Medications**: Update dosages, schedules, and notes
- **Delete Medications**: Safe deletion with confirmation
- **Drug Information**: Detailed medication profiles

### Reports

- Generate comprehensive health reports
- Export to PDF format
- Include medication history and adherence data
- Customizable report templates

## 🔐 Authentication

NodoseOff uses Supabase Authentication with:

- Email/Password authentication
- Protected routes via Next.js middleware
- Session management
- Secure password reset flow

## 🌐 Deployment

### Deploy on Vercel

The easiest way to deploy NodoseOff is using [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/thelouisgram/nodoseoff)

1. Push your code to GitHub
2. Import your repository to Vercel
3. Add your environment variables
4. Deploy!

### Environment Variables

Make sure to add all required environment variables in your Vercel project settings.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is private and proprietary.

## 📧 Contact

For support or inquiries, please use the contact form within the application or reach out to the development team.

---

**Built with ❤️ using Next.js and Supabase**
