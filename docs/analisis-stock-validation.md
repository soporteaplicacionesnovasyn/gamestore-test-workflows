# Análisis: Falta de validación de stock

## Resumen

El modelo `Product` tiene un campo `stock` (Int) definido en `backend/prisma/schema.prisma:28`, pero nunca se valida ni se descuenta al agregar productos al carrito o al crear una orden.

## Bugs identificados

### 1. Carrito — Sin validación al agregar items
- **Archivo:** `backend/src/routes/cart.ts:65-66`
- **Problema:** `POST /cart/add` no verifica si hay stock suficiente antes de agregar un producto.
- **Impacto:** Un usuario puede agregar 100 unidades aunque el producto tenga stock=3.

### 2. Checkout — Sin validación de stock suficiente
- **Archivo:** `backend/src/routes/orders.ts:26-27`
- **Problema:** `POST /orders/checkout` no valida que el stock alcance para la cantidad solicitada.
- **Impacto:** La orden se crea aunque no haya stock, y el stock del producto nunca se descuenta.

### 3. Carrito no se limpia después del checkout
- **Archivo:** `backend/src/routes/orders.ts:59-60`
- **Problema:** Después de crear la orden, el carrito permanece con los items.

### 4. Sin paso de confirmación
- **Archivo:** `backend/src/routes/orders.ts:62-63`
- **Problema:** La orden se crea inmediatamente sin confirmación del usuario.

## Estructura de datos

```
Product.stock: Int        ← existe pero nunca se usa en validaciones
CartItem.quantity: Int    ← se agrega sin verificar stock
OrderItem.quantity: Int   ← se crea sin verificar stock
```

## Rutas en el grafo del proyecto

- `CartItem` → `Product` (referencia)
- `OrderItem` → `Product` (referencia)
- `cart.ts` ↔ `orders.ts` (vía `index.ts`)
