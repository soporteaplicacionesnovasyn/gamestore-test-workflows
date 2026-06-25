# related-products Specification

## Purpose
TBD - created by archiving change test-ci-1. Update Purpose after archive.
## Requirements
### Requirement: Related Products by Category

The system SHALL provide a `GET /api/products/:id/related` endpoint that returns products from the same category, excluding the requested product.

#### Scenario: Get related products
- **WHEN** a user requests `GET /api/products/1/related`
- **THEN** up to 4 products from the same category as product 1 are returned
- **AND** product 1 is excluded from the results

#### Scenario: Not enough related products
- **WHEN** a product's category has fewer than 4 other products
- **THEN** all available products from that category are returned

#### Scenario: Product not found
- **WHEN** a user requests related products for a non-existent ID
- **THEN** the system returns a 404 error with message "Product not found"

