## Context

The `POST /api/cart/add` route in `backend/src/routes/cart.ts` creates a new `CartItem` row when a product already exists in the cart, instead of incrementing the existing item's quantity. The code already checks for an existing item via `prisma.cartItem.findFirst` but then uses `prisma.cartItem.create` in both branches (new and existing). This produces duplicate rows for the same product.

## Goals / Non-Goals

**Goals:**
- Fix duplicate cart items: when the same product is added again, increment the existing item's quantity
- Minimize risk — zero changes to API contract, schema, or frontend

**Non-Goals:**
- Cart persistence across reloads (separate bug)
- Stock validation (separate bug)
- Cart total recalculation (separate bug)

## Decisions

| Decision | Rationale |
|----------|-----------|
| Use `prisma.cartItem.update` instead of `create` in the existing-item branch | The `existingItem` is already fetched via `findFirst` — switching to `update` is a one-line change. Prisma's `update` with `where: { id: existingItem.id }` sets quantity to `existingItem.quantity + quantity`. No new dependencies. |
| Keep the same `POST /api/cart/add` endpoint | The frontend already calls this endpoint. No contract change means zero frontend risk. |

## Risks / Trade-offs

- [Low] **Race condition**: two simultaneous add requests for the same product could both pass the `findFirst` check before either updates. Risk is low for single-user carts. If needed later, a Prisma transaction with `$transaction` can serialize access — not required for this fix.
