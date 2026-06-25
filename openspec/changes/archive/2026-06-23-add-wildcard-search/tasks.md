## 1. Backend

- [x] 1.1 Add `search` parameter to query destructuring in `GET /api/products` (~5 min)
- [x] 1.2 Add `where.name.contains` condition with `mode: 'insensitive'` to Prisma filter (~10 min)
- [x] 1.3 Trim whitespace from search input to avoid unexpected behavior (~5 min)
- [x] 1.4 Align JSON response to `{ success, data: { products, total, page, totalPages } }` convention (~10 min)

## 2. Frontend

- [x] 2.1 Add `search` state variable to Products page (~5 min)
- [x] 2.2 Add 400ms debounce effect that triggers `loadProducts` on search change (~10 min)
- [x] 2.3 Include `search` in API params object passed to `api.products.getAll` (~5 min)
- [x] 2.4 Add search input field (text, placeholder, controlled by state) to the filter bar (~10 min)
- [x] 2.5 Reset page to 1 when search term changes (~2 min)
- [x] 2.6 Add error state and red banner for API errors (~10 min)
- [x] 2.7 Read `response.data` for new `{ success, data }` format (~2 min)

## 3. Tests

- [x] 3.1 Write backend test: search returns filtered products by name (~15 min)
- [x] 3.2 Write backend test: search with no matches returns empty list (~10 min)
- [x] 3.3 Write backend test: search combined with category filter (~15 min)
- [x] 3.4 Write backend test: search is case-insensitive (~10 min)
- [x] 3.5 Write backend test: server error returns `{ success: false, error }` (~10 min)
- [x] 3.6 Run test suite and confirm all tests pass (~5 min)

## 4. Verification

- [x] 4.1 Start backend + frontend and verify search input renders in the Products page (~5 min)
- [x] 4.2 Type "adv" and confirm only products with "adv" in name appear (~5 min)
- [x] 4.3 Clear search and confirm all products return (~2 min)
- [x] 4.4 Combine search with category filter and verify both apply (~5 min)
- [x] 4.5 Combine search with price range filter and verify both apply (~5 min)
- [x] 4.6 Combine search with sort and verify results are ordered correctly (~5 min)
- [x] 4.7 Verify case-insensitive: "ADVENTURE" and "adventure" return same results (~3 min)
- [x] 4.8 Type rapidly and confirm only one API call fires after 400ms idle (~5 min)
- [x] 4.9 Trigger API error and confirm red error banner appears (~5 min)
