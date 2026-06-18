## Why

The logout button exists in the navbar but lacks a confirmation step before terminating the session, and the API call is fire-and-forget (not awaited), which means error handling is missing and the user receives no feedback. This creates a poor UX and can lead to accidental logouts.

## What Changes

- Add a confirmation dialog (modal) when the user clicks Logout
- Make the logout flow properly await the backend API call
- Show feedback (loading state, error handling) during logout
- Redirect to login page after successful logout
- Fix the existing `logout()` function in `AuthContext` to be async and handle errors

## Capabilities

### New Capabilities
- `logout-confirmation`: Add confirmation dialog before logout to prevent accidental session termination

### Modified Capabilities
- `auth`: Update the "User Logout" requirement to include confirmation dialog, proper async handling, and error feedback

## Impact

- `frontend/src/components/Navbar.tsx` — Add confirmation modal trigger and loading state
- `frontend/src/context/AuthContext.tsx` — Make `logout()` async, add loading/error state handling
- `frontend/src/components/LogoutConfirmModal.tsx` — New component for confirmation dialog
