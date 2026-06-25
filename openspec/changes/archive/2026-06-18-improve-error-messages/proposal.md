## Why

The GameStore app has inconsistent, insecure, and user-unfriendly error handling across both backend and frontend. Backend routes leak internal error messages (Prisma errors, stack traces) to clients in all 500 catch blocks, frontend pages silently swallow errors with only console logs, native `alert()` dialogs are used instead of inline UI, and several spec-defined error messages ("Product out of stock", "Insufficient stock") are never shown. This degrades UX, complicates debugging, and poses a security risk.

## What Changes

- Replace all `catch (error: any)` blocks that return `error.message` with safe, generic error responses and structured logging
- Add request body validation to all backend routes (required fields, types, positive integers)
- Add admin role enforcement middleware
- Add stock validation on cart add and checkout
- Add standardized backend error response format with `error`, optional `details`, and `status` fields
- Add error state variables and inline error UI to all frontend pages (Products, Cart, Checkout, Admin)
- Replace all `alert()` calls with inline red error banners
- Implement `response.ok` checking in the API client to consistently surface errors
- Add client-side form validation (email format, password length, required fields)
- Implement spec-mandated error messages ("Product out of stock", "Insufficient stock")
- Add an `error` state to CartContext for background operation failures
- Show broken image fallback for product images

## Capabilities

### New Capabilities
- `error-handling`: Standardized error handling across backend and frontend, including consistent error response format, input validation, and user-facing error messages

### Modified Capabilities
- `auth`: Add input validation on registration (email format, password length) and return consistent error shapes
- `catalog`: Add broken image fallback, improve loading/error states for product list
- `cart`: Add stock validation, proper error states in context and UI
- `orders`: Add stock validation on checkout, form validation, replace alert() with inline errors
- `session-timeout`: No behavior changes — only implementation improvements

## Impact

- **Backend**: All route files (`auth.ts`, `products.ts`, `cart.ts`, `orders.ts`, `admin.ts`), middleware (`auth.ts`), global error handler in `index.ts`
- **Frontend**: `api.ts`, `AuthContext.tsx`, `CartContext.tsx`, all page components (`Login.tsx`, `Register.tsx`, `Products.tsx`, `Cart.tsx`, `Checkout.tsx`, `Admin.tsx`), `SessionExpiredNotification.tsx`
- **Dependencies**: No new dependencies. Existing `zod` pattern not used — validation will be manual to match codebase style.
- **No breaking API changes**: Error response shape will change from `{ error: string }` to `{ error: string, status: number, details?: string }` — but frontend only reads `.error` so it's backward compatible.
