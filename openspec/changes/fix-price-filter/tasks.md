## 0. Git Worktree Setup

- [x] 0.1 Create `worktrees/` directory at project root
- [x] 0.2 Add `worktrees/` to `.gitignore`
- [x] 0.3 Create a git worktree for `fix-price-filter` branch: `git worktree add worktrees/fix-price-filter fix-price-filter`
- [x] 0.4 Verify worktree is functional: run `npm install` in both `backend/` and `frontend/` inside the worktree

## 1. Database Schema & Migration

- [x] 1.1 Change `Product.price` in Prisma schema from `String` to `Float`
- [x] 1.2 Create and apply Prisma migration for `TEXT` → `REAL` conversion
- [x] 1.3 Update seed data to use numeric price values (remove quotes)

## 2. Backend Route Fixes

- [x] 2.1 Remove `String(price)` coercion in product create route
- [x] 2.2 Remove `String(price)` coercion in product update route
- [x] 2.3 Fix price filter (`gte`/`lte`) to use numeric comparison (remove `as string` casts)
- [x] 2.4 Fix price sort (`orderBy`) to sort numerically instead of alphabetically

## 3. Frontend Price Filter UI

- [x] 3.1 Add min price input field to Products page
- [x] 3.2 Add max price input field to Products page
- [x] 3.3 Wire inputs to API call via `minPrice`/`maxPrice` query params

## 4. Verify

- [x] 4.1 Verify price filter returns correct numeric range results
- [x] 4.2 Verify sort by price ascending/descending works correctly
- [x] 4.3 Verify cart and checkout still calculate totals correctly
