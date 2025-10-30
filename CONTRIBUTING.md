# Contributing to FitPathway Organizer

Thank you for your interest in contributing to FitPathway Organizer! This document provides guidelines and best practices for contributing to the project.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Component Guidelines](#component-guidelines)
- [Testing Guidelines](#testing-guidelines)
- [Documentation Guidelines](#documentation-guidelines)
- [Pull Request Process](#pull-request-process)
- [Security Guidelines](#security-guidelines)

---

## 📜 Code of Conduct

### Our Standards

- **Be respectful**: Treat all contributors with respect
- **Be inclusive**: Welcome diverse perspectives
- **Be collaborative**: Work together toward common goals
- **Be professional**: Maintain professionalism in all interactions

---

## 🚀 Getting Started

### Prerequisites

```bash
# Node.js 18+ and npm
node --version  # v18.0.0 or higher
npm --version   # 9.0.0 or higher

# Git
git --version   # 2.0.0 or higher
```

### Setup

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/fit-pathway-organizer.git
   cd fit-pathway-organizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

---

## 🔄 Development Workflow

### Branch Strategy

```
main            # Production-ready code
├── develop     # Integration branch
    ├── feature/user-authentication
    ├── feature/workout-builder
    ├── bugfix/message-encryption
    └── hotfix/security-vulnerability
```

### Creating a Branch

```bash
# Feature branch
git checkout -b feature/your-feature-name

# Bug fix branch
git checkout -b bugfix/issue-description

# Hotfix branch
git checkout -b hotfix/critical-fix
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

**Examples:**
```bash
feat(auth): add MFA support

Implement multi-factor authentication using TOTP.
Includes QR code generation and verification flow.

Closes #123

---

fix(workout): resolve exercise deletion bug

Fixes issue where deleting an exercise would cause
the workout form to crash.

Fixes #456
```

---

## 📝 Coding Standards

### TypeScript

#### 1. Type Everything
```typescript
// ✅ Good
interface UserProfile {
  id: string;
  name: string;
  role: 'trainer' | 'athlete';
}

const getUser = (id: string): Promise<UserProfile> => {
  // Implementation
};

// ❌ Bad
const getUser = (id) => {
  // Implementation
};
```

#### 2. Use Interfaces over Types
```typescript
// ✅ Good
interface Props {
  userId: string;
  onSave: () => void;
}

// ⚠️ Use types for unions/intersections
type Status = 'pending' | 'approved' | 'rejected';
```

#### 3. Avoid `any`
```typescript
// ❌ Bad
const data: any = await fetch(url);

// ✅ Good
interface ApiResponse {
  data: User[];
  error?: string;
}
const response: ApiResponse = await fetch(url);
```

### React

#### 1. Functional Components
```typescript
// ✅ Good
export const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return <div>{user.name}</div>;
};

// ❌ Bad (class components)
export class UserCard extends React.Component {
  render() {
    return <div>{this.props.user.name}</div>;
  }
}
```

#### 2. Use Hooks
```typescript
// ✅ Good
const [count, setCount] = useState(0);
const memoizedValue = useMemo(() => expensive(count), [count]);
const callback = useCallback(() => doSomething(), []);

// ❌ Bad (missing dependencies)
useEffect(() => {
  doSomething(value);
}, []); // Missing 'value' in dependencies
```

#### 3. Prop Destructuring
```typescript
// ✅ Good
export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary' 
}) => {
  return <button onClick={onClick}>{children}</button>;
};

// ❌ Bad
export const Button: React.FC<ButtonProps> = (props) => {
  return <button onClick={props.onClick}>{props.children}</button>;
};
```

### Styling

#### 1. Use Tailwind Classes
```tsx
// ✅ Good
<button className="bg-primary text-white hover:bg-primary/90 px-4 py-2 rounded-lg">
  Click me
</button>

// ❌ Bad (inline styles)
<button style={{ backgroundColor: '#3b82f6', color: 'white' }}>
  Click me
</button>
```

#### 2. Use Design System Tokens
```tsx
// ✅ Good
<div className="bg-background text-foreground">Content</div>

// ❌ Bad (hardcoded colors)
<div className="bg-white text-black">Content</div>
```

#### 3. Responsive Design
```tsx
// ✅ Good
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

---

## 🧩 Component Guidelines

### Component Structure

```typescript
/**
 * UserCard component displays user information in a card format.
 * 
 * @component
 * @example
 * ```tsx
 * <UserCard user={userData} onEdit={handleEdit} />
 * ```
 */
export const UserCard: React.FC<UserCardProps> = ({ user, onEdit }) => {
  // 1. Hooks
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  
  // 2. Memoized values
  const formattedName = useMemo(() => {
    return user.name.toUpperCase();
  }, [user.name]);
  
  // 3. Callbacks
  const handleEdit = useCallback(() => {
    setIsEditing(true);
    onEdit?.(user.id);
  }, [user.id, onEdit]);
  
  // 4. Effects
  useEffect(() => {
    // Side effects
  }, []);
  
  // 5. Render
  return (
    <Card>
      <CardHeader>
        <h3>{formattedName}</h3>
      </CardHeader>
      <CardContent>
        <p>{user.email}</p>
        <Button onClick={handleEdit}>Edit</Button>
      </CardContent>
    </Card>
  );
};
```

### Component Checklist

- [ ] TypeScript interface for props
- [ ] JSDoc documentation
- [ ] Accessibility attributes (aria-label, role)
- [ ] Keyboard navigation support
- [ ] Responsive design (mobile-first)
- [ ] Dark mode support
- [ ] Internationalization (i18n)
- [ ] Error boundaries (for error-prone components)
- [ ] Loading states
- [ ] Empty states
- [ ] Memoization (when appropriate)

---

## 🧪 Testing Guidelines

### Unit Tests

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDisabled();
  });
});
```

### Integration Tests

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProfile } from './UserProfile';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

describe('UserProfile Integration', () => {
  it('loads and displays user data', async () => {
    const queryClient = createTestQueryClient();
    
    render(
      <QueryClientProvider client={queryClient}>
        <UserProfile userId="123" />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });
});
```

