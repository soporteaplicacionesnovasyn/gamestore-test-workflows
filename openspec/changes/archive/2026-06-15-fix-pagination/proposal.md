## Why

The `GET /api/products` endpoint always returns page 1 results regardless of the `page` query parameter, because the Prisma query uses `skip: 0` instead of the calculated offset. This makes pagination non-functional for all pages beyond page 1.

## What Changes

- Fix `skip: 0` to use the calculated `skip` variable in `backend/src/routes/products.ts`
- Update the catalog spec to remove the `KNOWN BUG` annotation for pagination

## Capabilities

### New Capabilities

None — this is a bug fix within the existing catalog capability.

### Modified Capabilities

- `catalog`: The product pagination requirement's "Second page" scenario will now work correctly. The spec's `KNOWN BUG` annotation will be removed.

## Impact

- Backend: `backend/src/routes/products.ts` — one-line change (`skip: 0` → `skip`)
- No database, API contract, or frontend changes
