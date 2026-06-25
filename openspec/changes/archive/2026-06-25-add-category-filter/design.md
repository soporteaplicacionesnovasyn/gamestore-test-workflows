## Context

The product catalog currently hardcodes 12 categories (`['Adventure', 'Action', 'RPG', 'Shooter', 'Sports', 'Fighting', 'Simulation', 'Strategy', 'Racing', 'Puzzle', 'Platformer', 'Horror']`) on the frontend. The seed data contains additional categories like `Sandbox`, `Battle Royale`, `Party`, `Co-op`, `Metroidvania`, `Roguelike`, and `Card`. Any new category added via the admin panel or seed will be invisible to the filter dropdown until the frontend code is manually updated. The backend already accepts a `?category=` query param on `GET /api/products`, so the filtering logic exists — only the category source-of-truth needs to change.

## Goals / Non-Goals

**Goals:**
- Serve available categories from the backend so the filter stays in sync with actual data
- Provide loading, empty, and error states for the category dropdown
- Support filtering by "All Categories" (no filter) as today

**Non-Goals:**
- Multi-select category filtering
- Category management CRUD (admin panel already handles this)
- Hierarchical/nested categories

## Decisions

| Decisión | Alternativas | Por qué |
|---|---|---|
| New `GET /api/products/categories` endpoint | Inline `DISTINCT category` query inside existing `GET /api/products` | Keeps products endpoint focused; separate concerns; allows clients to cache categories independently |
| Fetch categories on mount with its own loading state | Embed categories in product response | Categories rarely change; separate fetch avoids bloating every product list response |
| Use `prisma.product.findMany({ select: { category: true }, distinct: ['category'] })` | Raw SQL query | Prisma's `distinct` is sufficient for this use case; avoids raw query maintenance |
| Keep existing `?category=` query param on products endpoint | No change needed | Already works; no breaking change |

## Risks / Trade-offs

- **Risk**: Slow query if product table grows very large → Mitigation: add a database index on `category` column
- **Risk**: Category list could become stale in the browser cache → Mitigation: use `Cache-Control: no-cache` or short TTL on the endpoint; frontend refetches on page mount

## Files Changed

| File | Change |
|---|---|
| `backend/src/routes/products.ts` | Add `GET /categories` route |
| `frontend/src/services/api.ts` | Add `getCategories()` method |
| `frontend/src/pages/Products.tsx` | Replace hardcoded `categories` with API fetch |
