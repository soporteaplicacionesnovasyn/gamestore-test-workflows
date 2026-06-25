# GameStore Workshop — Agent Instructions

## Project overview

E-commerce app with **intentional bugs** for an OpenSpec workshop. Two packages:
- `backend/` — Node.js + Express + TypeScript (CommonJS), SQLite via Prisma, port 3001
- `frontend/` — React 18 + Vite + TailwindCSS, port 5173, proxies `/api` → backend

No test suite, no linter, no typecheck script, no CI/CD. No Docker.

## Setup

**Backend first, then frontend (in that order):**

```bash
cd backend; npm install; npm run prisma:generate; npm run prisma:migrate; npm run prisma:seed; npm run dev
# separate terminal:
cd frontend; npm install; npm run dev
```

`prisma:seed` resets and populates 50 products + 5 users.

## Backend (backend/)

- Entrypoint: `src/index.ts` — Express app, dev server via `ts-node-dev --respawn --transpile-only`
- Routes at `/api/auth`, `/api/products`, `/api/cart`, `/api/orders`, `/api/admin`
- Price is stored as `String` in SQLite — comparisons are lexical, not numeric (intentional bug)
- Passwords stored in plain text; JWT secret hardcoded in `src/middleware/auth.ts:4`
- Prisma schema at `prisma/schema.prisma`; SQLite DB at `prisma/dev.db`

## Frontend (frontend/)

- Entrypoint: `src/main.tsx` → `App.tsx` (React Router)
- API client at `src/services/api.ts` — tokens in `localStorage`, auto-refresh on 401
- Pages: Login, Register, Products, Cart, Checkout, Admin
- Context providers: `AuthContext` + `CartContext`

## OpenSpec

- Specs at `openspec/specs/auth/spec.md` and `openspec/specs/catalog/spec.md`
- Commands: `openspec validate --specs`, `openspec list --specs`, `openspec show <name> --type spec`
- Custom OpenCode commands: `/opsx-propose`, `/opsx-apply`, `/opsx-archive`, `/opsx-explore`, `/opsx-sync`

## Test users

| Email | Password | Role |
|-------|----------|------|
| admin@gamestore.com | admin123 | admin |
| user1@test.com | pass123 | user |
| user2@test.com | pass123 | user |

## Known bugs (README + spec files are authoritative)

Code has `// FIXME:` and `// TODO:` comments marking bug locations. All 10+ intentional bugs are listed in `README.md` (auth, catalog, cart, checkout, admin).

## Graphify

`.graphify/` directory exists with cached extraction data. Use `/graphify` skill to query code relationships.
