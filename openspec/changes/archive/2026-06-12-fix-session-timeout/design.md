## Context

JWT tokens in `src/middleware/auth.ts` currently have no expiration (`exp` claim). Tokens are generated in `src/routes/auth.ts` during login.

## Goals / Non-Goals

**Goals:**
- Add configurable TTL to JWT tokens via environment variable (`JWT_EXPIRES_IN`)
- Validate `exp` claim on every authenticated request
- Return 401 with clear message on expired tokens

**Non-Goals:**
- Refresh token rotation or sliding sessions
- Client-side token management changes

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| TTL source | Environment variable `JWT_EXPIRES_IN` (default: `24h`) | Matches existing `JWT_SECRET` pattern; easy to configure per deployment |
| Expiry handling | `jsonwebtoken` `exp` claim, verified by `jwt.verify()` | Library already supports this natively — no new dependencies |
| Error response | `{ error: "Token expired" }` with 401 status | Matches existing error format in auth middleware |

## Risks / Trade-offs

- [Risk] Existing tokens without `exp` claim will fail → Mitigation: Short grace period or force re-login
- [Risk] Misconfigured TTL (too short) causes user frustration → Mitigation: Document recommended values
