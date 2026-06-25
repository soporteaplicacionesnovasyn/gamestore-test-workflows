## 1. Configuration

- [x] 1.1 Add `JWT_EXPIRES_IN` environment variable with default `24h` in backend `.env` and config loader

## 2. Token Generation

- [x] 2.1 Add `expiresIn` option to `jwt.sign()` call in `src/routes/auth.ts` using `JWT_EXPIRES_IN`

## 3. Token Validation

- [x] 3.1 Add expired token check in `src/middleware/auth.ts` after `jwt.verify()` call
- [x] 3.2 Return 401 with `{ error: "Token expired" }` for expired tokens

## 4. Testing

- [x] 4.1 Verify new tokens include `exp` claim
- [x] 4.2 Verify expired tokens return 401 on protected routes

## 5. Frontend — Session Expiry UX

- [x] 5.1 Detect `"Token expired"` error in `src/services/api.ts` and show user-friendly message instead of silent redirect
- [x] 5.2 Add session expiry toast/notification component in the UI
- [x] 5.3 Show countdown or warning before session expires (optional enhancement)
