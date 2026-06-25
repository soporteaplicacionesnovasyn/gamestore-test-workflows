# Security Review

## Authentication & Authorization
- [x] ¿Los nuevos endpoints requieren autenticación?
  - Review mutation endpoints (POST, PUT, DELETE `/api/products/:id/reviews`) require JWT via `authenticate` middleware
  - GET `/api/products/:id/reviews` (list) is public — only approved reviews are returned; pending/rejected are excluded
- [x] ¿Se verifican roles (ADMIN vs USER)?
  - Review CRUD uses ownership check (`req.userId` matches review's `userId`) — USER role only
  - Moderation endpoints (`/api/admin/reviews/*`) check `req.userRole === 'admin'`
  - ⚠️ **Existing bug**: current admin routes in `admin.ts` lack role check. This change must NOT repeat that mistake. Moderation endpoints must verify admin role.

## Input Validation
- [x] ¿Se validan todos los inputs del usuario?
  - Title: SHALL be 1-100 characters, trimmed
  - Body: SHALL be 1-2000 characters, trimmed
  - Score: SHALL be integer between 1 and 5
  - `productId` from URL params: parsed as integer, validated product exists
  - `reviewId` from URL params: parsed as integer, validated review exists
- [x] ¿Se previene SQL injection (usando Prisma)?
  - All queries use Prisma ORM with parameterized queries — SQL injection is prevented

## Data Protection
- [ ] ¿Se almacenan contraseñas hasheadas (bcrypt)?
  - ⚠️ **Existing bug**: passwords are stored in plain text. Not introduced by this change, but this change should not make it worse (review endpoints do not touch passwords).
- [x] ¿Se evita loguear información sensible?
  - Review content logged in error cases is acceptable (user-generated content)
  - No sensitive data (passwords, tokens) is logged by review endpoints

## Rate Limiting
- [ ] ¿Se implementó rate limiting en endpoints públicos?
  - ⚠️ **Existing bug**: no rate limiting anywhere in the app. The public GET `/api/products/:id/reviews` endpoint is susceptible to abuse. Mitigation: implement rate limiting as a separate change, or add basic in-memory rate limiting (100 req/min per IP) for public endpoints.

## Checklist Summary
- Critical issues: 0
- High issues: 1 (plain text passwords — pre-existing, not introduced by this change)
- Medium issues: 1 (no rate limiting on public review list endpoint — pre-existing)
- Low issues: 0

## Aprobación
- [ ] Seguridad: _____ (nombre)
- [ ] Equipo: _____ (nombre)
