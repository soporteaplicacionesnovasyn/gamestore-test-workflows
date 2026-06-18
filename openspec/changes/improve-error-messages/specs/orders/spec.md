## MODIFIED Requirements

### Requirement: Stock Validation on Checkout
Users SHALL only be able to purchase products that are in stock. The system SHALL validate stock for all cart items before creating an order.

#### Scenario: Sufficient stock
- **WHEN** a user checks out with items that have sufficient stock
- **THEN** the order is created successfully

#### Scenario: Insufficient stock
- **WHEN** a user checks out with an item that has insufficient stock
- **THEN** the response SHALL return status 400
- **AND** the error message "Insufficient stock" is displayed
- **AND** the order is not created

## ADDED Requirements

### Requirement: Checkout Form Validation
The checkout page SHALL validate the shipping address before submission.

#### Scenario: Empty shipping address
- **WHEN** a user clicks "Place Order" with an empty shipping address
- **THEN** an inline error message "Shipping address is required" SHALL be displayed
- **AND** the order SHALL NOT be submitted

### Requirement: Checkout Error States
The checkout page SHALL display error messages inline instead of using native alerts.

#### Scenario: Checkout failure shows inline error
- **WHEN** the checkout API request fails
- **THEN** an error message SHALL be displayed in a red banner
- **AND** native `alert()` SHALL NOT be used

#### Scenario: Network error on checkout
- **WHEN** a network error occurs during checkout submission
- **THEN** an error message "Failed to place order" SHALL be displayed in a red banner