### Test Coverage

Aim for:
- **80%+ overall coverage**
- **100% coverage** for:
  - Security utilities
  - Authentication logic
  - Payment processing
  - Data validation

---

## 📚 Documentation Guidelines

### Component Documentation

```typescript
/**
 * WorkoutCard displays a single workout with its exercises and metadata.
 * 
 * @component
 * @category Workout
 * 
 * @param {WorkoutCardProps} props - Component props
 * @param {Workout} props.workout - Workout data to display
 * @param {Function} props.onEdit - Callback when edit button is clicked
 * @param {Function} props.onDelete - Callback when delete button is clicked
 * @param {boolean} props.isEditable - Whether the workout can be edited
 * 
 * @example
 * ```tsx
 * <WorkoutCard
 *   workout={workoutData}
 *   onEdit={(id) => console.log('Edit:', id)}
 *   onDelete={(id) => console.log('Delete:', id)}
 *   isEditable={true}
 * />
 * ```
 * 
 * @see {@link https://docs.fitpathway.com/components/workout-card|Documentation}
 */
export const WorkoutCard: React.FC<WorkoutCardProps> = ({
  workout,
  onEdit,
  onDelete,
  isEditable = false,
}) => {
  // Implementation
};
```

### Function Documentation

```typescript
/**
 * Encrypts a message using AES-256-GCM encryption.
 * 
 * @param message - Plain text message to encrypt
 * @param userId - User ID for key derivation
 * @returns Promise resolving to encrypted message object
 * 
 * @throws {EncryptionError} If encryption fails
 * 
 * @example
 * ```typescript
 * const encrypted = await encryptMessage('Hello World', 'user-123');
 * // Returns: { ciphertext: '...', iv: '...', algorithm: 'aes-256-gcm' }
 * ```
 */
export async function encryptMessage(
  message: string,
  userId: string
): Promise<EncryptedMessage> {
  // Implementation
}
```

---

## 🔄 Pull Request Process

### Before Submitting

1. **Update your branch**
   ```bash
   git checkout main
   git pull origin main
   git checkout your-branch
   git rebase main
   ```

2. **Run tests**
   ```bash
   npm test
   npm run type-check
   npm run lint
   ```

3. **Build successfully**
   ```bash
   npm run build
   ```

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123
Fixes #456

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing performed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests pass locally
- [ ] Dependent changes merged

## Screenshots (if applicable)
[Add screenshots here]
```

### Review Process

1. **Automated Checks**: CI/CD runs tests and linting
2. **Code Review**: At least one approval required
3. **Manual Testing**: Reviewer tests changes locally
4. **Merge**: Squash and merge to main

---

## 🔒 Security Guidelines

### Reporting Security Issues

**DO NOT** open public issues for security vulnerabilities.

Instead, email: security@fitpathway.com

### Security Best Practices

1. **Never commit secrets**
   ```bash
   # ❌ Bad
   const API_KEY = 'sk_live_abc123xyz';
   
   # ✅ Good
   const API_KEY = import.meta.env.VITE_API_KEY;
   ```

2. **Validate all inputs**
   ```typescript
   // ✅ Good
   const userSchema = z.object({
     email: z.string().email(),
     password: z.string().min(8),
   });
   
   const validated = userSchema.parse(userInput);
   ```

3. **Sanitize user content**
   ```typescript
   // ✅ Good
   import DOMPurify from 'dompurify';
   const clean = DOMPurify.sanitize(userContent);
   ```

4. **Use HTTPS only**
5. **Implement rate limiting**
6. **Follow OWASP guidelines**

---

## 🎯 Performance Guidelines

### Optimization Checklist

- [ ] Use `React.memo()` for expensive components
- [ ] Use `useCallback()` for function props
- [ ] Use `useMemo()` for expensive calculations
- [ ] Implement code splitting for routes
- [ ] Lazy load images
- [ ] Optimize bundle size
- [ ] Monitor Core Web Vitals

### Performance Testing

```bash
# Lighthouse audit
npm run lighthouse

# Bundle analysis
npm run analyze
```

---

## 📞 Getting Help

### Resources

- **Documentation**: [docs/](./docs/)
- **Architecture**: [ARCHITECTURE.md](./ARCHITECTURE.md)
- **API Docs**: [docs/API.md](./docs/API.md)

### Community

- **Slack**: [fitpathway.slack.com](https://fitpathway.slack.com)
- **Email**: dev@fitpathway.com

---

## 🙏 Thank You!

Thank you for contributing to FitPathway Organizer! Your efforts help make fitness training more accessible and effective for everyone.

---

**Last Updated**: January 30, 2025
