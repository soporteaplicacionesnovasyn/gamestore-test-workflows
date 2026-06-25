## Why

El catálogo de productos actualmente no permite a los usuarios calificar productos. Agregar un sistema de rating de 1 a 5 estrellas permite a los compradores compartir su opinión y ayuda a otros usuarios a identificar los productos mejor valorados, mejorando la experiencia de compra y la confianza en la plataforma.

## What Changes

- Nuevo modelo `Rating` en Prisma con relación a `User` y `Product` y constraint `@@unique([userId, productId])`
- Nueva migración de base de datos SQLite
- Nuevo endpoint `POST /api/products/:id/rate` (autenticado) para crear/actualizar calificación
- Endpoint `GET /api/products/:id/ratings` para obtener calificaciones y promedio
- Modificar `GET /api/products` para incluir `averageRating` y `totalRatings` en la respuesta
- Nuevo componente frontend `<StarRating>` (SVG interactivo, 1-5 estrellas)
- Integrar estrellas en las tarjetas del catálogo (lectura para no autenticados, interacción para autenticados)
- Actualizar `api.ts` con método `rate(productId, score)`
- No requiere nuevas dependencias externas

## Capabilities

### New Capabilities
- `product-rating`: Calificación de productos con 1-5 estrellas, visualización de promedio en el catálogo, creación/actualización de rating por usuario autenticado

### Modified Capabilities
- `catalog`: El listado de productos (`GET /api/products`) ahora incluye `averageRating` y `totalRatings` en la respuesta

## Impact

- **Backend**: `backend/prisma/schema.prisma` — nuevo modelo `Rating` + relación en `Product`. Nueva migración. `backend/src/routes/products.ts` — incluir promedio en respuesta. Nuevo archivo `backend/src/routes/ratings.ts` — endpoints de rating. `backend/src/index.ts` — registrar rutas
- **Frontend**: `frontend/src/components/StarRating.tsx` — nuevo componente. `frontend/src/pages/Products.tsx` — integrar estrellas en tarjetas. `frontend/src/services/api.ts` — método `rate`
- **DB**: Migración requerida — nueva tabla `Rating`
- **Dependencias**: Ninguna nueva
- **Complejidad**: Baja — cambios localizados, ~8 archivos modificados/creados

## Riesgos

| Riesgo | Mitigación |
|--------|------------|
| Usuario califica muchas veces el mismo producto | `@@unique([userId, productId])` + `upsert` — solo un voto por usuario/producto |
| Rating sin autenticación | Endpoint protegido con middleware `authenticate` |
| Promedio incorrecto si hay pocos ratings | Mostrar conteo de ratings junto al promedio para dar contexto |
| Estrellas no responsivas en mobile | Usar SVG con clases Tailwind responsive |

## Complejidad

**Baja** — sin nuevas dependencias, sin cambios arquitectónicos, patrón CRUD estándar similar a carrito/órdenes existentes.
