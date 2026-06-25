## ADDED Requirements

### Requirement: Logout Confirmation Dialog
The system SHALL display a confirmation dialog when the user clicks the Logout button.

#### Scenario: Show confirmation on logout click
- **WHEN** an authenticated user clicks the Logout button
- **THEN** a modal dialog appears asking "Are you sure you want to log out?"
- **AND** the modal displays "Cancel" and "Logout" action buttons

#### Scenario: Cancel logout
- **WHEN** the user clicks "Cancel" in the confirmation dialog
- **THEN** the dialog closes
- **AND** the session remains active
- **AND** the user is not redirected

#### Scenario: Confirm logout
- **WHEN** the user clicks "Logout" in the confirmation dialog
- **THEN** the logout API call is made
- **AND** the dialog shows a loading state during the request
- **AND** upon success the user is redirected to `/login`

#### Scenario: Logout API failure
- **WHEN** the logout API call fails
- **THEN** an error message is displayed in the modal
- **AND** the user can retry or cancel
- **AND** local tokens are still cleared to prevent stuck state
