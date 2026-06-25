## 1. Database

- [ ] 1.1 Add `PasswordResetToken` model to Prisma schema (token_hash, userId, expiresAt, usedAt, createdAt)
- [ ] 1.2 Run Prisma migration
- [ ] 1.3 Add `password_hash` column to User model (migrate existing plain-text passwords)

## 2. Backend — Auth Service

- [ ] 2.1 Install bcrypt dependency and implement hash/compare utilities
- [ ] 2.2 Implement token generation (crypto.randomBytes(32)) and hashing (SHA-256)
- [ ] 2.3 Implement forgot-password endpoint: POST /api/auth/forgot-password
- [ ] 2.4 Implement reset-password endpoint: POST /api/auth/reset-password
- [ ] 2.5 Implement rate limiting middleware for auth endpoints (3 req/15 min for forgot-password, 5 req/15 min for reset-password)
- [ ] 2.6 Integrate email sending service (Nodemailer) for reset links
- [ ] 2.7 Update login endpoint to verify against bcrypt hash (replacing plain text comparison)

## 3. Frontend — Auth Pages

- [ ] 3.1 Create ForgotPassword page (/forgot-password) with email input form
- [ ] 3.2 Create ResetPassword page (/reset-password?token=xxx) with new password form
- [ ] 3.3 Add "Forgot Password?" link to Login page
- [ ] 3.4 Add routes to App.tsx for both new pages

## 4. Testing

- [ ] 4.1 Unit tests for token generation and hashing utilities
- [ ] 4.2 Integration tests for forgot-password flow (success + rate limiting)
- [ ] 4.3 Integration tests for reset-password flow (success + expired token + used token)
- [ ] 4.4 Frontend tests for ForgotPassword and ResetPassword forms
- [ ] 4.5 Verify existing login still works with bcrypt-hashed passwords
