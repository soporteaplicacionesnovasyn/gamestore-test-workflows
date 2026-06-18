## MODIFIED Requirements

### Requirement: User Logout
Users SHALL end their session by logging out of the system.

#### Scenario: Successful logout with confirmation
- **WHEN** an authenticated user clicks the logout button
- **THEN** a confirmation dialog is shown
- **AND** upon confirming, the session is terminated
- **AND** tokens are invalidated
- **AND** the user is redirected to the login page

#### Scenario: Post-logout access
- **WHEN** a logged-out user attempts to access a protected resource
- **THEN** the system returns a 401 Unauthorized error

#### Scenario: Logout with loading state
- **WHEN** the user confirms logout
- **THEN** a loading indicator is shown during the API call
- **AND** the button is disabled to prevent double submission

#### Scenario: Logout API failure handling
- **WHEN** the logout API call fails
- **THEN** local tokens are still cleared
- **AND** the user is still redirected to login
- **AND** a non-blocking error notification is shown
