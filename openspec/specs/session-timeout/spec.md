# Session Timeout Specification

## Purpose
Configurable JWT token expiration and expired token rejection for GameStore.

## Requirements

### Requirement: Configurable Token Expiration
The system SHALL support a configurable JWT expiration time via environment variable.

#### Scenario: Default expiration applied
- **WHEN** a user logs in and no `JWT_EXPIRES_IN` environment variable is set
- **THEN** the token SHALL expire after 24 hours

#### Scenario: Custom expiration applied
- **WHEN** a user logs in and `JWT_EXPIRES_IN` is set to "1h"
- **THEN** the token SHALL expire after 1 hour

### Requirement: Expired Token Rejection
The system SHALL reject requests with expired JWT tokens.

#### Scenario: Expired token rejected
- **WHEN** a request includes an expired JWT token
- **THEN** the system SHALL return a 401 status code
- **AND** the response SHALL include the error message "Token expired"

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
