# FitPathway Organizer - Architecture Documentation

## 🏗️ System Architecture

### Technology Stack

#### Frontend
- **Framework**: React 18.2 with TypeScript
- **Build Tool**: Vite 5.2
- **Routing**: React Router DOM 7.6
- **State Management**: 
  - TanStack Query (React Query) for server state
  - React Context for global UI state
- **UI Framework**: Tailwind CSS + shadcn/ui components
- **Form Management**: React Hook Form + Zod validation
- **Animations**: Custom CSS animations + Tailwind utilities
- **Theme**: next-themes for dark/light mode

#### Backend
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth with MFA support
- **Real-time**: Supabase Realtime subscriptions
- **Storage**: Supabase Storage for file uploads
- **Edge Functions**: Deno-based serverless functions

#### Security
- **Encryption**: Client-side message encryption
- **RLS**: Row Level Security policies on all tables
- **Rate Limiting**: Custom rate limiting implementation
- **Input Validation**: Zod schema validation
- **Audit Logging**: Comprehensive audit trail

---

## 📁 Project Structure

```
fit-pathway-organizer/
├── apps/
│   └── web-app/
│       ├── src/
│       │   ├── components/       # Reusable UI components
│       │   │   ├── ai/          # AI chat components
│       │   │   ├── auth/        # Authentication forms & guards
│       │   │   ├── dashboard/   # Dashboard widgets
│       │   │   ├── diet/        # Diet plan components
│       │   │   ├── forms/       # Form components
│       │   │   ├── layout/      # Layout components (Header, Sidebar)
│       │   │   ├── members/     # Member management
│       │   │   ├── messages/    # Messaging components
│       │   │   ├── subscription/# Subscription management
│       │   │   ├── ui/          # Base UI components (shadcn)
│       │   │   ├── video/       # Video player
│       │   │   └── workout/     # Workout components
│       │   ├── contexts/        # React contexts
│       │   │   ├── LanguageContext.tsx    # i18n
│       │   │   └── SidebarContext.tsx     # Sidebar state
│       │   ├── hooks/           # Custom React hooks
│       │   │   ├── useAuthProvider.tsx    # Authentication
│       │   │   ├── useProfile.ts          # User profile
│       │   │   ├── useMessages.ts         # Chat messages
│       │   │   ├── useWorkouts.ts         # Workout data
│       │   │   └── ...
│       │   ├── integrations/    # External integrations
│       │   │   └── supabase/    # Supabase client & types
│       │   ├── lib/             # Utility libraries
│       │   │   ├── auth.ts      # Auth utilities
│       │   │   ├── encryption.ts # Encryption utilities
│       │   │   ├── security.ts  # Security utilities
│       │   │   └── utils.ts     # General utilities
│       │   ├── pages/           # Route pages
│       │   ├── styles/          # Global styles
│       │   ├── App.tsx          # App entry point
│       │   └── main.tsx         # React DOM entry
│       └── public/              # Static assets
├── supabase/
│   ├── functions/               # Edge functions
│   │   ├── ai-fitness-coach/
│   │   ├── send-notification-email/
│   │   ├── send-push-notification/
│   │   └── ...
│   ├── migrations/              # Database migrations
│   └── config.toml              # Supabase config
└── docs/                        # Documentation
```

---

## 🔄 Data Flow

### Authentication Flow
```
User → SignInForm → Supabase Auth → AuthProvider → ProtectedRoute → Dashboard
                                           ↓
                                    useProfile hook
                                           ↓
                                    React Query cache
```

### Message Flow (with Encryption)
```
User Input → SecureMessageInput → MessageEncryption.encryptMessage()
                                          ↓
                                  Supabase Database (encrypted)
                                          ↓
                            useMessages hook → React Query
                                          ↓
                          MessageEncryption.decryptMessage()
                                          ↓
                                    ChatWindow (display)
```

### Workout Assignment Flow
```
Trainer Dashboard → AssignWorkoutDialog → Edge Function (validation)
                                                  ↓
                                          Supabase Database
                                                  ↓
                                    Real-time Subscription
                                                  ↓
                                    Athlete Dashboard (notification)
```

---

## 🎨 Component Architecture

### Component Hierarchy

```
App
├── QueryClientProvider
│   ├── ThemeProvider
│   │   ├── LanguageProvider
│   │   │   ├── AuthProvider
│   │   │   │   ├── BrowserRouter
│   │   │   │   │   ├── Routes
│   │   │   │   │   │   ├── ProtectedRoute
│   │   │   │   │   │   │   ├── AppLayout
│   │   │   │   │   │   │   │   ├── Header
│   │   │   │   │   │   │   │   ├── Sidebar
│   │   │   │   │   │   │   │   └── Page Components
```

