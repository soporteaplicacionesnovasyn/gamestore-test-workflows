## MODIFIED Requirements

### Requirement: Product Images
Users SHALL view product images correctly with a fallback for broken images.

#### Scenario: Display product image
- **WHEN** a user views a product in the catalog
- **THEN** the product image is displayed from the backend URL

#### Scenario: Broken image fallback
- **WHEN** a product image URL is not accessible
- **THEN** a fallback placeholder image is shown
- **AND** a console warning is logged

## ADDED Requirements

### Requirement: Product Loading and Error States
The products page SHALL show loading and error states appropriately.

#### Scenario: Loading state
- **WHEN** a user navigates to the products page while products are loading
- **THEN** a loading indicator SHALL be displayed

#### Scenario: Load error state
- **WHEN** the products API request fails
- **THEN** an error message SHALL be displayed in a red banner
- **AND** the loading indicator SHALL be removed
