## 0. Set up git worktrees for isolated implementation

- [x] 0.1 Create feature branches from `main`: `git branch feature/add-logout-button-backend main` and `git branch feature/add-logout-button-frontend main`
- [x] 0.2 Add `worktrees/` to `.gitignore` so worktree dirs don't pollute the main repo
- [x] 0.3 Create backend worktree: `git worktree add worktrees/backend feature/add-logout-button-backend`
- [x] 0.4 Create frontend worktree: `git worktree add worktrees/frontend feature/add-logout-button-frontend`
- [x] 0.5 Run `npm install` in both `worktrees/backend` and `worktrees/frontend`
- [x] 0.6 Run `prisma:generate`, `prisma:migrate`, and `prisma:seed` in `worktrees/backend`
- [x] 0.7 Verify both worktrees build: `npm run build` in each
- [x] 0.8 Add a note in `worktrees/README.md` explaining which branch each worktree maps to and how to keep them in sync with `main`

## 1. Make logout async in AuthContext

- [x] 1.1 Change `logout()` signature from `() => void` to `() => Promise<void>` in `AuthContextType` interface
- [x] 1.2 Add `await` to the `api.auth.logout()` call inside `AuthContext.logout()`
- [x] 1.3 Add try/catch error handling — clear tokens locally even if the API call fails
- [x] 1.4 Update the `AuthContext.Provider` value to reflect new async signature

## 2. Create LogoutConfirmModal component

- [x] 2.1 Create `frontend/src/components/LogoutConfirmModal.tsx` with props: `isOpen`, `onConfirm`, `onCancel`, `isLoading`, `error`
- [x] 2.2 Implement modal with Tailwind styling (centered overlay, backdrop, title, message, Cancel/Logout buttons)
- [x] 2.3 Show loading spinner on the Logout button when `isLoading` is true and disable both buttons
- [x] 2.4 Display error message inside the modal if `error` prop is provided

## 3. Wire logout confirmation in Navbar

- [x] 3.1 Import `LogoutConfirmModal` and `useNavigate` in `Navbar.tsx`
- [x] 3.2 Add local state: `showLogoutModal`, `isLoggingOut`, `logoutError`
- [x] 3.3 Change the Logout button `onClick` to open the modal instead of calling `logout()` directly
- [x] 3.4 Render `LogoutConfirmModal` and handle confirm: set loading state, await `logout()`, navigate to `/login` on success, catch and display error on failure
- [x] 3.5 Handle cancel: close the modal, clear any error state