### Component Categories

#### 1. Layout Components
- **AppLayout**: Main application shell with sidebar and header
- **Header**: Top navigation bar with user menu
- **Sidebar**: Navigation menu (role-based)
- **PageLayout**: Consistent page wrapper

#### 2. Feature Components
- **TrainerDashboard**: Trainer-specific dashboard
- **AthleteDashboard**: Athlete-specific dashboard
- **AiChatAssistant**: AI-powered fitness coach
- **WorkoutLibrary**: Workout management
- **MessageCenter**: Secure messaging

#### 3. UI Components (shadcn/ui)
- Base components: Button, Card, Input, Dialog, etc.
- Composed components: StatCard, LoadingSpinner, etc.

---

## 🔐 Security Architecture

### Multi-Layer Security

#### 1. Client-Side Security
- **Input Validation**: Zod schemas validate all user inputs
- **XSS Prevention**: No `dangerouslySetInnerHTML` usage
- **CSRF Protection**: Supabase auth tokens
- **Rate Limiting**: Client-side rate limiters

#### 2. Server-Side Security (RLS)
```sql
-- Example: Messages table RLS policy
CREATE POLICY "Users can only see their own messages"
ON messages FOR SELECT
USING (
  auth.uid() = sender_id OR 
  auth.uid() = recipient_id
);
```

#### 3. Edge Function Security
- **Input Sanitization**: `sanitizeHtml()` on all user inputs
- **Rate Limiting**: `checkRateLimit()` on all endpoints
- **Audit Logging**: `logAudit()` for all critical actions
- **Security Event Logging**: `logSecurityEvent()` for anomalies

#### 4. Encryption
- **Message Encryption**: End-to-end encrypted messages
- **Key Management**: User-specific encryption keys
- **Algorithm**: AES-256-GCM

---

## 📊 State Management

### Server State (React Query)

```typescript
// Example: Fetching workouts with caching
const { data: workouts, isLoading } = useQuery({
  queryKey: ["workouts", userId],
  queryFn: fetchWorkouts,
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
});
```

### Client State (React Context)

```typescript
// Example: Theme context
<ThemeProvider attribute="class" defaultTheme="light">
  {children}
</ThemeProvider>
```

### Form State (React Hook Form)

```typescript
// Example: Form with validation
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(workoutSchema)
});
```

---

## 🌐 Internationalization (i18n)

### Language Context

```typescript
const { t, language, setLanguage } = useLanguage();

// Usage
<h1>{t("dashboard.welcome")}</h1>
```

### Translation Files
- `contexts/translations/en.json` - English
- `contexts/translations/ar.json` - Arabic (RTL support)

### RTL Support
- Automatic direction switching
- RTL-aware layouts with Tailwind utilities
- Icon flipping for directional icons

---

## 🎭 Animation System

### Animation Utilities (index.css)

```css
/* Fade-in animation */
.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}

/* Scale-in animation */
.animate-scale-in {
  animation: scale-in 0.3s ease-out forwards;
}

/* Slide-up animation */
.animate-slide-up {
  animation: slide-up 0.4s ease-out forwards;
}
```

### Staggered Animations

```tsx
<div style={{ animationDelay: "0.2s" }} className="animate-fade-in">
  {/* Content appears after 0.2s */}
</div>
```

---

## 🧪 Testing Strategy

### Unit Tests
- **Location**: `src/**/__tests__/*.test.ts(x)`
- **Framework**: Jest + Testing Library
- **Coverage**: Components, hooks, utilities

### Integration Tests
- **Location**: `src/__tests__/integration/*.test.tsx`
- **Framework**: Jest + Testing Library
- **Coverage**: User flows, API integration

### E2E Tests (Recommended)
- **Framework**: Playwright or Cypress
- **Coverage**: Critical user journeys

---

## 🚀 Performance Optimizations

### Implemented Optimizations

#### 1. React Performance
- **Memoization**: `React.memo()` on presentational components
- **Callback Memoization**: `useCallback()` for event handlers
- **Query Memoization**: Stable query functions with dependencies

#### 2. Bundle Optimization
- **Code Splitting**: Route-based lazy loading (potential)
- **Tree Shaking**: Vite automatic tree shaking
- **Image Optimization**: WebP format, lazy loading

#### 3. Caching Strategy
- **React Query**: 5-minute stale time, 10-minute cache time
- **Service Worker**: (Recommended for PWA)

