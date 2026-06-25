## ADDED Requirements

> **Baseline:** This extends the main [Catalog Specification](../../../../specs/catalog/spec.md). All existing requirements (pagination, price filter, product images, loading/error states, price range inputs) remain unchanged. This spec only adds rating data to the catalog response.

### Requirement: Product listing includes rating data

The `GET /api/products` endpoint SHALL include `averageRating` and `totalRatings` fields for each product in the response.

#### Scenario: Rating fields present in product list
- **WHEN** a user requests the product catalog
- **THEN** each product object in the response includes `averageRating` (number) and `totalRatings` (number)
- **AND** products without ratings have values of 0 for both fields

#### Scenario: Rating fields present in single product
- **WHEN** a user requests a single product by ID
- **THEN** the product object includes `averageRating` and `totalRatings`
