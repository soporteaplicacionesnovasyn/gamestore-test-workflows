## ADDED Requirements

### Requirement: Full-Text Search in Catalog

The system SHALL allow users to search products by name, description, and category using a text query parameter.

#### Scenario: Search by product name
- **WHEN** a user sends `GET /api/products?search=rpg`
- **THEN** products with "rpg" in their name, description, or category are returned
- **AND** the search is case-insensitive

#### Scenario: Empty search
- **WHEN** a user sends `GET /api/products?search=`
- **THEN** all products are returned (no filter applied)

#### Scenario: No matches
- **WHEN** a user sends `GET /api/products?search=zzzznotfound`
- **THEN** an empty array is returned
