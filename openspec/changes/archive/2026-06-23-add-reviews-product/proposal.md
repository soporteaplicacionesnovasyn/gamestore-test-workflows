## Why

GameStore currently allows users to rate products with a numeric score (1-5 stars), but lacks a text review system. Users cannot share detailed experiences or read qualitative feedback about products. Adding written reviews improves purchase confidence, increases engagement, and provides richer product feedback. This is a core e-commerce feature that competitors offer and users expect.

## What Changes

- Add a `Review` model to the Prisma schema with title, body text, user reference, product reference, and moderation status
- Create backend CRUD endpoints for reviews (create, read, update, delete)
- Add a product detail page to display individual product info with reviews
- Display review summaries (average rating + review count) on product cards
- Add admin moderation capabilities for reviews (approve/reject)
- Allow users to edit/delete their own reviews
- Security: validate ownership for mutations, prevent XSS in review content

## Capabilities

### New Capabilities
- `product-reviews-crud`: Full CRUD API for product reviews — users can create, read, update, and delete their own reviews
- `product-detail-page`: A dedicated product detail page showing product info, star rating, and a list of reviews with pagination
- `review-moderation`: Admin panel for moderating reviews (approve, reject, delete)

### Modified Capabilities
<!-- No existing spec capabilities are changing -->

## Impact

- **Backend**: New Prisma model (`Review`), new routes/controllers for review CRUD, update product listing to include review stats, updated seed script
- **Frontend**: New product detail page, review form component, review list component, updated product cards with review count, admin review moderation UI
- **Database**: New `reviews` table with foreign keys to `User` and `Product`, migration required
- **API**: New endpoints under `/api/products/:id/reviews`
- **Dependencies**: No external dependencies required

## Riesgos

| Riesgo | Mitigación |
|--------|------------|
| Usuarios pueden publicar contenido inapropiado en reseñas | Implementar moderación por parte del admin (aprobación/rechazo) antes de mostrar reseñas públicamente |
| Alta carga si muchos usuarios reseñan el mismo producto | Paginar reseñas (20 por página) y cachear estadísticas agregadas |

## Complejidad: Alta

Requiere cambios en las 3 capas (DB, backend, frontend), nueva página, nuevo modelo de datos, flujo de moderación, y migración de base de datos.

## Migración de base de datos

Sí, requiere nueva tabla `Review` con migración de Prisma.

## Dependencias externas

Ninguna. Todo se implementa con el stack existente (Express, Prisma, React, TailwindCSS).
