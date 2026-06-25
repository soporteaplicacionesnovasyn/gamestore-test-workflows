## Why

Page 2 of the product catalog returns the same 10 products as page 1, making pagination completely unusable for users browsing beyond the first page. This is a known bug documented in the catalog spec.

## What Changes

- Fix the pagination offset (`skip`) parameter in `GET /api/products` to use the calculated value instead of the hardcoded `0`
- Update the catalog spec to remove the "KNOWN BUG" note about pagination

## Capabilities

### New Capabilities
*(none — this is a bugfix, not a new capability)*

### Modified Capabilities
- `catalog`: Fix pagination so page N returns products (N-1)*limit+1 through N*limit, matching the existing spec requirement

## Impact

- `backend/src/routes/products.ts:47` — change `skip: 0` to `skip`
- `openspec/specs/catalog/spec.md` — remove known bug documentation
- No API contract changes, no new dependencies, no migration required
