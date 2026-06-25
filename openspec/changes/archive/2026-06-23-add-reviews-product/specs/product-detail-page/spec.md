## ADDED Requirements

### Requirement: Product detail page
The application SHALL have a dedicated product detail page at `/products/:id`.

#### Scenario: View product detail
- **GIVEN** the user is browsing the product listing
- **WHEN** they click on a product card
- **THEN** the system navigates to `/products/:id` showing the product name, description, price, image, stock, category, and star rating

#### Scenario: Non-existent product
- **GIVEN** a product ID that does not exist
- **WHEN** the user navigates to `/products/99999`
- **THEN** the system shows a "Product not found" message

### Requirement: Display reviews on product detail page
The product detail page SHALL display paginated approved reviews.

#### Scenario: View reviews
- **GIVEN** a product with approved reviews
- **WHEN** the user views the product detail page
- **THEN** the system displays a list of reviews showing user name, star rating, title, body, and date, paginated at 10 per page

#### Scenario: Paginate reviews
- **GIVEN** a product with more than 10 reviews
- **WHEN** the user scrolls to the bottom of the review list
- **THEN** the system shows page navigation controls to view more reviews

### Requirement: Submit review from product detail page
Authenticated users SHALL be able to submit a review directly from the product detail page.

#### Scenario: Write review button
- **GIVEN** the user is authenticated
- **WHEN** they view the product detail page
- **THEN** the system shows a "Write Review" button

#### Scenario: Review form
- **GIVEN** the user clicked "Write Review"
- **WHEN** they fill in title, body, and star rating, then submit
- **THEN** the system posts the review and shows a success message: "Review submitted for moderation"

#### Scenario: Unauthenticated user
- **GIVEN** the user is not authenticated
- **WHEN** they view the product detail page
- **THEN** the system shows the review list but no "Write Review" button; instead a "Login to write a review" prompt

### Requirement: Product cards link to detail page
Product cards on the listing page SHALL link to the product detail page.

#### Scenario: Click product card
- **GIVEN** the user is on the products listing page
- **WHEN** they click a product card
- **THEN** the system navigates to `/products/:id` for that product
