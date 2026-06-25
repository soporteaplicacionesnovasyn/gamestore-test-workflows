# Análisis: Rating de productos (1-5 estrellas) en el catálogo

## Resumen

Agregar funcionalidad de calificación de productos con 1 a 5 estrellas directamente desde el catálogo. Los usuarios autenticados pueden calificar productos con un solo click; los no autenticados ven el promedio. Todo inline en la tarjeta del producto, sin páginas ni modales adicionales.

## Estado actual

### Backend — Prisma schema

No existe modelo `Rating` ni `Review`. Product tiene solo estos campos:

| Campo       | Tipo       |
|-------------|------------|
| `id`        | `Int`      |
| `name`      | `String`   |
| `description` | `String` |
| `price`     | `Float`    |
| `image`     | `String`   |
| `stock`     | `Int`      |
| `category`  | `String`   |
| `createdAt` | `DateTime` |

No hay relación a ratings ni promedio.

### Backend — `backend/src/routes/products.ts`

`GET /api/products` retorna `products` con paginación. No incluye promedio de calificación ni rating del usuario logueado.

`GET /api/products/:id` retorna un producto individual. Ídem.

No existe endpoint para crear/actualizar calificaciones.

### Frontend — `frontend/src/pages/Products.tsx`

Cada tarjeta de producto muestra:

```
[imagen]
Nombre
Descripción
$Precio
Stock: N
[Add to Cart]
```

No hay estrellas, promedio, ni interacción de rating.

### API Client — `frontend/src/services/api.ts`

```typescript
products: {
  getAll: async (params) => ...     // GET /products?...
  getById: async (id) => ...        // GET /products/:id
  create: async (data) => ...       // POST /products
  update: async (id, data) => ...   // PUT /products/:id
  delete: async (id) => ...         // DELETE /products/:id
}
```

No existe método `rate` ni `getRatings`.

## Plan de implementación

### 1. Prisma — Agregar modelo `Rating`

**Archivo:** `backend/prisma/schema.prisma`

```prisma
model Rating {
  id        Int      @id @default(autoincrement())
  userId    Int
  productId Int
  score     Int      // 1-5
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
  product   Product  @relation(fields: [productId], references: [id])

  @@unique([userId, productId]) // una calificación por usuario/producto
}
```

Agregar al modelo `Product`:

```prisma
model Product {
  ...
  ratings    Rating[]
}
```

La constraint `@@unique([userId, productId])` permite usar `upsert` en la API: si el usuario ya calificó, se actualiza; si no, se crea. Sin duplicados.

Ejecutar migración:

```bash
cd backend
npx prisma migrate dev --name add-rating-model
```

### 2. Backend — Endpoint `POST /api/products/:id/rate`

**Archivo nuevo:** `backend/src/routes/ratings.ts`

```typescript
import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router({ mergeParams: true });
const prisma = new PrismaClient();

// POST /api/products/:id/rate
router.post('/:id/rate', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const productId = parseInt(req.params.id);
    const { score } = req.body;
    const userId = req.userId!;

    if (!score || score < 1 || score > 5) {
      return res.status(400).json({ error: 'Score must be between 1 and 5' });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const rating = await prisma.rating.upsert({
      where: { userId_productId: { userId, productId } },
      update: { score },
      create: { userId, productId, score },
    });

    // Calcular nuevo promedio
    const aggregate = await prisma.rating.aggregate({
      where: { productId },
      _avg: { score: true },
      _count: { score: true },
    });

    res.json({
      success: true,
      data: {
        rating,
        averageRating: aggregate._avg.score ?? 0,
        totalRatings: aggregate._count.score,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/products/:id/ratings
router.get('/:id/ratings', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);

    const ratings = await prisma.rating.findMany({
      where: { productId },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });

    const aggregate = await prisma.rating.aggregate({
      where: { productId },
      _avg: { score: true },
      _count: { score: true },
    });

    res.json({
      success: true,
      data: {
        ratings,
        averageRating: aggregate._avg.score ?? 0,
        totalRatings: aggregate._count.score,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
```

### 3. Backend — Registrar ruta en `index.ts`

**Archivo:** `backend/src/index.ts`

