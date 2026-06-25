## Why

Users currently cannot reset their password if they forget it. This leads to account lockouts and support requests. Adding a password reset flow improves user experience and reduces support burden.

## What Changes

A self-service password reset flow:
- "Forgot Password" link on the login page
- Email-based reset token with expiry
- New API endpoints: POST /api/auth/forgot-password and POST /api/auth/reset-password
- New database table for reset tokens
- Email notification template for reset instructions

## Capabilities

### New Capabilities
- `password-reset`: Allow users to reset forgotten passwords via email-based verification

### Modified Capabilities

*(None)*

## Impact

- **Backend**: New routes, email service, reset token model, password hashing with bcrypt
- **Frontend**: New pages for forgot password form and reset password form
- **Database**: New `password_reset_tokens` table

## Risks

| Risk | Mitigation |
|------|------------|
| Reset token interception | Tokens expire after 15 min, single-use only, stored hashed in DB |
| Email delivery failure | User sees confirmation message regardless; can retry |
| User enumeration via email responses | Always return 200 regardless of whether email exists |

## Complexity

**Media** — involves backend, frontend, database changes, and email integration.

## Dependencies

- `nodemailer` or similar for email sending
- `crypto` (built-in) for token generation
- `bcrypt` for password hashing (security requirement)
