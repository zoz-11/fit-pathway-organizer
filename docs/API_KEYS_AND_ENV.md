# API Keys and Environment Configuration Guide

This document provides best practices for managing API keys and environment configuration in the FIT Pathway Organizer application.

## Table of Contents

1. [Overview](#overview)
2. [Setting Up OPENROUTER_API_KEY](#setting-up-openrouter_api_key)
3. [Environment Configuration Methods](#environment-configuration-methods)
4. [Backend Middleware Wiring](#backend-middleware-wiring)
5. [Security Recommendations](#security-recommendations)
6. [Troubleshooting](#troubleshooting)

## Overview

API keys and sensitive configuration data should never be committed to version control. This guide outlines secure methods for managing these credentials in both development and production environments.

## Setting Up OPENROUTER_API_KEY

The `OPENROUTER_API_KEY` is required for AI-powered features in the application. Follow these setup instructions based on your deployment method.

### Method 1: Supabase Dashboard (Production/Staging)

For deployments using Supabase Edge Functions:

1. Navigate to your Supabase project dashboard
2. Go to **Settings** → **Edge Functions** → **Environment Variables**
3. Add a new secret:
   - **Key**: `OPENROUTER_API_KEY`
   - **Value**: Your OpenRouter API key
4. Click **Add Secret** to save
5. Redeploy your Edge Functions for changes to take effect

**Accessing in Edge Functions:**

```typescript
const apiKey = Deno.env.get('OPENROUTER_API_KEY');

if (!apiKey) {
  throw new Error('OPENROUTER_API_KEY is not configured');
}
```

### Method 2: Local .env File (Development)

For local development:

1. Create a `.env` file in your project root (if it doesn't exist)
2. Add your API key:
   ```
   OPENROUTER_API_KEY=your_api_key_here
   ```
3. Ensure `.env` is listed in `.gitignore`

**Note:** Never commit `.env` files to version control.

## Environment Configuration Methods

### Development Environment

**Backend (.env file):**

```env
# API Keys
OPENROUTER_API_KEY=sk-or-v1-...

# Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Application
NODE_ENV=development
PORT=3000
```

**Frontend (.env.local):**

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Production Environment

**Supabase Edge Functions:**
- Configure via Supabase Dashboard → Edge Functions → Environment Variables
- Variables are automatically available via `Deno.env.get()`

**Other Hosting Platforms:**
- **Vercel**: Project Settings → Environment Variables
- **Netlify**: Site Settings → Environment Variables
- **Railway**: Project → Variables
- **Render**: Environment → Environment Variables

## Backend Middleware Wiring

### Express.js Example

If using Express.js for your backend:

```typescript
import express from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();

// Middleware to inject API key into request context
app.use((req, res, next) => {
  req.apiKey = process.env.OPENROUTER_API_KEY;
  next();
});

// Route handler
app.post('/api/generate', async (req, res) => {
  const apiKey = req.apiKey;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }
  
  // Use apiKey for OpenRouter API calls
  // ...
});
```

### Supabase Edge Functions Example

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  // Retrieve API key from environment
  const apiKey = Deno.env.get('OPENROUTER_API_KEY');
  
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'API key not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  // Make API call to OpenRouter
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'anthropic/claude-3-sonnet',
      messages: [/* ... */],
    }),
  });
  
  const data = await response.json();
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

### Validation Middleware

Create a reusable validation function:

```typescript
// utils/validateEnv.ts
export function validateEnvironment() {
  const required = ['OPENROUTER_API_KEY', 'SUPABASE_URL', 'SUPABASE_ANON_KEY'];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

// Call at application startup
validateEnvironment();
```

## Security Recommendations

### 1. Never Expose API Keys to Frontend

❌ **Bad Practice:**
```typescript
// Frontend code - NEVER do this!
const apiKey = 'sk-or-v1-...';
fetch('https://openrouter.ai/api/v1/chat/completions', {
  headers: { 'Authorization': `Bearer ${apiKey}` }
});
```

✅ **Good Practice:**
```typescript
// Frontend code - call your own backend
fetch('/api/generate', {
  method: 'POST',
  body: JSON.stringify({ prompt: 'Generate pathway...' })
});

// Backend handles API key
```

### 2. Use Environment-Specific Variables

- Separate keys for development, staging, and production
- Use different API keys with appropriate rate limits
- Implement key rotation policies

### 3. Implement Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/', limiter);
```

### 4. Monitor API Usage

- Set up usage alerts in your OpenRouter dashboard
- Log API calls (without logging the key itself)
- Track costs and implement budgets

### 5. Secure .gitignore

Ensure these patterns are in your `.gitignore`:

```gitignore
# Environment variables
.env
.env.local
.env.*.local
.env.development
.env.production

# API keys and secrets
*.key
*.pem
secrets.json
```

### 6. Use Secrets Management for Team Collaboration

For teams:
- **1Password**: Share secrets via secure vaults
- **AWS Secrets Manager**: For AWS deployments
- **HashiCorp Vault**: For enterprise solutions
- **GitHub Secrets**: For CI/CD pipelines

### 7. Key Rotation

1. Generate a new API key in OpenRouter dashboard
2. Update the key in your environment (Supabase/hosting platform)
3. Deploy/restart your application
4. Verify the new key works
5. Revoke the old key

### 8. Access Control

- Limit API key access to only necessary services
- Use service accounts with minimal permissions
- Implement authentication before proxying to external APIs

## Troubleshooting

### Issue: "API key not configured" Error

**Symptoms:** Application throws error about missing OPENROUTER_API_KEY

**Solutions:**
1. Verify the environment variable is set:
   ```bash
   # Development
   echo $OPENROUTER_API_KEY
   
   # In Node.js
   console.log(process.env.OPENROUTER_API_KEY);
   ```
2. Check `.env` file exists and contains the key
3. Restart your development server after adding the key
4. For Supabase: Verify the secret is set in the dashboard and redeploy Edge Functions

### Issue: API Key Not Working

**Symptoms:** API returns 401 Unauthorized

**Solutions:**
1. Verify the key is valid in your OpenRouter dashboard
2. Check for extra spaces or newlines in the key
3. Ensure the key hasn't expired or been revoked
4. Verify you're using the correct API endpoint

### Issue: Keys Not Loading in Production

**Symptoms:** Works locally but fails in production

**Solutions:**
1. Verify environment variables are set in your hosting platform
2. Check for typos in variable names (they're case-sensitive)
3. Redeploy after setting environment variables
4. Check build logs for environment variable loading errors

### Issue: .env File Not Being Read

**Symptoms:** Environment variables are undefined

**Solutions:**
1. Ensure `dotenv` is installed: `npm install dotenv`
2. Load dotenv at the top of your entry file:
   ```typescript
   import dotenv from 'dotenv';
   dotenv.config();
   ```
3. Verify `.env` is in the correct directory (project root)
4. Check file permissions on `.env`

## Additional Resources

- [OpenRouter Documentation](https://openrouter.ai/docs)
- [Supabase Edge Functions Environment Variables](https://supabase.com/docs/guides/functions/secrets)
- [The Twelve-Factor App: Config](https://12factor.net/config)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)

---

**Last Updated:** October 2025  
**Maintainers:** FIT Pathway Organizer Team
