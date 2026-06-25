# Delta for Payments

## ADDED Requirements

### Requirement: PAYPAL_PAYMENT

#### Scenario: Successful payment
- GIVEN a user with items in cart
- WHEN the user completes checkout with valid PayPal credentials
- THEN the order status becomes "PAID"
- AND a confirmation email is sent
- AND the cart is cleared
- AND PayPal transaction is created with valid PayPal payment intent

#### Scenario: Failed payment
- GIVEN invalid PayPal credentials or insufficient funds
- WHEN payment is attempted
- THEN error message "Payment failed: [razon]" is shown
- AND cart remains unchanged
- AND order status is not updated
- AND PayPal payment intent status is "failed"

#### Scenario: Insufficient stock during checkout
- GIVEN a product with stock = [STOCK]
- WHEN user tries to buy more than available using PayPal
- THEN payment is rejected
- AND error message "Product out of stock" is shown
- AND PayPal payment intent is not created

#### Scenario: PayPal webhook received
- GIVEN a PayPal webhook with payment.status = "COMPLETED"
- WHEN webhook is processed
- THEN order status is updated to "PAID"
- AND cart is cleared
- AND email is sent
- AND webhook signature is verified

#### Scenario: Webhook signature verification
- GIVEN a PayPal webhook with invalid signature
- WHEN webhook is processed
- THEN error message "Invalid webhook signature" is shown
- AND order status is not updated
- AND no processing occurs

## PCI Compliance Requirements (always include)
- NEVER log PayPal access tokens (numbers, CVV, expiry)
- Use payment processor SDK (Stripe/PayPal) – never store raw card data
- Store only PayPal payment reference ID (e.g., paypal_payment_id)
- All payment requests MUST be over HTTPS
- Webhook endpoints MUST verify signatures
