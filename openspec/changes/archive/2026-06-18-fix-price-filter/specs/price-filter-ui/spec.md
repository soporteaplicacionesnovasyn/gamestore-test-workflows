## ADDED Requirements

### Requirement: Price range input controls
The product listing page SHALL provide input fields for users to specify minimum and maximum price filters.

#### Scenario: Enter min price
- **WHEN** a user enters a minimum price of 10
- **THEN** only products with price >= 10 are displayed

#### Scenario: Enter max price
- **WHEN** a user enters a maximum price of 50
- **THEN** only products with price <= 50 are displayed

#### Scenario: Enter both min and max price
- **WHEN** a user enters minimum price 10 and maximum price 50
- **THEN** only products with price between 10 and 50 are displayed

#### Scenario: Clear price filters
- **WHEN** a user clears the price filter inputs
- **THEN** all products are displayed without price filtering
