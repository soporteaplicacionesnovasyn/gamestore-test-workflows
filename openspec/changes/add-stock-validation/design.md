## Context

El modelo `Product` tiene campo `stock: Int` en Prisma, pero ni `cart.ts` ni `orders.ts` lo consultan. Un usuario puede agregar items sin stock al carrito y finalizar la compra sin validación ni descuento. Tampoco se limpia el carrito post-checkout.

## Goals / Non-Goals

**Goals:**
- Validar stock disponible al agregar al carrito (`POST /cart/add`)
- Validar stock suficiente para todos los items al hacer checkout (`POST /orders/checkout`)
- Descontar stock de cada producto al crear la orden exitosamente
- Limpiar el carrito después de checkout exitoso
- Devolver error 400 claro con lista de productos con stock insuficiente

**Non-Goals:**
- No se agrega campo nuevo al schema — `Product.stock` ya existe
- No se agrega UI de stock en frontend (solo API)
- No se implementa reserva temporal de stock (timeout/release)

## Decisions

1. **Validación en cart.ts `POST /add`** — Antes de crear/actualizar el CartItem, consultar `Product.stock`. Si `quantity > stock`, devolver 400 con `{ error: "Insufficient stock", productId, available: stock }`.
2. **Validación en orders.ts `POST /checkout`** — Recorrer todos los items del carrito, verificar `item.quantity <= product.stock` para cada uno. Si alguno falla, devolver 400 con lista completa de productos insuficientes.
3. **Descuento de stock** — Dentro de la transacción de creación de la orden, actualizar `Product.stock -= item.quantity` para cada item. Usar `prisma.$transaction` para atomicidad.
4. **Limpieza de carrito** — Después de crear la orden exitosamente, eliminar los CartItem del carrito vía `prisma.cartItem.deleteMany`.
5. **Manejo de precio como string** — El campo `price` en SQLite es String. Se mantiene `parseFloat()` existente. El descuento de stock no depende del precio.

## Risks / Trade-offs

- **Race condition**: Dos checkouts simultáneos sobre el mismo producto pueden ver stock suficiente antes de que ninguno descuente → Mitigación: la transacción de Prisma en SQLite es serializable para writes en la misma DB.
- **Stock negativo**: Si hay bug, stock puede ir a negativo → Mitigación: agregar `CHECK(stock >= 0)` a nivel schema o validar antes de update.
- **Precio como string**: `price` se almacena como String en SQLite, lo que impide comparaciones numéricas correctas en SQL — fuera del alcance de este cambio.
