## ADDED Requirements

### Requirement: Create review
Users SHALL be able to create a text review for a product they have purchased.

#### Scenario: Successfully create review
- **GIVEN** the user is authenticated
- **WHEN** they send POST `/api/products/:id/reviews` with `{ title, body, score }` where score is 1-5
- **THEN** the system creates a Review with status "pending" and a Rating (upsert) for the score, returning `{ success: true, data: review }`

#### Scenario: Unauthenticated user
- **GIVEN** the user is not authenticated
- **WHEN** they send POST `/api/products/:id/reviews`
- **THEN** the system returns `401 Unauthorized`

#### Scenario: Non-existent product
- **GIVEN** a product that does not exist
- **WHEN** an authenticated user sends POST `/api/products/99999/reviews`
- **THEN** the system returns `404 Not Found`

#### Scenario: Invalid score
- **GIVEN** the user is authenticated
- **WHEN** they send POST `/api/products/:id/reviews` with `score: 6`
- **THEN** the system returns `400 Bad Request` with an error message

#### Scenario: Missing title or body
- **GIVEN** the user is authenticated
- **WHEN** they send POST `/api/products/:id/reviews` without a title or body
- **THEN** the system returns `400 Bad Request` with validation error

### Requirement: Read reviews for a product
Users SHALL be able to read approved reviews for a product.

#### Scenario: Get paginated reviews
- **GIVEN** a product with approved reviews
- **WHEN** the user sends GET `/api/products/:id/reviews?page=1&limit=10`
- **THEN** the system returns `{ success: true, data: { reviews, total, page, totalPages } }` with reviews ordered by newest first, including `user: { id, name }`

#### Scenario: Empty reviews
- **GIVEN** a product with no reviews
- **WHEN** the user sends GET `/api/products/:id/reviews`
- **THEN** the system returns an empty reviews array with `total: 0`

#### Scenario: Non-existent product
- **GIVEN** a product that does not exist
- **WHEN** the user sends GET `/api/products/99999/reviews`
- **THEN** the system returns `404 Not Found`

### Requirement: Update own review
Users SHALL be able to update their own reviews.

#### Scenario: Successfully update review
- **GIVEN** the user owns a review
- **WHEN** they send PUT `/api/products/:id/reviews/:reviewId` with updated `{ title, body, score }`
- **THEN** the system updates the review and returns `{ success: true, data: review }`

#### Scenario: Update another user's review
- **GIVEN** a review owned by another user
- **WHEN** the authenticated user sends PUT to that review
- **THEN** the system returns `403 Forbidden`

### Requirement: Delete own review
Users SHALL be able to delete their own reviews.

#### Scenario: Successfully delete review
- **GIVEN** the user owns a review
- **WHEN** they send DELETE `/api/products/:id/reviews/:reviewId`
- **THEN** the system deletes the review and returns `{ success: true, message: "Review deleted" }`

#### Scenario: Delete another user's review
- **GIVEN** a review owned by another user
- **WHEN** the authenticated user sends DELETE to that review
- **THEN** the system returns `403 Forbidden`
