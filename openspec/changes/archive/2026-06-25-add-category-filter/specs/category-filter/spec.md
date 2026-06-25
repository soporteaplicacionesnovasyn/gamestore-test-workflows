## ADDED Requirements

### Requirement: Dynamic Category Listing

The system SHALL provide an API endpoint that returns all distinct product categories currently stored in the database.

#### Scenario: Successful category fetch
- **WHEN** a client requests `GET /api/products/categories`
- **THEN** the response SHALL contain a JSON array of unique category strings
- **AND** the array SHALL be sorted alphabetically

#### Scenario: No categories exist
- **WHEN** the products table is empty
- **THEN** the response SHALL return an empty array

#### Scenario: Server error
- **WHEN** the database query fails
- **THEN** the response SHALL return a 500 status with an error message

### Requirement: Category Filter on Frontend

The product listing page SHALL display a category dropdown populated from the dynamic categories endpoint, and SHALL filter the product list when a category is selected.

#### Scenario: Dropdown populated from API
- **WHEN** the products page loads
- **THEN** the category dropdown SHALL be populated with categories fetched from the API
- **AND** the first option SHALL be "All Categories"

#### Scenario: Dropdown loading state
- **WHEN** categories are being fetched from the API
- **THEN** the dropdown SHALL show a "Loading categories..." option
- **AND** the dropdown SHALL be disabled

#### Scenario: Dropdown error state
- **WHEN** the category API request fails
- **THEN** the dropdown SHALL show a "Failed to load categories" message
- **AND** a disabled state SHALL be applied

#### Scenario: Filter by selected category
- **WHEN** a user selects a category from the dropdown
- **THEN** only products belonging to that category SHALL be displayed
- **AND** the page SHALL reset to page 1

#### Scenario: Clear category filter
- **WHEN** a user selects "All Categories" from the dropdown
- **THEN** all products SHALL be displayed without category filtering

#### Scenario: Category filter persists with other filters
- **WHEN** a user selects a category and also applies price or search filters
- **THEN** all active filters SHALL be applied together
