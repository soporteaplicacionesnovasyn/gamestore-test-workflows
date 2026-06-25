## Context

The GameStore catalog (`GET /api/products`) supports pagination, category filter, price range filter, and sorting — but has no text search. Users must browse all products or rely on exact category matching. The proposal and specs define a wildcard text search using substring (case-insensitive) matching on product names, composable with all existing filters.

The implementation is low complexity: 2 files modified (backend route, frontend Products page), 0 new dependencies, 0 DB migrations.

## Goals / Non-Goals

**Goals:**
- Add `search` query parameter to `GET /api/products` that filters by `name` using case-insensitive substring matching
- Add a search input on the Products page with 400ms debounce to prevent excessive API calls
- Search composes correctly with all existing filters (category, price range, sort, pagination)
- Empty search query returns all products (no-op)

**Non-Goals:**
- Full-text search engine (Elasticsearch, MeiliSearch, etc.) — not needed for current catalog size (~50 products)
- Search by description or other fields — scope limited to product name
- Autocomplete/suggestions API — not required by specs
- Server-side caching — addressed separately in existing BUG/TODO comments

## Decisions

| Decision | Alternatives | Why |
|----------|-------------|-----|
| `contains` over `startsWith` for name matching | `startsWith` (prefix only) | User asked for "comodín" (wildcard). `contains` finds results even when the typed term is in the middle of the name, matching user expectation for search |
| `mode: 'insensitive'` (Prisma) | Manual `.toLowerCase()` in JS | Prisma handles case-insensitive `LIKE` at the database level; simpler, cleaner, and the Prisma-native approach |
| 400ms debounce on frontend | No debounce, 200ms, 600ms | 400ms balances responsiveness vs. API call reduction. Fast typists won't fire 10+ requests per second |
| Single `search` param over `q` | `q` (common convention) | `search` is more explicit and self-documenting in the URL; the spec calls it "search" — keeping alignment |
| No new API endpoint | New `/api/products/search` | Adding a param to the existing GET endpoint avoids code duplication, URL routing overhead, and keeps all filter logic in one place |

### Data flow

```
User types "adv" in search input
        │
        ▼
setSearch("adv") → setPage(1)
        │
        ▼  (400ms debounce)
loadProducts() called
        │
        ▼
api.products.getAll({ page:1, limit:10, search:"adv", ...otherFilters })
        │
        ▼
GET /api/products?search=adv&page=1&limit=10&...
        │
        ▼
Backend builds Prisma where clause:
  where.name = { contains: "adv", mode: "insensitive" }
        │
        ▼
SQLite: SELECT * FROM Product WHERE name LIKE '%adv%' ...
        │
        ▼
Response: matching products (paginated)
        │
        ▼
Frontend renders product grid
```

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| `LIKE '%term%'` cannot use standard B-tree indexes — full table scan on SQLite | Acceptable for current catalog size (~50 products). If catalog grows past 10k, add a FTS5 virtual table or migrate to a search engine |
| Rapid typing floods API despite debounce | 400ms debounce prevents most excess calls. The `loadProducts` function is already guarded by `setLoading(true)` which disables further clicks |
| Case-insensitive `LIKE` in SQLite is ASCII-only by default (does not handle Unicode case folding for e.g. German ß → SS) | Acceptable for an English-language game catalog. If internationalization is needed, use `COLLATE NOCASE` or a Unicode-aware approach |
| User searches with leading/trailing spaces | Trim the search string on the backend to avoid unexpected behavior. Handled by Prisma `contains` behavior — spaces are matched literally |
| SQL injection via search parameter | Prisma parameterizes all queries by default — `contains` is translated to `LIKE ?` with bound parameters, making SQL injection impossible through this vector. No raw SQL is used |

## Migration Plan

Not applicable — no schema changes, no data migration, no deployment steps beyond normal code deployment.

## Open Questions

- Should search also match the `description` field? Currently scoped to `name` only. Can be extended later without breaking changes.
- Should the search input show a "clear" button (×) to reset? Not required by specs but a common UX pattern.