#### 4. Rendering Optimization
- **Virtual Lists**: For large lists (recommended)
- **Debouncing**: Search inputs
- **Throttling**: Scroll events

---

## 📱 Responsive Design

### Breakpoints (Tailwind)
```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

### Mobile-First Approach
- Base styles for mobile
- Progressive enhancement for larger screens
- Touch-friendly UI (44px minimum tap targets)

---

## ♿ Accessibility (WCAG 2.1 AA)

### Implemented Features

#### 1. Semantic HTML
- Proper heading hierarchy
- Semantic landmarks (nav, main, aside, footer)
- Form labels and fieldsets

#### 2. ARIA Attributes
- `aria-label` for icon buttons
- `aria-current` for active navigation
- `aria-live` regions for dynamic content
- `aria-hidden` for decorative icons

#### 3. Keyboard Navigation
- Tab order follows logical flow
- Focus indicators visible
- Skip links (recommended)
- Keyboard shortcuts (recommended)

#### 4. Screen Reader Support
- Alt text for all images
- Descriptive labels for form inputs
- Status messages announced
- Error messages associated with inputs

---

## 🔄 CI/CD Pipeline (Recommended)

### GitHub Actions Workflow

```yaml
name: CI/CD
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm ci
      - run: npm run test
      - run: npm run lint
      
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm ci
      - run: npm run build
      
  deploy:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v2
      - run: npm ci
      - run: npm run build
      - run: npx supabase deploy
```

---

## 📈 Monitoring & Analytics (Recommended)

### Error Tracking
- **Sentry**: Error monitoring and reporting
- **LogRocket**: Session replay for debugging

### Performance Monitoring
- **Lighthouse**: Core Web Vitals
- **Web Vitals**: CLS, FID, LCP tracking

### User Analytics
- **Plausible/Fathom**: Privacy-friendly analytics
- **Custom Events**: Track feature usage

---

## 🔧 Development Workflow

### Local Development

```bash
# Start development server
npm run dev

# Run tests
npm test

# Type check
npm run type-check

# Lint
npm run lint

# Build for production
npm run build
```

### Environment Variables

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key

# Optional
VITE_STRIPE_KEY=your_stripe_key
```

---

## 🎯 Best Practices

### Code Organization
1. **One component per file**: Easier to find and maintain
2. **Colocate related code**: Keep tests near source files
3. **Barrel exports**: Use index files for clean imports
4. **Naming conventions**: PascalCase for components, camelCase for utilities

### Component Design
1. **Single Responsibility**: Each component does one thing well
2. **Composition over Inheritance**: Build complex UIs from simple components
3. **Props over Context**: Pass data explicitly when possible
4. **TypeScript**: Use interfaces and types liberally

### Performance
1. **Avoid premature optimization**: Profile before optimizing
2. **Measure twice, optimize once**: Use Chrome DevTools
3. **Lazy load routes**: Split bundles by route
4. **Optimize images**: Use WebP, lazy loading, responsive images

---

## 🛠️ Troubleshooting

### Common Issues

#### 1. Authentication Issues
- **Clear Supabase cache**: `localStorage.clear()`
- **Check RLS policies**: Verify in Supabase dashboard
- **Verify tokens**: Check browser DevTools Application tab

#### 2. Build Errors
- **Clear node_modules**: `rm -rf node_modules && npm install`
- **Clear build cache**: `rm -rf dist && npm run build`
- **Check TypeScript**: `npm run type-check`

#### 3. Routing Issues
- **Check route config**: Verify routes in `App.tsx`
- **404 errors**: Ensure catch-all route exists
- **Protected routes**: Verify ProtectedRoute wrapper

---

## 📚 Additional Resources

### Documentation
- [React Query Docs](https://tanstack.com/query/latest)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com/)

### Learning Resources
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Supabase University](https://supabase.com/learn)
- [Web.dev](https://web.dev/)

---

## 🚀 Future Enhancements

### Short Term
- [ ] PWA support with service workers
- [ ] Offline mode with local storage sync
- [ ] Push notifications (web push)
- [ ] Advanced workout builder
- [ ] Video library integration

### Long Term
- [ ] Mobile apps (React Native)
- [ ] Wearable device integration
- [ ] AI workout generation
- [ ] Social features (leaderboards, challenges)
- [ ] Marketplace for trainers

---

## 📄 License

This project is proprietary. All rights reserved.

---

## 👥 Contributors

Maintained by the FitPathway team.

For questions or support, please contact support@fitpathway.com

---

**Last Updated**: January 30, 2025  
**Version**: 1.0.0
