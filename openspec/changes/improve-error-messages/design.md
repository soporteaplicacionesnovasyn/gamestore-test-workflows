## Context

The GameStore backend (Express + TypeScript) uses a try/catch pattern in every route handler that returns `error.message` on 500 errors, leaking internal details. The frontend (React) inconsistently handles errors — some pages use inline red divs (Login/Register), some use `alert()` (Checkout/Products), and some silently log to console with no user feedback (Products load, Admin, Cart). The API client never checks `response.ok`, so HTTP errors resolve as successful JSON. Input validation is missing on all routes. Stock validation (required by specs) is not implemented.

## Goals / Non-Goals

**Goals:**
- Stop leaking internal error messages from all backend 500 catch blocks
- Add request body validation to all POST/PUT routes (required fields, types, positive integers)
- Add admin role enforcement middleware
- Add stock validation on cart add and checkout
- Standardize backend error response format to `{ error: string, status: number }` (backward compatible)
- Add error state variables and inline error UI to all frontend pages
- Replace all `alert()` calls with inline error banners
- Add `response.ok` checking in the API client
- Add client-side form validation on Login, Register, Checkout
- Add `error` state to CartContext for background failures
- Add broken image fallback on Products page

**Non-Goals:**
- Introducing a validation library (e.g., zod, joi) — manual validation to match codebase style
- Adding a toast/snackbar notification system — use existing inline error pattern
- Rewriting the API client architecture
- Adding test coverage
- Fixing the password storage / JWT secret security issues (separate concerns)
- Fixing price sorting as numeric (separate issue)

## Decisions

- **Error response shape**: Change from `{ error: string }` to `{ error: string, status: number }`. Frontend only reads `.error` so this is backward compatible. The `status` field aids debugging.
- **Stock validation at cart add AND checkout**: Validate stock synchronously in the route handler before mutation (not via DB constraint). Spec requires "Product out of stock" at add time and "Insufficient stock" at checkout.
- **Frontend error pattern**: Reuse the existing inline red div pattern from Login/Register (`bg-red-100 text-red-700 p-2 rounded mb-4`) across all pages, rather than creating a shared ErrorMessage component (keeps changes minimal).
- **Client-side validation**: Manual checks in event handlers (email regex, password length, required fields) rather than a form library. Matches current code style.
- **API client error handling**: Add a `checkResponse` helper that reads JSON and rejects if `response.ok` is false, so `.catch()` works for all callers. Wrap existing methods to maintain backward compat.
- **Admin role enforcement**: Add a middleware function in `auth.ts` that checks `req.user.role === 'admin'` after `authenticate`. Fixes the `// FIXME` comment.

## Risks / Trade-offs

- **[Risk]** Changing error response shape could break external integrations. → **Mitigation**: Only adding `status` field; `error` string is preserved. All clients only read `.error`.
- **[Risk]** Adding validation to routes could reject previously accepted requests. → **Mitigation**: Only validate fields that are logically required (missing body fields would have caused Prisma errors anyway).
- **[Risk]** Frontend API client changes could introduce regressions. → **Mitigation**: Wrap incrementally — add `checkResponse` as an opt-in helper first, then migrate callers.
- **[Trade-off]** Manual validation is more verbose than a library. → Acceptable for this codebase size; avoids adding a dependency.
