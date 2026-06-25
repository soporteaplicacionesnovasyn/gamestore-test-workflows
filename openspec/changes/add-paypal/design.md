## Context

Add PayPal payment processing capability to the existing payment system to provide users with additional payment options during checkout. This will be added to the existing single-payment method setup.

## Goals / Non-Goals

**Goals:**
- Add PayPal as a new payment method option during checkout
- Integrate PayPal REST API for payment processing
- Implement webhook handlers for payment status updates
- Maintain PCI compliance by never storing sensitive payment data
- Add PayPal-specific error handling and retry logic

**Non-Goals:**
- Replace existing payment methods with PayPal
- Modify core payment workflow logic (only add new option)
- Build PayPal sandbox-only version (not production-ready)

## Decisions

| Decision | Alternativas | Por qué |
|----------|-------------|
| Use PayPal REST SDK Node.js | Stripe SDK, Mercado Pago SDK | Widely adopted, mature ecosystem, global recognition |
| Implement server-side payment processing | Client-side only or hybrid | Security, PCI compliance, sensitive data handling |
| Use PayPal Webhooks | Polling, state polling + callbacks | Real-time updates, efficiency |
| Add PayPal to existing payment schema | Create separate payment_methods table | Simpler integration, backward compatible |
| Store only PayPal payment reference ID | Store full payment data | PCI compliance, security best practices |

## Riesgos / Trade-offs

1. **Pago conPayPal fallido**: Fallos de red, limitantes de cuenta de usuario
   *Mitigación*: Manejo de errores robusto, reintentos, fallos de caída graciosos

2. **Completitud de webhook**: Mensajes de webhook perdidos, fallos en el procesamiento
   *Mitigación*: Sistema de reintentos, firmas de webhook verificadas, almacenamiento persistente de eventos

3. **Completitud del flujo**: Diferencias de estado entre PayPal y base de datos
   *Mitigación*: Deserialización robusta, alertas automáticas de inconsistencias, sincronización manual

4. **Explosión de rendimiento**: Alta latencia durante el checkout con alta participación
   *Mitigación*: Solicitudes asíncronas a PayPal, colas de procesamiento, caché de verificación de estatus

## Nuevo/archivo modificados

### Backend
- `src/services/paypal.service.ts` (nuevo): Servicio PayPal REST API
- `src/controllers/paypal.controller.ts` (nuevo): Controladores webhook de PayPal
- `src/routes/payments.routes.ts` (modificado): Agregar ruta `/api/payments/paypal`
- `src/middleware/webhook.middleware.ts` (nuevo): Verificación de firma de webhook de PayPal
- `src/services/payments.ts` (modificado): Agregar `processPayPalPayment` y `verifyPayPalPayment`
- `src/config/webhook.ts` (nuevo): Configuración webhook de PayPal

### Frontend
- `src/components/PayPalButton.tsx` (nuevo): Componente de botón de React de PayPal
- `src/components/Checkout.tsx` (modificado): Integrar opción de pago con PayPal
- `src/services/payment/paypal-service.ts` (nuevo): Cliente de PayPal en frontend
- `src/services/payment/payment-service.ts` (modificado): Agregar métodos de pago con PayPal

### Database
- `src/db/schema.prisma` (modificado): Agregar `payment_method` a Order model
- `prisma/seed.ts` (modificado): Agregar datos de configuración de PayPal

### Configuración/Procesos
- `.env` (nuevo): Variables de entorno `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`
- `README/payments.md` (nuevo): Documentación sobre cómo configurar PayPal
- `package.json` (modificado): Agregar dependencias `paypal-rest-sdk`, `express-webhook`
