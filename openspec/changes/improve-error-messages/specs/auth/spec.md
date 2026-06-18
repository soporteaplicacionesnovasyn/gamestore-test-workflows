## ADDED Requirements

### Requirement: Input Validation on Registration
The registration endpoint SHALL validate email format and password strength.

#### Scenario: Valid registration
- **WHEN** a user submits the registration form with a valid email and password of 6+ characters
- **THEN** the user account SHALL be created

#### Scenario: Invalid email format
- **WHEN** a user submits the registration form with an invalid email (missing "@")
- **THEN** the response SHALL return status 400
- **AND** the error message SHALL be "Please enter a valid email address"

#### Scenario: Short password
- **WHEN** a user submits the registration form with a password shorter than 6 characters
- **THEN** the response SHALL return status 400
- **AND** the error message SHALL be "Password must be at least 6 characters"
