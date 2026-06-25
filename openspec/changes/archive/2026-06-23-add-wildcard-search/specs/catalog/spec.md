## ADDED Requirements

> **Baseline:** This extends the main [Catalog Specification](../../../../specs/catalog/spec.md). All existing requirements (pagination, price filter, images, loading/error states) remain unchanged. This spec only adds text search on top of the existing catalog capabilities.

### Requirement: Text Search by Product Name

The system SHALL allow users to search products by entering a text query that matches product names using case-insensitive substring matching.

#### Scenario: Search finds matching products
- **WHEN** a user types "adv" in the search field
- **THEN** only products whose name contains "adv" (case-insensitive) are displayed, e.g. "Adventure Quest", "Advance Wars"

#### Scenario: Search with no matches
- **WHEN** a user types "zzznotfound" in the search field
- **THEN** an empty product list is displayed with a "No products found" message

#### Scenario: Search with empty query
- **WHEN** a user clears the search field
- **THEN** all products are displayed without name filtering

#### Scenario: Search combined with category filter
- **WHEN** a user searches "adventure" and selects category "Action"
- **THEN** only products whose name contains "adventure" AND belong to "Action" category are displayed

#### Scenario: Search combined with price filter
- **WHEN** a user searches "quest" and sets max price to 30
- **THEN** only products whose name contains "quest" AND have price <= 30 are displayed

#### Scenario: Search combined with sort
- **WHEN** a user searches "rpg" and selects sort by "Price: Low to High"
- **THEN** matching products are ordered from lowest to highest price

#### Scenario: Search combined with pagination
- **WHEN** a user searches "adventure" and the results span multiple pages
- **THEN** pagination works correctly showing pages of matching results

#### Scenario: Search is case-insensitive
- **WHEN** a user types "ADVENTURE" or "adventure" or "Adventure"
- **THEN** the same set of matching products is returned regardless of casing

#### Scenario: Search is debounced on the frontend
- **WHEN** a user types rapidly in the search field
- **THEN** the API is not called until 400ms after the user stops typing

#### Scenario: Server error on search
- **WHEN** the search API request fails due to a server error
- **THEN** an error message SHALL be displayed in a red banner
- **AND** the loading indicator SHALL be removed
- **AND** the previously loaded products SHALL remain visible
