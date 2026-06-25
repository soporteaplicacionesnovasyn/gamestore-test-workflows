## 1. Advanced Search

- [ ] 1.1 Add search query param to `GET /api/products` with `contains` filter on name, description, category (~15 min)
- [ ] 1.2 Update frontend `api.ts` to pass search param (~5 min)

## 2. Cache System

- [ ] 2.1 Create `backend/src/middleware/cache.ts` with in-memory cache class (Map + TTL) (~15 min)
- [ ] 2.2 Apply cache middleware to `GET /api/products` and `GET /api/products/:id` (~10 min)

## 3. Input Validation

- [ ] 3.1 Add validation for `page` (positive int), `limit` (1-100), `minPrice`/`maxPrice` (positive numbers) (~15 min)
- [ ] 3.2 Return 400 with descriptive error messages on invalid params (~5 min)

## 4. Related Products

- [ ] 4.1 Add `GET /api/products/:id/related` endpoint returning up to 4 products from same category (~15 min)
- [ ] 4.2 Add `getRelated` method to frontend `api.ts` (~5 min)

## 5. Verification

- [ ] 5.1 Test search: GET /api/products?search=rpg returns matching products (~5 min)
- [ ] 5.2 Test cache: second request returns in <10ms (~5 min)
- [ ] 5.3 Test validation: GET /api/products?page=-1 returns 400 error (~5 min)
- [ ] 5.4 Test related: GET /api/products/1/related returns 4 products (~5 min)
