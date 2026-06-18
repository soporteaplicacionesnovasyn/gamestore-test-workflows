## Context

`GET /api/products` pagination is broken because the `skip` parameter in the Prisma query is hardcoded to `0` instead of using the calculated `skip` variable. This affects all pages beyond page 1, which return identical results to page 1.

## Goals / Non-Goals

**Goals:**
- Restore correct pagination: page N returns products `(N-1)*limit + 1` through `N*limit`
- Remove the known bug documentation from the catalog spec
- Handle edge cases (page=0, NaN) gracefully without crashing

**Non-Goals:**
- Price stored as string (separate bug, out of scope)
- Price sorting lexicographically (separate bug, out of scope)
- N+1 query problem (separate bug, out of scope)
- Caching layer (separate enhancement, out of scope)

## Decisions

### Decision: Minimal one-line fix
Use the already-calculated `skip` variable instead of hardcoded `0`.

- **Alternative considered:** Rewriting pagination with validation, default clamping, and error handling
- **Rationale:** The calculation `(pageNum - 1) * limitNum` on line 16 is correct. The only defect is line 47 ignoring it. Changing one token (`0` → `skip`) has zero risk and completely resolves the bug. Validation improvements can be done as a separate change.

### Decision: No input validation in scope
Not adding guards for `page=abc` or `page=-1`.

- **Rationale:** The existing code already has no validation — `parseInt` returns `NaN` or negative values on bad input, and Prisma handles these gracefully (treats negative skip as 0). Changing validation behavior is a separate concern.

## Risks / Trade-offs

- [Edge cases unhandled] → `page=abc` produces `skip=NaN` which Prisma ignores (acts as `skip: undefined`). Existing behavior preserved, no regression.
- [SQLite skip behavior] → Negative skip values are treated as 0 by SQLite. Existing behavior preserved.
