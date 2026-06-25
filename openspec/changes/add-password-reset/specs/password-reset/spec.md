# Delta for Auth

## ADDED Requirements

### Requirement: Forgot Password Request
<!-- Allow users to request a password reset email -->

#### Scenario: Successful forgot-password request
- GIVEN a registered user with email "user@example.com"
- WHEN the user sends a POST /api/auth/forgot-password with valid email
- THEN the system returns HTTP 200
- AND a reset token is generated and stored (hashed) in the database
- AND an email with the reset link is sent to the user
- AND the token expires after 15 minutes

#### Scenario: Failed forgot-password request (non-existent email)
- GIVEN an unregistered email
- WHEN the user sends a POST /api/auth/forgot-password
- THEN the system returns HTTP 200 (to prevent enumeration)
- AND no email is sent
- AND no token is stored

#### Scenario: Rate limiting on forgot-password
- GIVEN 3 forgot-password requests for the same email in 15 minutes
- WHEN a 4th request is made
- THEN HTTP 429 (Too Many Requests) is returned

### Requirement: Password Reset
<!-- Allow users to reset their password with a valid token -->

#### Scenario: Successful password reset
- GIVEN a valid reset token
- WHEN the user sends a POST /api/auth/reset-password with token and new password "NewStr0ng!Pass"
- THEN the system returns HTTP 200
- AND the user's password is updated (hashed with bcrypt cost 12)
- AND the reset token is marked as used
- AND the user can log in with the new password

#### Scenario: Failed password reset (expired token)
- GIVEN a reset token created more than 15 minutes ago
- WHEN the user sends POST /api/auth/reset-password
- THEN HTTP 401 is returned
- AND error message "Invalid or expired token" is displayed
- AND the password is not changed

#### Scenario: Failed password reset (used token)
- GIVEN a reset token that was already used
- WHEN the user sends POST /api/auth/reset-password
- THEN HTTP 401 is returned
- AND error message "Invalid or expired token" is displayed

## Security Requirements (always include)
- Passwords MUST be hashed with bcrypt (cost factor 12)
- Reset tokens MUST expire after 15 minutes
- Reset tokens MUST be single-use
- Raw tokens MUST be hashed (SHA-256) before storage
- All auth endpoints MUST have rate limiting (3 attempts/15 min for forgot-password)
- Always return HTTP 200 for forgot-password regardless of email existence
