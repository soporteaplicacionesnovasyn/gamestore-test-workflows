## ADDED Requirements

### Requirement: Validate stock before adding to cart
The system SHALL validate that the requested quantity does not exceed available stock when adding a product to the cart.

#### Scenario: Add item with sufficient stock
- **WHEN** user adds a product to cart with quantity <= product.stock
- **THEN** the item is added to the cart successfully

#### Scenario: Add item with insufficient stock
- **WHEN** user adds a product to cart with quantity > product.stock
- **THEN** the system returns 400 with `{ "error": "Insufficient stock", "productId": <id>, "available": <stock> }`

#### Scenario: Add item with zero stock
- **WHEN** user adds a product with stock = 0 to cart
- **THEN** the system returns 400 with insufficient stock error

### Requirement: Validate stock before checkout
The system SHALL validate that all items in the cart have sufficient stock before creating an order.

#### Scenario: Checkout with sufficient stock for all items
- **WHEN** user checks out and all cart items have quantity <= product.stock
- **THEN** the order is created successfully

#### Scenario: Checkout with insufficient stock for some items
- **WHEN** user checks out and one or more cart items have quantity > product.stock
- **THEN** the system returns 400 with `{ "error": "Insufficient stock", "products": [{"productId": <id>, "available": <stock>, "requested": <quantity>}] }`

#### Scenario: Checkout with item removed from catalog
- **WHEN** user checks out and a cart item references a non-existent product
- **THEN** the system returns 400 with appropriate error

### Requirement: Decrement stock after successful order
The system SHALL decrement product stock by the ordered quantity when an order is created successfully, atomically within the same transaction.

#### Scenario: Stock decremented after order
- **WHEN** user completes checkout successfully
- **THEN** each product.stock is reduced by the ordered quantity

#### Scenario: Concurrent orders decrement stock correctly
- **WHEN** two users simultaneously order the same product with combined quantity <= total stock
- **THEN** both orders succeed and final stock = initial - sum of quantities

### Requirement: Clear cart after successful checkout
The system SHALL remove all items from the user's cart after a successful order creation.

#### Scenario: Cart cleared after checkout
- **WHEN** user completes checkout successfully
- **THEN** the cart is empty and a subsequent GET /cart returns empty items array
