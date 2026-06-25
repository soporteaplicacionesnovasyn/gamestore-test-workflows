## 1. Backend Fix

- [x] 1.1 Change `prisma.cartItem.create` to `prisma.cartItem.update` in `backend/src/routes/cart.ts:54` when item already exists, using `existingItem.quantity + quantity`

## 2. Spec Cleanup

- [x] 2.1 Remove `KNOWN BUG` annotation from `openspec/specs/cart/spec.md` under the "Add to Cart" requirement