```typescript
import ratingRoutes from './routes/ratings';
// ...
app.use('/api/products', ratingRoutes); // mergeParams necesita que sea subruta de /api/products
```

Importante: `ratingRoutes` se monta en `/api/products` (no en `/api`). Así el path queda `/api/products/:id/rate`.

### 4. Backend — Incluir `averageRating` en `GET /api/products`

**Archivo:** `backend/src/routes/products.ts`

Modificar la query de `findMany` para incluir aggregate de ratings. Opción recomendada: agregar un campo calculado después de obtener los productos.

```typescript
const products = await prisma.product.findMany({ where, skip, take: limitNum, orderBy });

// Agregar averageRating a cada producto
const productIds = products.map(p => p.id);
const ratingsAgg = await prisma.rating.groupBy({
  by: ['productId'],
  where: { productId: { in: productIds } },
  _avg: { score: true },
  _count: { score: true },
});

const ratingMap = new Map(ratingsAgg.map(r => [r.productId, {
  averageRating: r._avg.score ?? 0,
  totalRatings: r._count.score,
}]));

const productsWithRating = products.map(p => ({
  ...p,
  averageRating: ratingMap.get(p.id)?.averageRating ?? 0,
  totalRatings: ratingMap.get(p.id)?.totalRatings ?? 0,
}));
```

### 5. Frontend — Componente `StarRating`

**Archivo nuevo:** `frontend/src/components/StarRating.tsx`

```tsx
import { useState } from 'react';

interface StarRatingProps {
  value: number;           // promedio o rating actual
  totalRatings?: number;   // opcional: muestra conteo
  onChange?: (score: number) => void;  // si se pasa, es interactivo
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;   // permite click para calificar
}

export const StarRating = ({ value, totalRatings, onChange, size = 'sm', interactive = false }: StarRatingProps) => {
  const [hovered, setHovered] = useState(0);
  const [pending, setPending] = useState(false);

  const handleClick = async (score: number) => {
    if (!interactive || !onChange || pending) return;
    setPending(true);
    try {
      await onChange(score);
    } finally {
      setPending(false);
    }
  };

  const starSize = size === 'lg' ? 'w-6 h-6' : size === 'md' ? 'w-5 h-5' : 'w-4 h-4';
  const displayScore = hovered || value;

  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(star => {
        const fill = star <= displayScore ? 'text-yellow-400' : 'text-gray-300';
        const cursor = interactive ? 'cursor-pointer' : '';
        return (
          <svg
            key={star}
            className={`${starSize} ${fill} ${cursor} ${pending ? 'opacity-50' : ''}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            onMouseEnter={() => interactive && setHovered(star)}
            onMouseLeave={() => interactive && setHovered(0)}
            onClick={() => handleClick(star)}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      })}
      {totalRatings !== undefined && (
        <span className="text-xs text-gray-500 ml-1">({totalRatings})</span>
      )}
    </div>
  );
};
```

### 6. Frontend — Integrar rating en tarjeta de producto

**Archivo:** `frontend/src/pages/Products.tsx`

#### 6a. Actualizar interfaz `Product`

```typescript
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  category: string;
  averageRating?: number;
  totalRatings?: number;
}
```

#### 6b. Agregar función `handleRate`

```typescript
const handleRate = async (productId: number, score: number) => {
  if (!user) {
    alert('Please login to rate products');
    return;
  }
  try {
    const result = await api.products.rate(productId, score);
    if (result.success) {
      // Optimistic update: actualizar el producto en la lista
      setProducts(prev => prev.map(p =>
        p.id === productId
          ? { ...p, averageRating: result.data.averageRating, totalRatings: result.data.totalRatings }
          : p
      ));
    }
  } catch (error) {
    console.error('Failed to rate product', error);
  }
};
```

#### 6c. Agregar estrellas en la tarjeta

```tsx
<div className="p-4">
  <h3 className="font-bold text-lg">{product.name}</h3>
  <p className="text-gray-600 text-sm">{product.description}</p>
  <p className="text-blue-600 font-bold mt-2">${product.price}</p>
  <div className="mt-1">
    <StarRating
      value={product.averageRating ?? 0}
      totalRatings={product.totalRatings}
      interactive={!!user}
      onChange={(score) => handleRate(product.id, score)}
    />
  </div>
  <p className="text-sm text-gray-500 mt-1">Stock: {product.stock}</p>
  <button ...>Add to Cart</button>
