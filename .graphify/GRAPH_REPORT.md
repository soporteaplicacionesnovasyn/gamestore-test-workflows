# Graph Report - .  (2026-06-15)

## Corpus Check
- Corpus is ~10,791 words - fits in a single context window. You may not need a graph.

## Summary
- 113 nodes · 172 edges · 21 communities detected
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output
- Edge kinds: contains: 71 · imports: 44 · imports_from: 38 · references: 15 · calls: 3 · semantically_similar_to: 1

## God Nodes (most connected - your core abstractions)
1. `useAuth()` - 7 edges
2. `AuthRequest` - 6 edges
3. `authenticate()` - 6 edges
4. `api` - 6 edges
5. `useCart()` - 5 edges
6. `Fix Session Timeout (2026-06-12)` - 5 edges
7. `User` - 3 edges
8. `Product` - 3 edges
9. `Cart` - 3 edges
10. `CartItem` - 3 edges

## Surprising Connections (you probably didn't know these)
- `Fix Session Timeout (2026-06-12)` --references--> `backend/src/middleware/auth.ts`  [EXTRACTED]
  openspec/changes/archive/2026-06-12-fix-session-timeout/proposal.md → backend/src/middleware/auth.ts
- `Fix Session Timeout (2026-06-12)` --references--> `backend/src/routes/auth.ts`  [EXTRACTED]
  openspec/changes/archive/2026-06-12-fix-session-timeout/proposal.md → backend/src/routes/auth.ts
- `Fix Session Timeout (2026-06-12)` --references--> `frontend/src/services/api.ts`  [EXTRACTED]
  openspec/changes/archive/2026-06-12-fix-session-timeout/proposal.md → frontend/src/services/api.ts
- `Fix Catalog Pagination (2026-06-12)` --references--> `backend/src/routes/products.ts`  [EXTRACTED]
  openspec/changes/archive/2026-06-12-fix-catalog-pagination/proposal.md → backend/src/routes/products.ts
- `Fix Pagination (2026-06-15)` --references--> `backend/src/routes/products.ts`  [EXTRACTED]
  openspec/changes/archive/2026-06-15-fix-pagination/proposal.md → backend/src/routes/products.ts

## Hyperedges (group relationships)
- **GameStore Specifications** — auth_spec, cart_spec, catalog_spec, orders_spec, session_timeout_spec [EXTRACTED 1.00]
- **Pagination Fix Changes** — fix_catalog_pagination_20260612, fix_pagination_20260615, products_ts [INFERRED 0.90]

## Communities

### Community 0 - "Session & Token Management"
Cohesion: 0.20
Nodes (10): SessionCountdown(), SessionExpiredNotification(), authToken, clearTokens(), fetchWithAuth(), getToken(), handleUnauthorized(), refreshToken (+2 more)

### Community 1 - "Auth Middleware & Refresh"
Cohesion: 0.27
Nodes (8): generateRefreshToken(), generateToken(), verifyRefreshToken(), decoded, prisma, refreshToken, router, token

### Community 2 - "Login/Register UI"
Cohesion: 0.29
Nodes (3): useAuth(), Login(), Register()

### Community 3 - "Cart Context"
Cohesion: 0.25
Nodes (7): Cart, CartContext, CartContextType, CartItem, CartProvider(), Checkout(), api

### Community 4 - "Database Schema"
Cohesion: 0.57
Nodes (6): Cart, CartItem, Order, OrderItem, Product, User

### Community 5 - "Orders API"
Cohesion: 0.29
Nodes (5): orderItems, price, prisma, router, app

### Community 6 - "Products API"
Cohesion: 0.29
Nodes (6): limitNum, orderBy, pageNum, prisma, router, where

### Community 7 - "Auth Bug Fixes"
Cohesion: 0.33
Nodes (6): frontend/src/services/api.ts, backend/src/middleware/auth.ts, backend/src/routes/auth.ts, Auth Specification, Fix Session Timeout (2026-06-12), Session Timeout Specification

### Community 8 - "Cart UI"
Cohesion: 0.40
Nodes (3): Navbar(), useCart(), Cart()

### Community 9 - "Auth Context"
Cohesion: 0.40
Nodes (4): AuthContext, AuthContextType, AuthProvider(), User

### Community 10 - "Admin Panel"
Cohesion: 0.40
Nodes (4): Admin(), Order, Stats, User

### Community 11 - "Database Seed"
Cohesion: 0.50
Nodes (2): prisma, products

### Community 12 - "Admin API"
Cohesion: 0.50
Nodes (3): AuthRequest, prisma, router

### Community 13 - "Cart API"
Cohesion: 0.50
Nodes (3): authenticate(), prisma, router

### Community 14 - "Pagination Bug Fixes"
Cohesion: 0.83
Nodes (4): Catalog Specification, Fix Catalog Pagination (2026-06-12), Fix Pagination (2026-06-15), backend/src/routes/products.ts

### Community 15 - "Products UI"
Cohesion: 0.67
Nodes (2): Product, Products()

### Community 16 - "Cart Spec"
Cohesion: 1.00
Nodes (1): Cart Specification

### Community 17 - "Frontend Entry"
Cohesion: 1.00
Nodes (1): GameStore Frontend HTML Entrypoint

### Community 21 - "Orders Spec"
Cohesion: 1.00
Nodes (1): Orders Specification

### Community 22 - "Orders Route"
Cohesion: 1.00
Nodes (1): backend/src/routes/orders.ts

### Community 23 - "README"
Cohesion: 1.00
Nodes (1): GameStore README

## Knowledge Gaps
- **45 isolated node(s):** `prisma`, `products`, `app`, `router`, `prisma` (+40 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Database Seed`** (2 nodes): `prisma`, `products`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Products UI`** (2 nodes): `Product`, `Products()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Cart Spec`** (1 nodes): `Cart Specification`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Frontend Entry`** (1 nodes): `GameStore Frontend HTML Entrypoint`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Orders Spec`** (1 nodes): `Orders Specification`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Orders Route`** (1 nodes): `backend/src/routes/orders.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `README`** (1 nodes): `GameStore README`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AuthRequest` connect `Admin API` to `Auth Middleware & Refresh`, `Cart API`, `Orders API`, `Products API`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **Why does `authenticate()` connect `Cart API` to `Auth Middleware & Refresh`, `Admin API`, `Orders API`, `Products API`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **Why does `api` connect `Cart Context` to `Auth Context`, `Admin Panel`, `Products UI`, `Session & Token Management`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **What connects `prisma`, `products`, `app` to the rest of the system?**
  _45 weakly-connected nodes found - possible documentation gaps or missing edges._