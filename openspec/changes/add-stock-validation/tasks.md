## 1. Stock validation in cart

- [x] 1.1 Add stock check in `cart.ts` POST `/add` — query `Product.stock`, reject with 400 if `quantity > stock`
- [x] 1.2 Return `{ error, productId, available }` JSON on insufficient stock

## 2. Stock validation in checkout

- [x] 2.1 Add stock check loop in `orders.ts` POST `/checkout` — validate all cart items before creating order
- [x] 2.2 Return `{ error: "Insufficient stock", products: [...] }` with per-product details on failure

## 3. Decrement stock atomically

- [x] 3.1 Wrap order creation + stock decrement in `prisma.$transaction` in `orders.ts`
- [x] 3.2 Add `Product.update({ stock: { decrement: item.quantity } })` for each order item

## 4. Clear cart after checkout

- [x] 4.1 Add `prisma.cartItem.deleteMany` after successful order creation in `orders.ts`

## 5. Verify and test

- [x] 5.1 Start backend and verify POST `/cart/add` rejects over-stock quantities
- [x] 5.2 Verify POST `/orders/checkout` rejects when stock is insufficient
- [x] 5.3 Verify stock decrements correctly after successful order
- [x] 5.4 Verify cart is empty after successful checkout

## 6. Unit tests

- [x] 6.1 Install vitest and configure test runner
- [x] 6.2 Write unit test for cart stock validation (add with sufficient stock)
- [x] 6.3 Write unit test for cart stock rejection (add with insufficient stock)
- [x] 6.4 Write unit test for cart product not found rejection
- [x] 6.5 Write unit test for cart combined quantity exceeding stock
- [ ] 6.6 Write unit test for checkout with sufficient stock (verify decrement + cart cleanup)
- [ ] 6.7 Write unit test for checkout with insufficient stock rejection
- [ ] 6.8 Write unit test for checkout with empty cart rejection
- [ ] 6.9 Write unit test for checkout with multiple items where one has insufficient stock
