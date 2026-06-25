# Catalog Specification

## Purpose
Product listing, filtering, and pagination for GameStore.

## Requirements

### Requirement: Product Pagination
Users SHALL browse products in pages of 10 items.

#### Scenario: First page
- **WHEN** a user requests page 1
- **THEN** products 1-10 are returned

#### Scenario: Second page
- **WHEN** a user requests page 2
- **THEN** products 11-20 are returned


### Requirement: Price Filter
Users SHALL filter products by price range using numeric comparison.

#### Scenario: Filter by price range
- **WHEN** a user applies a price filter between 10 and 30
- **THEN** products with prices numerically between 10 and 30 are shown

#### Scenario: Sort by price ascending
- **WHEN** a user selects "Price: Low to High"
- **THEN** products are ordered from lowest to highest price numerically

#### Scenario: Sort by price descending
- **WHEN** a user selects "Price: High to Low"
- **THEN** products are ordered from highest to lowest price numerically

**KNOWN BUG:** Price filter orders products alphabetically instead of numerically.

### Requirement: Product Images
Users SHALL view product images correctly with a fallback for broken images.

#### Scenario: Display product image
- **WHEN** a user views a product in the catalog
- **THEN** the product image is displayed from the backend URL

#### Scenario: Broken image fallback
- **WHEN** a product image URL is not accessible
- **THEN** a fallback placeholder image is shown
- **AND** a console warning is logged

**KNOWN BUG:** Product images use absolute local paths instead of relative or CDN URLs, causing broken images in production.

### Requirement: Product Loading and Error States
The products page SHALL show loading and error states appropriately.

#### Scenario: Loading state
- **WHEN** a user navigates to the products page while products are loading
- **THEN** a loading indicator SHALL be displayed

#### Scenario: Load error state
- **WHEN** the products API request fails
- **THEN** an error message SHALL be displayed in a red banner
- **AND** the loading indicator SHALL be removed

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
EOF