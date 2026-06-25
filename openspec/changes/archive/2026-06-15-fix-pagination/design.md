## Context

`GET /api/products` pagination is broken because the Prisma query uses `skip: 0` instead of the calculated `skip` variable. The offset `skip = (page - 1) * limit` is calculated correctly at line 14 but ignored at the query site.

## Goals / Non-Goals

**Goals:**
- Page N returns products `(N-1)*limit + 1` through `N*limit`
- Zero risk — one token change

**Non-Goals:**
- Price stored as string (separate bug)
- Price sorting lexicographically (separate bug)
- N+1 query problem (separate bug)
- Input validation (separate change)

## Decisions

| Decision | Rationale |
|----------|-----------|
| Replace `skip: 0` with `skip` on the Prisma query | The variable is already calculated and correct. Changing one token (`0` → `skip`) is zero-risk and fixes the bug completely. |
| Keep existing endpoint and response shape | No API contract change. Frontend already passes `page` param correctly. |

## Risks / Trade-offs

- [Low] Edge cases (`page=abc`, `page=-1`) produce `skip=NaN` or negative values — Prisma/SQLite treats these as `skip: undefined` / 0, preserving existing behavior with no regression.
