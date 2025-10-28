# FIT Pathway Organizer

A comprehensive fitness pathway management platform built with React, TypeScript, and Supabase.

## Project Info

**URL**: https://lovable.dev/projects/5ed9908e-fa3d-4618-b22f-017633a2f3af

## Features

- **Multi-role Support**: Trainers and athletes with role-specific dashboards
- **Workout Management**: Create, assign, and track workout programs
- **Progress Tracking**: Monitor athletic performance and achievements
- **Messaging System**: Real-time communication between trainers and athletes
- **Diet Planning**: Meal planning and nutrition tracking
- **Internationalization**: Support for English and Arabic languages
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS

## Technologies

This project is built with:

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS with shadcn-ui components
- **Backend**: Supabase (Authentication, Database, Real-time)
- **State Management**: TanStack React Query
- **Routing**: React Router v7
- **UI Components**: Radix UI primitives
- **Testing**: Jest with React Testing Library
- **Linting**: ESLint with TypeScript support

## Prerequisites

- Node.js >= 18.0.0 (recommended: use [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- npm >= 9.0.0
- Supabase account (for backend services)

## Environment Setup

### 1. Clone the Repository

```sh
git clone https://github.com/zoz-11/fit-pathway-organizer.git
cd fit-pathway-organizer
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory by copying the example:

```sh
cp .env.example .env
```

Edit `.env` and fill in your Supabase credentials:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_PROJECT_ID=your_supabase_project_id
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key

# AI Provider Configuration (Optional - for AI chat features)
GROQ_API_KEY=your_groq_api_key_here
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

**Where to get these values:**

- **Supabase credentials**: 
  1. Create a project at [supabase.com](https://supabase.com)
  2. Go to Project Settings > API
  3. Copy the Project URL and anon/public key
  
- **AI API Keys** (Optional):
  - Groq: Sign up at [console.groq.com](https://console.groq.com/)
  - OpenRouter: Sign up at [openrouter.ai](https://openrouter.ai/)

### 4. Database Setup

The Supabase migrations are located in the `supabase/migrations` directory. To set up the database:

1. Install Supabase CLI: `npm install -g supabase`
2. Link your project: `supabase link --project-ref your-project-id`
3. Push migrations: `supabase db push`

Alternatively, you can run the SQL migration files directly in the Supabase SQL editor.

## Development

### Start Development Server

```sh
npm run dev
```

The application will be available at `http://localhost:8080`

### Build for Production

```sh
npm run build
```

The build output will be in the `dist/` directory.

### Preview Production Build

```sh
npm run preview
```

### Type Checking

```sh
npm run typecheck
```

### Linting

```sh
npm run lint
```

### Running Tests

```sh
npm test
```

## Project Structure

```
fit-pathway-organizer/
├── apps/
│   ├── web-app/              # Main web application
│   │   ├── src/
│   │   │   ├── components/   # React components
│   │   │   ├── contexts/     # React contexts
│   │   │   ├── hooks/        # Custom React hooks
│   │   │   ├── pages/        # Page components
│   │   │   └── lib/          # Utility functions
│   │   └── index.html
│   ├── admin-panel/          # Admin dashboard
│   └── mobile-app/           # Mobile app (future)
├── packages/
│   ├── ui/                   # Shared UI components
│   ├── hooks/                # Shared hooks
│   ├── i18n/                 # Internationalization
│   └── types/                # Shared TypeScript types
├── configs/                  # Configuration files
│   ├── vite.config.ts
│   ├── jest.config.ts
│   └── eslint.config.js
├── supabase/                 # Supabase configuration
│   ├── migrations/           # Database migrations
│   └── functions/            # Edge functions
└── .env.example              # Environment variables template
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run build:strict` | Build with strict TypeScript checking |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint on the codebase |
| `npm run typecheck` | Run TypeScript type checking without build |
| `npm test` | Run Jest tests |

## Deployment

### Deploy to Lovable

1. Open [Lovable](https://lovable.dev/projects/5ed9908e-fa3d-4618-b22f-017633a2f3af)
2. Click on Share -> Publish
3. Your application will be deployed automatically

### Deploy to Other Platforms

The project can be deployed to any static hosting service that supports Vite builds:

- **Vercel**: Connect your GitHub repository
- **Netlify**: Use `npm run build` as the build command and `dist` as the publish directory
- **Cloudflare Pages**: Same as Netlify
- **AWS S3 + CloudFront**: Upload the contents of `dist/` directory

Make sure to set all required environment variables in your deployment platform.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

## Editing Options

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/5ed9908e-fa3d-4618-b22f-017633a2f3af) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

**Edit directly in GitHub**

- Navigate to the desired file(s)
- Click the "Edit" button (pencil icon) at the top right of the file view
- Make your changes and commit

**Use GitHub Codespaces**

- Navigate to the main page of your repository
- Click on the "Code" button (green button) near the top right
- Select the "Codespaces" tab
- Click on "New codespace" to launch a new Codespace environment
- Edit files directly within the Codespace and commit and push your changes once you're done

## Custom Domain

To connect a custom domain:

1. Navigate to Project > Settings > Domains in Lovable
2. Click Connect Domain
3. Follow the instructions to configure your DNS

Read more: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Troubleshooting

### Build Fails

- Ensure all environment variables are set correctly
- Run `npm install` to ensure all dependencies are installed
- Check that you're using Node.js >= 18.0.0

### Tests Fail

- Make sure you've created the required mock files
- Check that all dependencies are installed
- Verify your TypeScript configuration

### Supabase Connection Issues

- Verify your Supabase URL and keys in `.env`
- Check that your Supabase project is active
- Ensure database migrations have been applied

## License

This project is private and proprietary.

## Support

For issues and questions:
- Create an issue in the GitHub repository
- Contact the development team through Lovable
