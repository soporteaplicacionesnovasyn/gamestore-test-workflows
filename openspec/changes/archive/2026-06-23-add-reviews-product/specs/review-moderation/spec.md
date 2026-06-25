## ADDED Requirements

### Requirement: Admin review list
The admin panel SHALL display a list of all reviews with their moderation status.

#### Scenario: View all reviews
- **GIVEN** the authenticated user has role "admin"
- **WHEN** they navigate to the admin panel
- **THEN** the system shows a "Reviews" tab/section with a table listing reviews, including product name, user name, title, body, score, status, and creation date

#### Scenario: Filter by status
- **GIVEN** the admin is on the reviews section
- **WHEN** they select a status filter (pending, approved, rejected)
- **THEN** the system displays only reviews with that status

#### Scenario: Non-admin access
- **GIVEN** the authenticated user does NOT have role "admin"
- **WHEN** they access the reviews moderation endpoints
- **THEN** the system returns `403 Forbidden`

### Requirement: Approve review
Admins SHALL be able to approve pending reviews.

#### Scenario: Approve review
- **GIVEN** an admin views a pending review
- **WHEN** they click "Approve"
- **THEN** the system sets the review status to "approved" and it becomes visible on the product detail page

### Requirement: Reject review
Admins SHALL be able to reject pending reviews.

#### Scenario: Reject review
- **GIVEN** an admin views a pending review
- **WHEN** they click "Reject"
- **THEN** the system sets the review status to "rejected" and the review is not visible on the product detail page

### Requirement: Delete review
Admins SHALL be able to delete any review.

#### Scenario: Delete review
- **GIVEN** an admin views any review
- **WHEN** they click "Delete"
- **THEN** the system removes the review from the database and it no longer appears anywhere
