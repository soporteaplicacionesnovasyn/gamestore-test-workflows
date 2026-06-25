## ADDED Requirements

### Requirement: Input Validation for Product Listing

The system SHALL validate query parameters for the product listing endpoint and return descriptive error messages for invalid inputs.

#### Scenario: Invalid page number
- **WHEN** a user sends `GET /api/products?page=-1`
- **THEN** the system returns a 400 error with message "Page must be a positive integer"

#### Scenario: Invalid limit
- **WHEN** a user sends `GET /api/products?limit=200`
- **THEN** the system returns a 400 error with message "Limit must be between 1 and 100"

#### Scenario: Invalid price range
- **WHEN** a user sends `GET /api/products?minPrice=-10`
- **THEN** the system returns a 400 error with message "minPrice must be a positive number"

#### Scenario: Valid parameters pass through
- **WHEN** a user sends `GET /api/products?page=2&limit=20&minPrice=10&maxPrice=50`
- **THEN** the request proceeds normally and returns filtered results
