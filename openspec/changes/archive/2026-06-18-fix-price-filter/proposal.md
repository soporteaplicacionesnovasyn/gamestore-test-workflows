## Why

Product prices are stored as `String` in SQLite, causing price filters (`minPrice`/`maxPrice`) and sort orders (`price_asc`/`price_desc`) to perform lexical (alphabetical) comparisons instead of numeric ones. This means `"10" < "2"` is true, and products sort as `"0"`, `"14.99"`, `"19.99"`, `"24.99"`, `"29.99"`, `"39.99"`, `"4.99"`, ... — making the catalog feature unreliable.

## What Changes

- Change `Product.price` in the Prisma schema from `String` to `Float`
- Create and apply a new Prisma migration to convert the SQLite column from `TEXT` to `REAL`
- Update seed data to use numeric prices
- Remove `String(price)` coercion in product create/update routes
- Fix price filter (`gte`/`lte`) and sort (`orderBy`) in the products route to work with numeric comparisons
- Ensure frontend cart and checkout pages continue to work (they already use `parseFloat`)
- Add min/max price input fields to the frontend products page

## Capabilities

### New Capabilities
- `price-filter-ui`: Frontend UI for entering min/max price range filters on the products page

### Modified Capabilities
- `catalog`: Price filter requirement changes from lexical to numeric comparison; sort by price changes from alphabetical to numeric

## Impact

- `backend/prisma/schema.prisma` — Schema field type change
- `backend/prisma/seed.ts` — Seed data values
- `backend/src/routes/products.ts` — Filter, sort, create, and update logic
- `frontend/src/pages/Products.tsx` — Add price range inputs
