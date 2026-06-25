## 1. Database

- [x] 1.1 Add `Rating` model to Prisma schema with `@@unique([userId, productId])` and relation to `Product` (~10 min)
- [x] 1.2 Run migration: `npx prisma migrate dev --name add-rating-model` (~5 min)
- [x] 1.3 Update seed with sample ratings for test users (~15 min)

## 2. Backend

- [x] 2.1 Create `backend/src/routes/ratings.ts` with `POST /:id/rate` (authenticated, upsert, validate 1-5) (~20 min)
- [x] 2.2 Add `GET /:id/ratings` endpoint returning ratings list + average/count (~15 min)
- [x] 2.3 Register rating routes in `backend/src/index.ts` with `mergeParams` (~5 min)
- [x] 2.4 Modify `GET /api/products` to include `averageRating` and `totalRatings` per product (~15 min)

## 3. Frontend

- [x] 3.1 Create `StarRating` component with interactive SVG stars and hover preview (~20 min)
- [x] 3.2 Add `rate` and `getRatings` methods to API client in `api.ts` (~5 min)
- [x] 3.3 Integrate StarRating in product cards with interactive/readonly modes based on auth (~15 min)

## 4. Tests

- [x] 4.1 Write backend test: rate product successfully (~15 min)
- [x] 4.2 Write backend test: update existing rating (~10 min)
- [x] 4.3 Write backend test: invalid score returns 400 (~10 min)
- [x] 4.4 Write backend test: unauthenticated rate returns 401 (~10 min)
- [x] 4.5 Run test suite and confirm all tests pass (~5 min)

## 5. Verification

- [ ] 5.1 Re-seed DB and start backend + frontend (~5 min)
- [ ] 5.2 Verify stars show on all product cards with correct average (~5 min)
- [ ] 5.3 Login as user and click stars to rate — verify optimistic update (~5 min)
- [ ] 5.4 Change rating — verify upsert works without duplicates (~5 min)
- [ ] 5.5 Verify unauthenticated users see stars but cannot click (~5 min)
