# Orders Specification

## Purpose
Order creation and checkout flow for GameStore.

## Requirements

### Requirement: Stock Validation on Checkout
Users SHALL only be able to purchase products that are in stock.

#### Scenario: Sufficient stock
- **WHEN** a user checks out with items that have sufficient stock
- **THEN** the order is created successfully

#### Scenario: Insufficient stock
- **WHEN** a user checks out with an item that has insufficient stock
- **THEN** an error message "Insufficient stock" is displayed
- **AND** the order is not created

**KNOWN BUG:** No stock validation is performed before creating the order — out-of-stock items can be purchased. (\orders.ts:26-27\)

### Requirement: Cart Cleanup After Order
The cart SHALL be cleared after a successful checkout.

#### Scenario: Cart cleared after checkout
- **WHEN** a user completes a successful checkout
- **THEN** the cart is emptied

**KNOWN BUG:** Cart contents persist after order creation — items are not removed on checkout. (\orders.ts:59-60\)

### Requirement: Order Confirmation
Users SHALL confirm their order before it is finalized.

#### Scenario: Confirm order
- **WHEN** a user reviews their order summary
- **AND** clicks "Confirm Purchase"
- **THEN** the order is created

**KNOWN BUG:** No confirmation step exists — the order is created immediately without user review. (\orders.ts:62-63\)

### Requirement: Order History
Users SHALL view their past orders.

#### Scenario: View order history
- **WHEN** an authenticated user navigates to their order history
- **THEN** a list of their past orders is displayed

#### Scenario: View single order details
- **WHEN** an authenticated user selects a specific order
- **THEN** the order details including items and total are displayed
