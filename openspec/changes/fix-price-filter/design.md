## Context

The `Product.price` field is stored as `String` in the Prisma schema, resulting in SQLite storing it as `TEXT`. When the backend applies `gte`/`lte` filters or `orderBy` sorting on this field, SQLite performs lexical (alphabetical) comparison instead of numeric. This breaks price range filtering and price sorting across the entire catalog.

## Goals / Non-Goals

**Goals:**
- Convert `Product.price` from `String` to `Float` in the Prisma schema and database
- Fix price filter (`minPrice`/`maxPrice`) to use numeric comparison
- Fix price sort (`price_asc`/`price_desc`) to use numeric ordering
- Add min/max price range inputs to the frontend products page

**Non-Goals:**
- Changing the `OrderItem.price` field (already `Float`)
- Changing the currency or adding multi-currency support
- Adding server-side validation beyond what Prisma provides

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Schema type | `Float` (Prisma) → `REAL` (SQLite) | Matches numeric semantics; SQLite REAL handles decimal values. Alternative: `Decimal` would be overkill for a storefront. |
| Migration strategy | New migration, not editing existing | Preserves migration history; Prisma handles `TEXT`→`REAL` conversion automatically when values are parseable. |
| Seed data | Remove quotes from price values | Simple change: `'59.99'` → `59.99`. |
| Route coercion | Remove `String(price)` | No longer needed once the schema is `Float`. |
| Frontend price range | Add two number inputs below the sort dropdown | Consistent with existing UI patterns; values sent as `minPrice` and `maxPrice` query params. |

## Risks / Trade-offs

- **Migration edge case**: If any existing `price` value is not parseable as a number, the migration will fail. Mitigation: All seed data uses parseable values; no known unparseable data exists.
- **Frontend cart/checkout**: Already use `parseFloat(item.product.price)`. After the fix, `price` will be a number, so `parseFloat` will still work (no change needed).
