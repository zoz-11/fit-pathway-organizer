import { z } from 'zod';

// Enhanced validation schemas
export const UserInputSchema = z.object({
  name: z.string().max(100).trim().refine(val => !/<[^>]*>/.test(val), "HTML tags not allowed"),
  email: z.string().email().max(255).toLowerCase(),
  age: z.number().min(13).max(120).optional(),
});

export const WorkoutInputSchema = z.object({
  title: z.string().max(200).trim().refine(val => !/<[^>]*>/.test(val), "HTML tags not allowed"),
  description: z.string().max(1000).optional().refine(val => !val || !/<script[^>]*>/.test(val), "Script tags not allowed"),
  exercises: z.array(z.string().uuid()).max(50),
});

export const MessageInputSchema = z.object({
  content: z.string().max(1000).trim().refine(val => !/<script[^>]*>/.test(val), "Script tags not allowed"),
  recipient: z.string().uuid(),
});

export const FileUploadSchema = z.object({
  filename: z.string().max(255).refine(val => {
    const allowedExtensions = /\.(jpg|jpeg|png|gif|pdf|doc|docx)$/i;
    return allowedExtensions.test(val);
  }, "Invalid file type"),
  size: z.number().max(5 * 1024 * 1024, "File size too large (max 5MB)"),
  mimeType: z.string().refine(val => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword'];
    return allowedTypes.includes(val);
  }, "Invalid file type"),
});

// Enhanced rate limiter with progressive penalties
export class EnhancedRateLimiter {
  private requests = new Map<string, { count: number; resetTime: number; violations: number }>();
  private config: { windowMs: number; maxRequests: number };

  constructor(config: { windowMs: number; maxRequests: number }) {
    this.config = config;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(identifier);

    if (!userRequests || now > userRequests.resetTime) {
      // Reset or initialize, but maintain violation history
      const violations = userRequests?.violations || 0;
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + this.config.windowMs,
        violations
      });
      return true;
    }

    if (userRequests.count >= this.config.maxRequests) {
      // Track violations for progressive penalties
      userRequests.violations = (userRequests.violations || 0) + 1;
      
      // Apply progressive penalties (exponential backoff)
      const penaltyMultiplier = Math.min(Math.pow(2, userRequests.violations), 8);
      userRequests.resetTime = now + (this.config.windowMs * penaltyMultiplier);
      
      return false;
    }

    userRequests.count++;
    return true;
  }

  getRemainingRequests(identifier: string): number {
    const userRequests = this.requests.get(identifier);
    if (!userRequests) return this.config.maxRequests;
    return Math.max(0, this.config.maxRequests - userRequests.count);
  }

  getResetTime(identifier: string): number {
    const userRequests = this.requests.get(identifier);
    return userRequests?.resetTime || Date.now();
  }
}

// Security audit logger
export const auditLogger = {
  logSecurityEvent: async (
    event: string, 
    details: Record<string, unknown>, 
    userId?: string
  ) => {
    try {
      // In a real implementation, this would send to a secure logging service
      console.log('Security Event:', {
        timestamp: new Date().toISOString(),
        event,
        userId,
        details: {
          ...details,
          userAgent: navigator.userAgent,
          ip: 'client-side', // Would be populated server-side
        }
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }
};

// Content Security Policy generator
export const generateCSP = (nonce?: string) => {
  const basePolicy = {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      nonce ? `'nonce-${nonce}'` : "'unsafe-inline'",
      "https://api.supabase.co"
    ],
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:", "https:"],
    "connect-src": [
      "'self'", 
      "https://api.supabase.co",
      "https://*.supabase.co",
      "wss://*.supabase.co"
    ],
    "font-src": ["'self'"],
    "object-src": ["'none'"],
    "media-src": ["'self'"],
    "frame-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"]
  };

  return Object.entries(basePolicy)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');
};

export { generateSecureId, hashString, sanitizeString, sanitizeEmail, validatePassword } from './security';