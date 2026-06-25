## Context

GameStore currently has a `Rating` model (numeric score 1-5 per user per product) with two endpoints (`POST /:id/rate`, `GET /:id/ratings`) and a `StarRating` component used on the product listing page. There is no text-based review system, no product detail page, and no review moderation. The `getRatings` API method exists on the frontend but is unused.

This design introduces a full product review system with text content, a dedicated product detail page, and admin moderation.

## Goals / Non-Goals

**Goals:**
- Add a `Review` model to Prisma (title, body, user, product, moderation status, timestamps)
- Backend CRUD API for reviews (`POST/GET/PUT/DELETE /api/products/:id/reviews`)
- Product detail page showing product info, star rating, and paginated review list
- Review form for authenticated users (title + body + star rating)
- Admin review moderation panel (approve, reject, delete)
- Seed script generates sample reviews for development

**Non-Goals:**
- No review images/attachments
- No review voting (helpful/unhelpful)
- No review replies from sellers
- No spam detection (beyond admin moderation)

## Architecture Decisions

| Decisión | Alternativas | Por qué |
|----------|-------------|---------|
| Nuevo modelo `Review` separado de `Rating` | Extender `Rating` con campos de texto | `Rating` tiene constraint `@@unique([userId, productId])` (1 por usuario/producto). Las reviews deben permitir múltiples por usuario/producto (usuario puede actualizar su review, pero la constraint única no aplica). Separar mantiene responsabilidades claras y evita romper endpoints existentes. |
| `Review` anidada bajo `/api/products/:id/reviews` | Ruta plana `/api/reviews` | Consistente con la estructura existente de `ratings.ts` que usa `/api/products/:id/rate` y `/api/products/:id/ratings`. Sigue el patrón REST de recursos anidados y permite verificación natural del producto. |
| Moderación con campo `status` (pending/approved/rejected) | Moderación automática con filtros de palabras clave | La moderación manual da control total al admin sobre contenido inapropiado. Simple de implementar y suficiente para el volumen esperado. Se puede agregar filtrado automático después. |
| Reviews aprobadas por defecto se muestran públicamente | Solo mostrar reviews aprobadas | Las reviews pendientes/rechazadas no deben ser visibles para otros usuarios. El creador de la review siempre puede ver sus propias reviews independientemente del estado. |
| Product detail page en `/products/:id` | Modal en la página de listado | Una página dedicada permite mostrar información completa del producto, reseñas paginadas, y estadísticas de rating sin saturar la UI. Sigue el patrón de e-commerce estándar. |
| Paginación de reviews (10 por página) | Carga infinita (scroll) | Paginación clásica es más simple de implementar y predecible para el usuario. Consistente con la paginación existente de productos. |
| Prisma `Review` model con `updatedAt` | Solo `createdAt` | Permite saber cuándo un usuario editó su review. Útil para auditoría y moderación. |

## Review Creation Flow

```
User clicks "Write Review" on product detail page
         │
         ▼
    Show review form (title + body + star rating)
         │
         ▼
    POST /api/products/:id/reviews
         │
         ├── Validate: authenticated? → 401 if no
         ├── Validate: product exists? → 404 if no
         ├── Validate: title (1-100 chars), body (1-2000 chars), score (1-5)
         ├── Create Rating (upsert) for the score
         └── Create Review (status: "pending")
                  │
                  ▼
          Return { success, data: review }
                  │
                  ▼
         UI shows: "Review submitted for moderation"
```

## Admin Moderation Flow

```
Admin navigates to Admin Panel → Reviews tab
         │
         ▼
    GET /api/admin/reviews?status=pending
         │
         ▼
    List of pending reviews with product, user, content
         │
         │  ┌── Approve → PUT /api/admin/reviews/:id/status { status: "approved" }
         │  ├── Reject  → PUT /api/admin/reviews/:id/status { status: "rejected" }
         │  └── Delete  → DELETE /api/admin/reviews/:id
         │
         ▼
    UI refreshes list (removed from pending queue)
```

## Files to Create

### Backend
- `backend/src/routes/reviews.ts` — Review CRUD endpoints

### Frontend
- `frontend/src/pages/ProductDetail.tsx` — Product detail page with reviews
- `frontend/src/components/ReviewForm.tsx` — Form for creating/editing reviews
- `frontend/src/components/ReviewList.tsx` — Paginated review list component
- `frontend/src/components/ReviewCard.tsx` — Individual review display card

## Files to Modify

### Backend
- `backend/prisma/schema.prisma` — Add `Review` model
- `backend/src/index.ts` — Mount review routes
- `backend/prisma/seed.ts` — Add sample reviews

### Frontend
- `frontend/src/services/api.ts` — Add review API methods
- `frontend/src/App.tsx` — Add product detail route
- `frontend/src/pages/Admin.tsx` — Add review moderation tab
- `frontend/src/pages/Products.tsx` — Link product cards to detail page

## Security Considerations

- **Authentication**: All mutation endpoints require JWT authentication via existing `authenticate` middleware
- **Ownership**: Users can only edit/delete their own reviews. Server validates `userId` matches `req.userId`
- **Admin authorization**: Moderation endpoints require admin role check (`req.userRole === 'admin'`). Bug: current admin routes skip role check — this must be enforced.
- **XSS prevention**: Review content rendered as text (not HTML). React's default escaping handles this.
- **Input validation**: Validate title (1-100 chars), body (1-2000 chars), score (1-5 integer) server-side
- **SQL injection**: Prevented by Prisma's parameterized queries

## Performance Considerations

- Reviews paginated at 10 per page to limit payload size
- Product detail page fetches product + review stats + reviews page in parallel
- Review count and average rating included in product listing response (reuse existing aggregation pattern)
- No N+1 queries — bulk fetch reviews with `include: { user: { select: { id, name } } }`
