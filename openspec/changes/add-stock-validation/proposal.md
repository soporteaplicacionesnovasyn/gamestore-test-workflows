## Why

El campo `stock` existe en el modelo `Product` pero nunca se valida ni descuenta al agregar items al carrito ni al crear órdenes. Esto permite comprar productos sin stock disponible, generando órdenes inválidas y una experiencia de usuario engañosa.

## What Changes

- Validar stock disponible antes de agregar un producto al carrito (`POST /cart/add`)
- Validar stock suficiente para todos los items al hacer checkout (`POST /orders/checkout`)
- Devolver error 400 si el stock es insuficiente, indicando qué productos fallaron
- Descontar stock de cada producto al crear la orden exitosamente
- Limpiar el carrito después de un checkout exitoso
- Agregar propiedad `stock` a la respuesta de productos donde falte
- Eliminar el bug de carrito no limpio post-checkout

## Capabilities

### New Capabilities
- `stock-validation`: Validación y descuento de stock en flujo de carrito y checkout

### Modified Capabilities
*(ninguna — no hay specs existentes que cambien)*

## Impact

- **Backend**: `backend/src/routes/cart.ts`, `backend/src/routes/orders.ts`
- **Schema**: Prisma ya tiene `Product.stock` — no requiere migración
- **API**: Nuevos errores 400 con `{ error: "Insufficient stock", products: [...] }` en endpoints existentes
