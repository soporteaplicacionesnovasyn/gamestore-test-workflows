## 1. Fix pagination offset

- [x] 1.1 Change `skip: 0` to `skip` in `backend/src/routes/products.ts:47`

## 2. Update specs

- [x] 2.1 Remove `KNOWN BUG` note from `openspec/specs/catalog/spec.md` pagination requirement

## 3. Verify

- [x] 3.1 Start backend and test `curl "http://localhost:3001/api/products?page=1&limit=10"` returns products 1-10
- [x] 3.2 Test `curl "http://localhost:3001/api/products?page=2&limit=10"` returns products 11-20 (different from page 1)
- [x] 3.3 Test edge case `page=0` and `page=abc` do not crash the server
