## Context

The Navbar already shows a Logout button for authenticated users, but clicking it immediately terminates the session without confirmation. The `logout()` function in `AuthContext` calls `api.auth.logout()` without `await`, making it fire-and-forget with no error handling or user feedback. This causes accidental logouts and silent failures.

## Goals / Non-Goals

**Goals:**
- Add a confirmation modal before logout executes
- Make `logout()` properly async with loading state and error feedback
- Redirect to `/login` after successful logout
- Graceful error handling if the backend call fails

**Non-Goals:**
- Password hashing or JWT secret changes (separate work)
- Refresh token rotation fixes (separate work)
- Style overhauls of the Navbar

## Decisions

1. **Confirmation as a modal (not dropdown/alert)** — A centered overlay modal matches the existing UI pattern and is more accessible than `window.confirm()`.
2. **New `LogoutConfirmModal` component** — Keeps Navbar clean and the modal reusable.
3. **`logout()` becomes `async`** — Returns a promise so the modal can await it, show a spinner, and handle errors.
4. **Backend call failure → still clear local state** — If the server call fails, tokens are still cleared locally so the user is never stuck.

## Risks / Trade-offs

- **Backend call failure** → User is logged out locally but the backend refresh token may remain valid. Mitigation: Acceptable trade-off — the user can't access protected routes anyway since local tokens are cleared.
- **Modal blocks interaction** → Mitigation: Include a "Cancel" button and a backdrop click-to-dismiss.
