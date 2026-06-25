## ADDED Requirements

### Requirement: User can rate a product

The system SHALL allow authenticated users to rate products with a score from 1 to 5 stars. Each user SHALL have at most one rating per product.

#### Scenario: Submit a rating
- **WHEN** an authenticated user clicks on the 4th star of a product
- **THEN** a rating of 4 is saved for that user and product
- **AND** the average rating and total count are updated

#### Scenario: Update existing rating
- **WHEN** an authenticated user who previously rated a product 4 stars clicks on 2 stars
- **THEN** the rating is updated from 4 to 2
- **AND** the average rating is recalculated

#### Scenario: Unauthenticated user cannot rate
- **WHEN** an unauthenticated user clicks on a star
- **THEN** the system shows a prompt to log in
- **AND** no rating is saved

#### Scenario: Invalid score rejected
- **WHEN** an authenticated user submits a score of 0 or 6
- **THEN** the system returns a 400 error with message "Score must be between 1 and 5"

#### Scenario: Rate nonexistent product
- **WHEN** an authenticated user submits a rating for a product ID that does not exist
- **THEN** the system returns a 404 error

### Requirement: Catalog shows average rating

The system SHALL display the average rating and total rating count for each product in the catalog listing.

#### Scenario: Product with ratings shows average
- **WHEN** a user views the product catalog
- **THEN** each product card displays the average rating (e.g., ⭐⭐⭐⭐ 4.2)
- **AND** the total number of ratings is shown (e.g., "(15)")

#### Scenario: Product without ratings shows zero
- **WHEN** a user views a product that has no ratings
- **THEN** the product card displays 0.0 average with 0 ratings
- **AND** all 5 stars are shown as empty (gray)
