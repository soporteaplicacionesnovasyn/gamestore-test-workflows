## Why

The catalog currently lacks text-based search — users must browse all products or filter by exact category and price range. Adding wildcard text search ("comodín") enables users to find products by typing partial names, significantly improving discoverability and UX.

## What Changes

- New `search` query parameter on `GET /api/products` that filters products by name using substring matching (case-insensitive)
- New search input field on the Products page with 400ms debounce to avoid excessive API calls
- Modified `catalog` spec — add search requirement with Given/When/Then scenarios
- No database migration required (search is handled at query level via Prisma `contains`)

## Capabilities

### New Capabilities
- *(none — search is added to existing catalog capability)*

### Modified Capabilities
- `catalog`: Add text-based wildcard search requirement with substring matching (contains), case-insensitive, composable with existing filters (category, price range, sort, pagination)

## Impact

- **Backend**: `backend/src/routes/products.ts` — add `search` param to query destructuring and `where.name.contains` + `mode: 'insensitive'` to Prisma filter
- **Frontend**: `frontend/src/pages/Products.tsx` — add `searchInput`/`search` state, debounce effect (400ms), pass param to API, render text input
- **API client**: `frontend/src/services/api.ts` — no changes needed (dynamic params already supported via `URLSearchParams`)
- **DB**: No migration required. SQLite `LIKE` via Prisma `contains` works without schema changes
- **Dependencies**: None — Prisma `contains` is built-in; no new npm packages needed

## Riesgos

| Riesgo | Mitigación |
|--------|------------|
| Búsqueda sin debounce genera demasiadas llamadas API | Debounce de 400ms en el frontend |
| Resultados lentos en catálogo grande (>10k productos) | Prisma `contains` usa `LIKE` en SQLite — aceptable para catálogos pequeños; agregar índice full-text si escala |
| Case-sensitive results confunden al usuario | Usar `mode: 'insensitive'` para que "Adventure" y "adventure" coincidan |

## Complejidad

**Baja** — cambios localizados en 2 archivos, sin migración de DB, sin nuevos endpoints, sin nuevas dependencias.
