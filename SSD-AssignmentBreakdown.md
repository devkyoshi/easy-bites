# 👥 Member Contributions

## Member 1

### Vulnerability 1 – Hardcoded Credentials and Secrets

- Removed all hardcoded JWT secrets, admin credentials, and database credentials.

- Integrated environment variables and secure secret management.

### Vulnerability 2 – Insecure CORS Configuration

- Restricted CORS configuration to trusted domains only.

- Limited headers and methods for safer cross-origin access.

## Member 2
### Vulnerability 3 – CSRF Protection Disabled

- Enabled CSRF protection for state-changing operations.

- Implemented CSRF tokens and validated them in requests.

### Vulnerability 4 – Weak Password Requirements

- Enhanced frontend and backend validation schemas.

- Enforced strong password policy (min. 12 chars, uppercase, lowercase, digits, symbols).

## Member 3
### Vulnerability 5 – Insecure JWT Secret Management

- Replaced weak JWT secrets with cryptographically secure 256-bit keys.

- Stored JWT keys securely via environment variables.

### Vulnerability 6 – Information Disclosure in Error Handling

- Sanitized error responses in GlobalExceptionHandler.

- Replaced internal exception messages with generic error outputs.

## Member 4
### Vulnerability 7 – Missing Input Validation on Backend

- Implemented Hibernate Validator annotations (@NotNull, @Size, @Pattern).

- Added centralized validation error handling.

### OAuth/OpenID Connect Implementation

- Integrated Google OAuth 2.0 login for the frontend.

- Configured Spring Security OAuth2 client in the backend.

- Ensured JWT token issuance after successful OAuth login.