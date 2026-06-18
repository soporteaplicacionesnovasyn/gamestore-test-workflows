## ADDED Requirements

### Requirement: Consistent Error Response Format
All API error responses SHALL return a consistent JSON shape with `error` string, `status` number, and optionally `details`.

#### Scenario: Standard error response
- **WHEN** any API endpoint encounters an error
- **THEN** the response SHALL have shape `{ error: string, status: number }`
- **AND** the `error` field SHALL be a human-readable message
- **AND** the `status` field SHALL match the HTTP status code

#### Scenario: Backward compatible
- **WHEN** the frontend reads `data.error` from an error response
- **THEN** the existing property name SHALL still work

### Requirement: No Internal Error Leakage
Backend catch blocks SHALL NOT expose internal error details to the client.

#### Scenario: Catch-all returns safe message
- **WHEN** an unexpected error occurs in any route handler
- **THEN** the response SHALL return `{ error: "Internal server error", status: 500 }`
- **AND** the original error SHALL be logged to console.error for debugging

#### Scenario: Known errors return specific messages
- **WHEN** a known error condition is detected (e.g., not found, bad request)
- **THEN** a specific error message SHALL be returned with the appropriate 4xx status

### Requirement: Request Body Validation
All POST and PUT routes SHALL validate required fields exist and have expected types.

#### Scenario: Missing required field
- **WHEN** a request body is missing a required field
- **THEN** the response SHALL return status 400
- **AND** the error message SHALL indicate which field is missing

#### Scenario: Invalid field type
- **WHEN** a request body has a field with an unexpected type (e.g., string instead of number)
- **THEN** the response SHALL return status 400
- **AND** the error message SHALL indicate the expected type

### Requirement: Stock Validation on Cart Add
The cart add endpoint SHALL validate product stock before adding.

#### Scenario: Add in-stock item to cart
- **WHEN** a user adds a product with sufficient stock to the cart
- **THEN** the item SHALL be added successfully

#### Scenario: Add out-of-stock item to cart
- **WHEN** a user attempts to add a product with zero or insufficient stock to the cart
- **THEN** the response SHALL return status 400
- **AND** the error message SHALL be "Product out of stock"
- **AND** the item SHALL NOT be added to the cart

### Requirement: Stock Validation on Checkout
The checkout endpoint SHALL validate stock for all cart items before creating an order.

#### Scenario: Sufficient stock on checkout
- **WHEN** a user checks out with items that all have sufficient stock
- **THEN** the order SHALL be created successfully

#### Scenario: Insufficient stock on checkout
- **WHEN** a user checks out with an item that has insufficient stock
- **THEN** the response SHALL return status 400
- **AND** the error message SHALL be "Insufficient stock"
- **AND** the order SHALL NOT be created

### Requirement: Admin Role Enforcement
Admin routes SHALL only be accessible to users with the admin role.

#### Scenario: Admin user accesses admin route
- **WHEN** a user with role "admin" requests an admin endpoint
- **THEN** the request SHALL be processed normally

#### Scenario: Non-admin user accesses admin route
- **WHEN** a user with role "user" requests an admin endpoint
- **THEN** the response SHALL return status 403
- **AND** the error message SHALL be "Admin access required"

#### Scenario: Unauthenticated user accesses admin route
- **WHEN** no authentication token is provided for an admin endpoint
- **THEN** the response SHALL return status 401
- **AND** the error message SHALL be "No token provided"

### Requirement: Frontend Error State Display
All frontend pages SHALL display error messages inline when API operations fail.

#### Scenario: Load failure shows error
- **WHEN** a page fails to load data from the API
- **THEN** an error message SHALL be displayed in a red banner
- **AND** the user SHALL NOT see a perpetual loading state

#### Scenario: Action failure shows error
- **WHEN** a user action (add to cart, checkout, update) fails
- **THEN** an error message SHALL be displayed in a red banner
- **AND** native `alert()` SHALL NOT be used

### Requirement: Client-Side Form Validation
Login, Register, and Checkout forms SHALL validate input before submission.

#### Scenario: Invalid email format
- **WHEN** a user enters an email without "@" symbol
- **THEN** the form SHALL show an inline error "Please enter a valid email address"
- **AND** the form SHALL NOT be submitted

#### Scenario: Password too short
- **WHEN** a user enters a password shorter than 6 characters
- **THEN** the form SHALL show an inline error "Password must be at least 6 characters"
- **AND** the form SHALL NOT be submitted

#### Scenario: Missing required field
- **WHEN** a user submits the form with an empty required field
- **THEN** an inline error SHALL indicate which field is required

### Requirement: API Client Error Propagation
The frontend API client SHALL surface HTTP errors as rejected promises.

#### Scenario: Server error is rejected
- **WHEN** the server returns a 500 status code
- **THEN** the API client SHALL reject the promise with the error message from the response body

#### Scenario: Client error is rejected
- **WHEN** the server returns a 400 status code
- **THEN** the API client SHALL reject the promise with the error message from the response body

### Requirement: CartContext Error State
The CartContext SHALL expose an error state for background cart operations.

#### Scenario: Cart load failure sets error
- **WHEN** the cart fails to load from the API
- **THEN** the CartContext SHALL set an error state
- **AND** the error SHALL be accessible to consuming components

#### Scenario: Cart action failure sets error
- **WHEN** addItem, updateItem, or removeItem fails
- **THEN** the CartContext SHALL set an error state
- **AND** the error SHALL be accessible to consuming components

### Requirement: Broken Image Fallback
The product catalog SHALL display a fallback image when a product image fails to load.

#### Scenario: Broken image shows placeholder
- **WHEN** a product image URL is not accessible or fails to load
- **THEN** a fallback placeholder image SHALL be displayed
- **AND** a console warning SHALL be logged
