## MODIFIED Requirements

### Requirement: Add to Cart
Users SHALL add products to their shopping cart to prepare for purchase.

#### Scenario: Add new item
- **WHEN** a user clicks "Add to Cart" on a product not currently in their cart
- **THEN** the product is added to the cart with quantity 1

#### Scenario: Add existing item
- **WHEN** a user clicks "Add to Cart" on a product already in their cart
- **THEN** the quantity of that item is incremented by 1
