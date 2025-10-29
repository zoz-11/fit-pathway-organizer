# Security Policy

## Supported Versions

This project is actively maintained with security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.0.0   | :white_check_mark: (Development) |

## Reporting a Vulnerability

We take the security of the Fit Pathway Organizer seriously. If you discover a security vulnerability, please follow these steps:

### How to Report

1. **Do NOT** open a public issue for security vulnerabilities
2. Email the security team at: [INSERT SECURITY EMAIL]
3. Include the following information:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- **Initial Response**: Within 48 hours
- **Status Updates**: Every 7 days until resolved
- **Resolution Timeline**: Critical vulnerabilities will be addressed within 7 days, high severity within 14 days, moderate within 30 days

### Security Measures in Place

This project implements several security best practices:

1. **Authentication & Authorization**
   - Supabase authentication with MFA support
   - Role-based access control (Trainer/Athlete roles)
   - Account lockout after failed login attempts

2. **Input Validation**
   - Comprehensive sanitization functions for user input
   - Zod schema validation for all API requests
   - XSS protection through input sanitization

3. **API Security**
   - CORS configuration with allowed origins
   - Rate limiting on API endpoints
   - Security headers (CSP, X-Frame-Options, etc.)

4. **Password Security**
   - Minimum 8 characters with complexity requirements
   - Uppercase, lowercase, numbers, and special characters required
   - No repeated character sequences allowed

5. **Dependencies**
   - Regular security audits via `npm audit`
   - Automated dependency updates
   - CodeQL security scanning in CI/CD

### Current Security Status

Last security audit: [DATE]
Known vulnerabilities: 2 moderate (esbuild, requiring vite upgrade)
Pending fixes: Vite upgrade to v7 (breaking change, scheduled for next major version)

### Security Best Practices for Contributors

1. Never commit secrets or API keys
2. Use environment variables for sensitive configuration
3. Follow the principle of least privilege
4. Validate all user input
5. Keep dependencies up to date
6. Run `npm audit` before submitting PRs

### Compliance

This project follows:
- OWASP Top 10 security guidelines
- General Data Protection Regulation (GDPR) principles for EU users
- Secure coding practices as outlined in the codebase

For questions about our security practices, please contact [INSERT CONTACT].

