## Why

The product catalog currently uses a hardcoded list of categories on the frontend, which diverges from the actual categories stored in the database. This causes missing categories (e.g. "Sandbox", "Battle Royale", "Party", "Co-op", "Metroidvania", "Roguelike", "Card" from seed data) and will require manual updates every time new categories are added. A dynamic category filter sourced from the backend solves this drift, improves maintainability, and provides a better browsing experience.

## What Changes

- Add a `GET /api/products/categories` endpoint that returns distinct category values from the database
- Replace the hardcoded `categories` array in the frontend Products page with a dynamic fetch from the new endpoint
- Add proper loading, empty, and error states for the category dropdown
- Update the catalog spec to include a dedicated category filter requirement with Given/When/Then scenarios
- Add the category dropdown to the Product Detail page's "Browse by category" navigation if applicable

## Capabilities

### New Capabilities
- `category-filter`: Dynamic category listing and filtering for the product catalog

### Modified Capabilities
<!-- No existing spec-level requirements are changing; this adds a new capability -->

## Impact

- **Backend**: New route `GET /api/products/categories` added to `backend/src/routes/products.ts`
- **Frontend**: `frontend/src/pages/Products.tsx` updated to fetch categories from API instead of hardcoded array; new API client method in `frontend/src/services/api.ts`
- **Database**: No schema migration required; leverages existing `category` column on `Product` model
- **Riesgos**: The new endpoint could be slow if there are many distinct categories — mitigated by adding `DISTINCT` query and optional caching. Complexity: **Baja**. No external dependencies.
