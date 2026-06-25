## Context

El catálogo de GameStore (`GET /api/products`) retorna productos con paginación, filtros y ordenamiento, pero no incluye información de calificaciones. No existe modelo `Rating` en la base de datos ni endpoint para crear/consultar ratings. Los usuarios no tienen forma de calificar productos ni de ver valoraciones de otros compradores.

## Goals / Non-Goals

**Goals:**
- Permitir a usuarios autenticados calificar productos con 1-5 estrellas (un voto por usuario/producto)
- Mostrar promedio y conteo de ratings en cada tarjeta del catálogo
- Usuarios no autenticados ven el promedio pero no pueden calificar
- Los ratings se integran inline en las tarjetas existentes, sin páginas ni modales nuevos

**Non-Goals:**
- Reseñas escritas — solo calificación numérica (1-5)
- Página de detalle de producto — la interacción ocurre directo en el catálogo
- Sistema de "útil/no útil" para ratings
- Moderación de ratings
- Ordenamiento por rating en el catálogo

## Decisions

| Decisión | Alternativas | Por qué |
|----------|-------------|--------|
| `@@unique([userId, productId])` + `upsert` | Permitir múltiples votos por usuario | Un usuario solo debe tener un voto por producto. `upsert` permite crear o actualizar sin lógica condicional extra |
| Rating inline en tarjeta vs página aparte | Modal, página de detalle | El requerimiento es "en el catálogo". Inline evita crear nuevas rutas y páginas |
| SVG inline para estrellas vs librería de iconos | `react-icons`, `@heroicons/react` | Sin dependencias nuevas. SVG inline es liviano, personalizable y no requiere npm install |
| `groupBy` en backend para promedio | Calcular en frontend, store pre-calculado | `groupBy` + `_avg` es eficiente con SQLite y siempre está actualizado. Store pre-calculado requeriría triggers o actualizaciones periódicas |
| `mergeParams: true` en router de ratings | Montar en ruta separada `/api/ratings` | Usar `mergeParams` permite paths como `/api/products/:id/rate` manteniendo la jerarquía REST |

### Data flow

```
Usuario clickea estrella N (autenticado)
        │
        ▼
handleRate(productId, N) llamado
        │
        ├─ Optimistic: setProducts actualiza inmediato
        │
        ▼
POST /api/products/:id/rate { score: N }
        │
        ▼
Backend: prisma.rating.upsert({ userId, productId, score })
        │
        ▼
Backend: prisma.rating.aggregate({ where: { productId }, _avg, _count })
        │
        ▼
Response: { success, data: { rating, averageRating, totalRatings } }
        │
        ▼
Frontend: actualiza producto con datos reales del server
```

## Risks / Trade-offs

| Riesgo | Mitigación |
|--------|-----------|
| `groupBy` query extra por request de listado | Solo se ejecuta una query con `where: { productId: { in: ids } }` — O(productIds) en SQLite. Para ~50 productos actuales es negligible |
| Usuario cambia rating constantemente (abuso) | `upsert` limitado a 1 voto. Se podría agregar rate limiting si es necesario |
| Promedio con 1-2 ratings no representativo | Mostrar `totalRatings` junto al promedio para que el usuario tenga contexto |
| Conflictos de mergeParams con rutas existentes `/:id` | Solo se agregan `/:id/rate` y `/:id/ratings` — no hay conflicto con las rutas existentes del products router |

## Archivos afectados

| Archivo | Tipo |
|---------|------|
| `backend/prisma/schema.prisma` | Modificado |
| `backend/src/routes/ratings.ts` | Nuevo |
| `backend/src/index.ts` | Modificado |
| `backend/src/routes/products.ts` | Modificado |
| `backend/prisma/seed.ts` | Modificado |
| `frontend/src/components/StarRating.tsx` | Nuevo |
| `frontend/src/pages/Products.tsx` | Modificado |
| `frontend/src/services/api.ts` | Modificado |

## Migration Plan

1. Ejecutar `npx prisma migrate dev --name add-rating-model` para crear tabla `Rating`
2. Re-seed: `npm run prisma:seed` para agregar ratings de ejemplo
3. Iniciar backend, verificar endpoints
4. Iniciar frontend, verificar estrellas en catálogo
5. Rollback: `npx prisma migrate rollback` si es necesario
