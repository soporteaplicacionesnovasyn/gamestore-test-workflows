# Cart Specification

## Purpose
Shopping cart management for GameStore.

## Requirements

### Requirement: Add to Cart
Users SHALL add products to their shopping cart to prepare for purchase.

#### Scenario: Add new item
- **WHEN** a user clicks "Add to Cart" on a product not currently in their cart
- **THEN** the product is added to the cart with quantity 1

#### Scenario: Add existing item
- **WHEN** a user clicks "Add to Cart" on a product already in their cart
- **THEN** the quantity of that item is incremented by 1

### Requirement: Cart Persistence
Users SHALL retain cart contents across page reloads and sessions.

#### Scenario: Cart survives page reload
- **WHEN** a user adds items to their cart
- **AND** reloads the page
- **THEN** the items remain in the cart

**KNOWN BUG:** Cart contents are lost when the page is reloaded.

### Requirement: Stock Validation
Users SHALL only be able to add in-stock products to their cart.

#### Scenario: Add in-stock item
- **WHEN** a user adds an in-stock product to the cart
- **THEN** the item is added successfully

#### Scenario: Add out-of-stock item
- **WHEN** a user attempts to add an out-of-stock product to the cart
- **THEN** an error message "Product out of stock" is displayed
- **AND** the item is not added to the cart

**KNOWN BUG:** No stock validation is performed — out-of-stock items can be added to the cart.

### Requirement: Cart Total Calculation
The cart total SHALL reflect the current quantities of all items.

#### Scenario: Update item quantity
- **WHEN** a user changes the quantity of an item in the cart
- **THEN** the cart total is recalculated to reflect the new quantity

#### Scenario: Remove item
- **WHEN** a user removes an item from the cart
- **THEN** the cart total is recalculated to exclude the removed item

**KNOWN BUG:** Cart total is not recalculated when item quantities change or items are removed.
