## 1. Database

- [x] 1.1 Agregar modelo `Review` a `prisma/schema.prisma` (30m)
- [x] 1.2 Ejecutar migración Prisma: `npx prisma migrate dev --name add-reviews` (15m)
- [x] 1.3 Actualizar seed script con reviews de ejemplo (30m)

## 2. Backend — Review CRUD

- [x] 2.1 Crear `src/routes/reviews.ts` con endpoints `POST/GET/PUT/DELETE /api/products/:id/reviews` (1h)
- [x] 2.2 Implementar validación de inputs: title (1-100), body (1-2000), score (1-5) (30m)
- [x] 2.3 Implementar verificación de autenticación y ownership para mutaciones (30m)
- [x] 2.4 Montar rutas en `src/index.ts` bajo `/api/products` (15m)
- [x] 2.5 GET público: retornar solo reviews con status "approved" (30m)

## 3. Backend — Admin Moderation

- [x] 3.1 Agregar endpoints de moderación en `src/routes/admin.ts`:
      `GET /api/admin/reviews?status=pending`, `PUT /api/admin/reviews/:id/status`,
      `DELETE /api/admin/reviews/:id` (1h)
- [x] 3.2 Agregar verificación de rol admin en todos los endpoints de admin reviews (30m)

## 4. Frontend — API Client

- [x] 4.1 Agregar métodos de reviews a `src/services/api.ts`:
      `getProductReviews`, `createReview`, `updateReview`, `deleteReview`,
      `getAdminReviews`, `updateReviewStatus`, `deleteAdminReview` (30m)

## 5. Frontend — Components

- [x] 5.1 Crear `src/components/ReviewCard.tsx` para mostrar review individual (30m)
- [x] 5.2 Crear `src/components/ReviewList.tsx` con paginación (30m)
- [x] 5.3 Crear `src/components/ReviewForm.tsx` con campos title, body, star rating (45m)

## 6. Frontend — Product Detail Page

- [x] 6.1 Crear `src/pages/ProductDetail.tsx` con información del producto (1h)
- [x] 6.2 Integrar ReviewList y ReviewForm en la página de detalle (45m)
- [x] 6.3 Agregar ruta `/products/:id` en `src/App.tsx` (15m)
- [x] 6.4 Actualizar `src/pages/Products.tsx`: convertir cards en links a detalle (15m)

## 7. Frontend — Admin Moderation UI

- [x] 7.1 Agregar sección "Reviews" en `src/pages/Admin.tsx` con tabla y filtro por status (1h)
- [x] 7.2 Agregar botones Approve/Reject/Delete con confirmación (30m)

## 8. Testing

- [x] 8.1 Escribir tests para endpoints de reviews en backend (1h)
- [x] 8.2 Escribir tests para endpoints de moderación en backend (30m)
- [x] 8.3 Verificar que seed genera reviews y ratings correctamente (15m)

## 9. Verification

- [x] 9.1 Verificar build de backend: `npm run build` (10m)
- [x] 9.2 Verificar build de frontend: `npm run build` (10m)
- [x] 9.3 Probar flujo completo: crear review → aparece en admin → aprobar → visible en frontend (20m)
- [x] 9.4 Probar escenarios de error: usuario no autenticado, score inválido, editar review de otro usuario (20m)
