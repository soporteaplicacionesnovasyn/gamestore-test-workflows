## 1. Backend

- [x] 1.1 Add `GET /api/products/categories` route in `backend/src/routes/products.ts` that returns distinct category values sorted alphabetically
- [x] 1.2 Handle empty categories case (empty array response)
- [x] 1.3 Handle database errors with 500 status and error message

## 2. Frontend

- [x] 2.1 Add `getCategories()` method to API client in `frontend/src/services/api.ts`
- [x] 2.2 Replace hardcoded `categories` array in `frontend/src/pages/Products.tsx` with state fetched from the new endpoint on mount
- [x] 2.3 Add loading state for the category dropdown ("Loading categories..." + disabled)
- [x] 2.4 Add error state for the category dropdown ("Failed to load categories" + disabled)
- [x] 2.5 Ensure category selection resets page to 1 and works with other active filters

## 3. Verification

- [ ] 3.1 Start backend and frontend dev servers
- [ ] 3.2 Verify dropdown is populated with categories matching seed data
- [ ] 3.3 Verify filtering by category shows correct products
- [ ] 3.4 Verify "All Categories" clears the filter
- [ ] 3.5 Verify category filter works alongside search, price, and sort filters
