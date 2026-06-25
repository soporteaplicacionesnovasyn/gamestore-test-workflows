## 0. Git Worktree Isolation

- [x] 0.1 Create `worktrees/` directory at repo root
- [x] 0.2 Create git worktree `worktrees/improve-error-messages` on new branch `improve-error-messages` from `dev-manrique`
- [x] 0.3 Verify worktree is clean and on correct branch
- [x] 0.4 Run `npm install` + `npm run prisma:generate` + `npm run prisma:migrate` + `npm run prisma:seed` in worktree backend
- [x] 0.5 Run `npm install` in worktree frontend

## 1. Backend: Error Response Standardization

- [x] 1.1 Update global error handler in `index.ts` to return `{ error: "Internal server error", status: 500 }` instead of `'Something went wrong!'`
- [x] 1.2 Replace all `catch (error: any)` blocks in `routes/auth.ts` that return `error.message` with safe `{ error: "Internal server error", status: 500 }` responses, logging original error to console
- [x] 1.3 Replace all `catch (error: any)` blocks in `routes/products.ts` that return `error.message` with safe responses
- [x] 1.4 Replace all `catch (error: any)` blocks in `routes/cart.ts` that return `error.message` with safe responses
- [x] 1.5 Replace all `catch (error: any)` blocks in `routes/orders.ts` that return `error.message` with safe responses
- [x] 1.6 Replace all `catch (error: any)` blocks in `routes/admin.ts` that return `error.message` with safe responses

## 2. Backend: Request Body Validation

- [x] 2.1 Add helper function `validateRequired(body, fields)` that checks for required fields and returns a 400 error with field name if missing
- [x] 2.2 Add input validation to `POST /auth/register` (email format, password min 6 chars)
- [x] 2.3 Add input validation to `POST /auth/login` (email and password required)
- [x] 2.4 Add input validation to `POST /products` (name, price, stock required; price and stock as numbers)
- [x] 2.5 Add input validation to `PUT /products/:id` (at least one field to update)
- [x] 2.6 Add input validation to `POST /cart/add` (productId required, quantity positive integer)
- [x] 2.7 Add input validation to `PUT /cart/item/:itemId` (quantity positive integer)
- [x] 2.8 Add input validation to `POST /orders/checkout` (shippingAddress and paymentMethod required)
- [x] 2.9 Add input validation to `PUT /admin/orders/:id/status` (status must be a non-empty string)

## 3. Backend: Admin Role Enforcement

- [x] 3.1 Create `requireAdmin` middleware in `middleware/auth.ts` that checks `req.user.role === 'admin'` and returns 403 with "Admin access required" if not
- [x] 3.2 Apply `requireAdmin` middleware to all admin routes in `routes/admin.ts`

## 4. Backend: Stock Validation

- [x] 4.1 Add stock check in `POST /cart/add` — verify product stock > 0 before adding; return 400 with "Product out of stock" if insufficient
- [x] 4.2 Add stock check in `POST /orders/checkout` — verify all cart items have sufficient stock before creating order; return 400 with "Insufficient stock" if any fail

## 5. Frontend: API Client Error Propagation

- [x] 5.1 Add `checkResponse` helper in `services/api.ts` that checks `response.ok`, parses JSON, and rejects with error message on failure
- [x] 5.2 Update all API methods in `services/api.ts` to use `checkResponse` so HTTP errors reject the promise

## 6. Frontend: Error States on All Pages

- [x] 6.1 Add error state and inline red error banner to Products page for load failures
- [x] 6.2 Add error state to Cart page for load and action failures, display in red banner
- [x] 6.3 Add error state to Checkout page and replace `alert()` calls with inline red error banner
- [x] 6.4 Add error state to Admin page for load and action failures, display in red banner
- [x] 6.5 Add `error` state to CartContext exposed via context value

## 7. Frontend: Client-Side Validation

- [x] 7.1 Add email format validation on Login and Register forms with inline error message
- [x] 7.2 Add password minimum length validation on Register form with inline error message
- [x] 7.3 Add required field validation on Login and Register forms
- [x] 7.4 Add shipping address required validation on Checkout form

## 8. Frontend: Broken Image Fallback

- [x] 8.1 Add `onError` handler to product `<img>` elements in Products page that sets a fallback placeholder image
