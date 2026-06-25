## Why

Adding a product that's already in the cart creates a duplicate cart entry instead of incrementing the existing item's quantity. This results in multiple rows for the same product, confusing the user and breaking cart total calculations.

## What Changes

- Fix the `POST /api/cart/add` backend route: when a product already exists in the cart, update its quantity instead of inserting a new `CartItem` row
- No API contract changes — the same endpoint behaves correctly for existing items

## Capabilities

### New Capabilities

None — this is a bug fix within the existing cart capability.

### Modified Capabilities

- `cart`: The "Add to Cart" requirement will correctly increment quantity for duplicate items instead of creating separate entries. The spec's `KNOWN BUG` annotation will be removed for this scenario.

## Impact

- Backend: `backend/src/routes/cart.ts` — one-liner fix in `POST /add` handler
- No database schema changes
- No frontend changes required (the UI already expects correct behavior from the API)