</div>
```

### 7. API Client — Agregar método `rate`

**Archivo:** `frontend/src/services/api.ts`

```typescript
products: {
  // ... existentes
  rate: async (productId: number, score: number) =>
    fetchWithAuth(`/products/${productId}/rate`, {
      method: 'POST',
      body: JSON.stringify({ score }),
    }).then(r => r.json()),
  getRatings: async (productId: number) =>
    fetchWithAuth(`/products/${productId}/ratings`).then(r => r.json()),
},
```

### 8. Seed — Agregar ratings de ejemplo

**Archivo:** `backend/prisma/seed.ts`

Agregar después de crear productos:

```typescript
// Crear ratings de ejemplo
const users = await prisma.user.findMany({ where: { role: 'user' } });
const allProducts = await prisma.product.findMany();

for (const product of allProducts.slice(0, 20)) {
  const numRatings = Math.floor(Math.random() * 4) + 1;
  for (let i = 0; i < numRatings; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const score = Math.floor(Math.random() * 5) + 1;
    await prisma.rating.upsert({
      where: { userId_productId: { userId: user.id, productId: product.id } },
      update: {},
      create: { userId: user.id, productId: product.id, score },
    });
  }
}
```

## Consideraciones

| Aspecto | Decisión | Razón |
|---------|----------|-------|
| Rating en tarjeta vs página aparte | **En tarjeta** | Pedido explícito: "en el catálogo". Sin páginas extra. |
| Reseña escrita | **No** | Solo estrellas (1-5). Menos fricción, más participación. |
| Una calificación por usuario | **Sí, upsert** | `@@unique([userId, productId])` + `prisma.rating.upsert()`. El usuario puede cambiar su voto. |
| Usuario no autenticado | **Ve promedio** | Las estrellas se muestran como solo lectura. Sin login no puede calificar. |
| Optimistic update | **Sí** | La estrella se ilumina al instante. Si el request falla, se revierte silenciosamente. |
| Promedio en la tarjeta | **Sí** | `averageRating` + `totalRatings` se muestran siempre. |
| Validación | **Backend y frontend** | Score debe ser entero 1-5. Producto debe existir. |
| Estado loading | **Spinner inline** | La estrella se opacity 0.5 mientras se envía el rating. |
| Estado error | **Console.error** | Falla silenciosa — no bloquear al usuario por un rating fallido. |
| Migración | **`prisma migrate dev`** | Genera la tabla `Rating` en SQLite. |

## Archivos a modificar

| Archivo | Cambio |
|---------|--------|
| `backend/prisma/schema.prisma` | ~12 líneas (modelo `Rating` + relación en `Product`) |
| `backend/src/routes/ratings.ts` | **Nuevo** — ~80 líneas |
| `backend/src/index.ts` | ~2 líneas (import + `app.use`) |
| `backend/src/routes/products.ts` | ~20 líneas (agregar `averageRating` a la respuesta) |
| `backend/prisma/seed.ts` | ~15 líneas (ratings de ejemplo) |
| `frontend/src/components/StarRating.tsx` | **Nuevo** — ~65 líneas |
| `frontend/src/pages/Products.tsx` | ~30 líneas (interfaz, handler, JSX) |
| `frontend/src/services/api.ts` | ~8 líneas (método `rate`) |

## Prueba manual

1. Ejecutar migración: `cd backend && npx prisma migrate dev --name add-rating-model`
2. Re-seed: `npm run prisma:seed`
3. Iniciar backend + frontend
4. Navegar a `/products` — ver estrellas en cada tarjeta con promedio
5. Sin login: las estrellas son solo lectura, no se puede calificar
6. Login como `user1@test.com` / `pass123`
7. Hover sobre estrellas de un producto — ver preview brillante
8. Click en 4 estrellas — ver cambio instantáneo, conteo actualizado
9. Click otra vez en 2 estrellas — ver que se actualiza (upsert), no se duplica
10. Login como `user2@test.com` — calificar el mismo producto — el promedio se recalcula
11. Verificar que admin también puede calificar (opcional, depende del requerimiento)
12. Verificar que no se puede enviar score 0 ni 6 (validación 1-5)
