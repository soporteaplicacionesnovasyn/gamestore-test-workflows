## Why

Authentication tokens currently have no expiration, allowing stolen tokens to be used indefinitely. This is a security vulnerability that needs to be addressed.

## What Changes

- Add a configurable expiration time (TTL) to JWT tokens generated during login
- Validate token expiration in the authentication middleware
- Reject expired tokens with a 401 response and clear client-side session

## Capabilities

### New Capabilities

- `session-timeout`: Token expiration configuration, generation with TTL, and validation on protected routes

### Modified Capabilities

- `auth`: Requirement for token lifetime validation will be added; expired token handling will be modified

## Impact

- Backend: `src/middleware/auth.ts` (JWT verification logic), `src/routes/auth.ts` (token generation)
- Tokens issued before this change will remain valid until their original (current infinite) expiry

## Risks
- Cambiar el TTL puede invalidar tokens existentes.
- Necesitamos migrar sesiones activas o invalidarlas.
