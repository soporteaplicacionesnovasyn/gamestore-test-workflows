## Why

Add PayPal payment processing to enable an additional payment method for customers during checkout. Currently, the payment system only supports a single method, limiting payment options and potentially reducing conversion rates.

## What Changes

1. **Backend**: Add a PayPal payment service with API integration, webhook handlers, and payment verification
2. **Frontend**: Integrate PayPal SDK into the checkout form for PayPal payment option
3. **Database**: Add payment status tracking and references for PayPal transactions
4. **API**: Add new endpoint `/api/payments/paypal` to initiate and complete PayPal payments
5. **Frontend Routes**: Add PayPal payment option to the checkout flow

## Capabilities

### New Capabilities
- `paypal-payment`: Enable PayPal as an additional payment method for checkout

### Modified Capabilities
- None (this is an addition, not a modification of existing requirements)

## Impact

**Affected Components**:
- Backend: `src/services/payments.ts` (new), `src/controllers/payments.controller.ts` (modified)
- Frontend: `src/components/Checkout.tsx` (modified), `src/services/paymentService.ts` (new)
- Database: Existing payment schema updated to include PayPal transaction references
- API: New `/api/payments/paypal` endpoint added

## Riesgos

1. **Pago fallido**: Pagos fallidos debido a problemas de red o limitantes de cuenta
   *Mitigación*: Manejo robusto de errores con reintentos y notificación clara al usuario

2. **Webhook malicioso**: Aprovechamiento del webhook por actores maliciosos
   *Mitigación*: Verificación del webhook con ID de vendedor y firma de solicitud

3. **Completitud del flujo**: Fallos en la completitud del pago con PayPal
   *Mitigación*: Monitoreo del estado del pago en integrador vs backend con alertas automáticas

## Complejidad
Media

## Requires Database Migration
No

## External Dependencies
- PayPal REST SDK (Node.js)
- PayPal JavaScript SDK (Frontend)
- PayPal Webhooks (para confirmar).