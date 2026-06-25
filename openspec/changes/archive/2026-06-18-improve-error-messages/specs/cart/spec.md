## MODIFIED Requirements

### Requirement: Stock Validation
Users SHALL only be able to add in-stock products to their cart. The system SHALL validate stock levels before adding items.

#### Scenario: Add in-stock item
- **WHEN** a user adds an in-stock product to the cart
- **THEN** the item is added successfully

#### Scenario: Add out-of-stock item
- **WHEN** a user attempts to add an out-of-stock product to the cart
- **THEN** the response SHALL return status 400
- **AND** the error message "Product out of stock" is displayed
- **AND** the item is not added to the cart

## ADDED Requirements

### Requirement: Cart Error States
The cart page SHALL display error messages when cart operations fail.

#### Scenario: Cart load failure
- **WHEN** the cart fails to load
- **THEN** an error message SHALL be displayed in a red banner
- **AND** the loading state SHALL be removed

#### Scenario: Cart action failure
- **WHEN** add to cart, update quantity, or remove item fails
- **THEN** an error message SHALL be displayed in a red banner
- **AND** native `alert()` SHALL NOT be used
