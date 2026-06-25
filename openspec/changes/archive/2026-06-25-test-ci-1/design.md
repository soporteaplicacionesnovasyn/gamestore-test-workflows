## Context

El catálogo de productos (`GET /api/products`) tiene bugs documentados: sin caché (cada request consulta la BD), y N+1 query problem. Tampoco hay validación de parámetros ni búsqueda por texto, y no existe un endpoint para encontrar productos relacionados.

## Goals / Non-Goals

**Goals:**
- Agregar búsqueda por nombre/descripción/categoría con `contains`
- Implementar caché en memoria con TTL de 60 segundos
- Validar page, limit, price min/max, sort params
- Endpoint `GET /api/products/:id/related` que retorna hasta 4 productos de la misma categoría excluyendo el actual

**Non-Goals:**
- Caché distribuida (Redis) — solo en memoria
- Búsqueda con ElasticSearch — solo `contains` de Prisma
- Productos relacionados basados en historial de compras — solo por categoría

## Decisions

| Decisión | Alternativas | Por qué |
|----------|-------------|--------|
| Caché en memoria con `Map` | Redis, node-cache | Sin dependencias externas, fácil de implementar, suficiente para ~50 productos |
| TTL de 60s | 30s, 300s | Balance entre frescura de datos y reducción de queries |
| `contains` con Prisma | Búsqueda全文 con índices SQLite | `contains` funciona con SQLite sin migraciones adicionales |
| Validación manual | express-validator, zod | Sin dependencias nuevas, validación simple con checks inline |

## Files Affected

| File | Type |
|------|------|
| `backend/src/routes/products.ts` | Modified |
| `backend/src/middleware/cache.ts` | New |
| `backend/src/routes/products.ts` | Modified |
| `frontend/src/services/api.ts` | Modified |
