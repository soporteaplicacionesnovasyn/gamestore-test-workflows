## MODIFIED Requirements

### Requirement: Session Persistence
Users SHALL maintain their session for the configured JWT expiration duration.

#### Scenario: Session timeout
- **WHEN** the JWT token expires
- **THEN** the session expires
- **AND** the user must log in again

## ADDED Requirements

### Requirement: Token Expiry Validation
The system SHALL validate JWT token expiry on every authenticated request.

#### Scenario: Expired token on protected route
- **WHEN** an authenticated request includes an expired JWT token
- **THEN** the system SHALL return a 401 Unauthorized response
- **AND** the user SHALL be redirected to login

## REMOVED Requirements

### Requirement: Session Persistence (original)
**Reason**: Replaced by configurable JWT expiration
**Migration**: Existing sessions will expire based on the new `JWT_EXPIRES_IN` configuration
