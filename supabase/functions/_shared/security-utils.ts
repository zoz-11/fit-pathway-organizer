import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const DEFAULT_MAX_REQUESTS = 10;
const requestCounts = new Map<string, { count: number; lastReset: number }>();

/**
 * Rate limiting middleware
 * @param userId - User ID to track
 * @param maxRequests - Maximum requests per window (default: 10)
 * @returns true if rate limit exceeded, false otherwise
 */
export function checkRateLimit(
  userId: string,
  maxRequests: number = DEFAULT_MAX_REQUESTS,
): boolean {
  const now = Date.now();
  const userRequest = requestCounts.get(userId) || {
    count: 0,
    lastReset: now,
  };

  if (now - userRequest.lastReset > RATE_LIMIT_WINDOW_MS) {
    userRequest.count = 1;
    userRequest.lastReset = now;
  } else {
    userRequest.count++;
  }
  requestCounts.set(userId, userRequest);

  return userRequest.count > maxRequests;
}

/**
 * Audit logging utility
 * @param supabaseClient - Supabase client instance
 * @param userId - User ID (optional)
 * @param action - Action name
 * @param details - Additional details
 */
export async function logAudit(
  supabaseClient: SupabaseClient,
  userId: string | undefined,
  action: string,
  details: Record<string, unknown>,
) {
  try {
    const { error } = await supabaseClient.from("audit_logs").insert([
      {
        user_id: userId,
        action: action,
        details: details,
      },
    ]);
    if (error) {
      console.error("Error inserting audit log:", error);
    }
  } catch (e) {
    console.error("Exception while logging audit:", e);
  }
}

/**
 * Security logging for suspicious activity
 * @param supabaseClient - Supabase client instance
 * @param userId - User ID (optional)
 * @param event - Security event type
 * @param details - Event details
 * @param severity - Severity level (low, medium, high, critical)
 */
export async function logSecurityEvent(
  supabaseClient: SupabaseClient,
  userId: string | undefined,
  event: string,
  details: Record<string, unknown>,
  severity: "low" | "medium" | "high" | "critical" = "medium",
) {
  try {
    await logAudit(supabaseClient, userId, `security_event_${severity}`, {
      event,
      severity,
      timestamp: new Date().toISOString(),
      ...details,
    });

    // Log to console for monitoring
    console.warn(`[SECURITY ${severity.toUpperCase()}] ${event}:`, details);
  } catch (e) {
    console.error("Exception while logging security event:", e);
  }
}

/**
 * HTML sanitization utility
 * Removes dangerous HTML tags and attributes to prevent XSS attacks
 * @param html - HTML string to sanitize
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== "string") return "";

  // Remove script tags and their content
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

  // Remove dangerous event handlers
  sanitized = sanitized.replace(
    /\s*on\w+\s*=\s*["'][^"']*["']/gi,
    "",
  );
  
  // Remove javascript: protocol in links
  sanitized = sanitized.replace(
    /javascript:/gi,
    "",
  );

  // Remove data: protocol (except for images)
  sanitized = sanitized.replace(
    /(<(?!img)[^>]*)\s+src\s*=\s*["']data:[^"']*["']/gi,
    "$1",
  );

  // Remove dangerous tags
  const dangerousTags = [
    "iframe",
    "embed",
    "object",
    "applet",
    "meta",
    "link",
    "style",
    "base",
  ];
  dangerousTags.forEach((tag) => {
    const regex = new RegExp(`<${tag}\\b[^<]*(?:(?!<\\/${tag}>)<[^<]*)*<\\/${tag}>`, "gi");
    sanitized = sanitized.replace(regex, "");
  });

  return sanitized.trim();
}

/**
 * Sanitize text content (remove all HTML tags)
 * @param text - Text to sanitize
 * @returns Plain text with HTML tags removed
 */
export function sanitizeText(text: string): string {
  if (!text || typeof text !== "string") return "";
  
  // Remove all HTML tags
  let sanitized = text.replace(/<[^>]*>/g, "");
  
  // Decode common HTML entities
  sanitized = sanitized
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/");

  return sanitized.trim();
}

/**
 * Validate and sanitize email addresses
 * @param email - Email to validate
 * @returns Sanitized email or null if invalid
 */
export function sanitizeEmail(email: string): string | null {
  if (!email || typeof email !== "string") return null;

  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const trimmed = email.trim().toLowerCase();

  if (!emailRegex.test(trimmed)) return null;

  // Check for suspicious characters
  if (trimmed.includes("..") || trimmed.includes("<") || trimmed.includes(">")) {
    return null;
  }

  return trimmed;
}

/**
 * Sanitize URL to prevent open redirects
 * @param url - URL to sanitize
 * @returns Sanitized URL or null if invalid
 */
export function sanitizeUrl(url: string): string | null {
  if (!url || typeof url !== "string") return null;

  const trimmed = url.trim();

  // Block javascript: and data: protocols
  if (/^(javascript|data):/i.test(trimmed)) {
    return null;
  }

  // Only allow http, https, and relative URLs
  if (!/^(https?:\/\/|\/)/i.test(trimmed)) {
    return null;
  }

  return trimmed;
}
