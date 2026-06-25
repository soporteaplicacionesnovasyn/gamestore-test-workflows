## Context

Currently, users who forget their password have no way to recover their account. The app has no email service or token-based reset mechanism. Passwords are stored in plain text (known bug), and this change will fix that by hashing with bcrypt.

## Goals / Non-Goals

**Goals:**
- Allow users to request a password reset email via POST /api/auth/forgot-password
- Allow users to reset password via POST /api/auth/reset-password with a valid token
- Store password hashes with bcrypt (cost factor 12) instead of plain text
- Reset tokens expire after 15 minutes and are single-use

**Non-Goals:**
- Email delivery infrastructure (assumes SMTP configured via env vars)
- Two-factor authentication
- Password strength meter

## Decisions

| Decision | Alternatives | Why |
|----------|-------------|-----|
| Token stored hashed (SHA-256) in DB | Plain text | Prevents DB leak from compromising active tokens |
| Token expiry: 15 min | 1 hour, 24 hours | Balances security with UX |
| Always return 200 on forgot-password | Return 404 if email not found | Prevents user enumeration |
| bcrypt cost factor 12 | cost 10, cost 14 | Industry standard; good balance of security and speed |

## Flow: Password Reset

```
User clicks "Forgot Password"
      |
      v
Enters email on /forgot-password page
      |
      v
POST /api/auth/forgot-password { email }
      |
      v
Server generates token (crypto.randomBytes(32))
Stores SHA-256(token) in password_reset_tokens table
Sends email with reset link containing raw token
Returns 200 (always)
      |
      v
User clicks link in email
      |
      v
GET /reset-password?token=xxx (frontend route)
      |
      v
User enters new password
      |
      v
POST /api/auth/reset-password { token, newPassword }
      |
      v
Server hashes token, looks up in DB
If valid + not expired:
  - Hash new password with bcrypt
  - Update user password
  - Delete used token
  - Return 200
If invalid/expired:
  - Return 401 "Invalid or expired token"
```

## Key Implementation Details

- **Token generation**: `crypto.randomBytes(32).toString('hex')` (64-char hex)
- **Token storage**: `SHA-256(rawToken)` in `password_reset_tokens` table
- **Email**: Nodemailer with configurable SMTP transport
- **Rate limiting**: 3 forgot-password requests per email per 15 minutes
- **Architecture pattern**: Feature-based routing (`/routes/auth/`)

## Risks / Trade-offs

- **SMTP dependency**: If email fails, user cannot reset. Mitigation: log error but return 200 to prevent enumeration.
- **Token brute force**: 64-char hex token = 256-bit entropy, computationally infeasible.
- **Timing attack on email check**: Use constant-time comparison for token validation.
