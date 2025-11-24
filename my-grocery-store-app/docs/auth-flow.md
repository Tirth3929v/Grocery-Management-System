# Authentication Flow

This document describes the authentication and authorization mechanisms in the Grocery Store App.

## Overview

The app uses session-based authentication with role-based access control. Users can register, login, and access features based on their role (user or admin).

## Registration Process

### Frontend
- **Component**: SignupPage
- **Form Fields**: name, email, password, address
- **Validation**: Client-side checks for required fields, email format, password strength
- **API Call**: POST /api/auth/register

### Backend
- **Route**: POST /api/auth/register
- **Validation**: Server-side checks for existing email, password requirements
- **Password Hashing**: bcrypt with salt rounds
- **User Creation**: New User document in MongoDB
- **Session Creation**: Express session with user ID
- **Response**: User data (excluding password)

## Login Process

### Frontend
- **Component**: LoginPage
- **Form Fields**: email, password
- **API Call**: POST /api/auth/login

### Backend
- **Route**: POST /api/auth/login
- **User Lookup**: Find user by email
- **Password Verification**: Compare hashed password
- **Session Creation**: If valid, create session
- **Role Check**: Determine redirect (home for users, admin for admins)
- **Response**: User data

## Session Management

### Configuration
- **Store**: Memory store (for development; use MongoDB store in production)
- **Secret**: Environment variable SESSION_SECRET
- **Options**:
  - resave: false
  - saveUninitialized: true
  - cookie: { secure: false (dev), httpOnly: true, sameSite: 'lax' }

### Persistence
- Sessions maintained via cookies
- Automatic renewal on activity
- Destroyed on logout

## Authorization

### Middleware
- Custom middleware to check session and user role
- Applied to protected routes

### Role-Based Access
- **User Role**: Access to shopping features, profile
- **Admin Role**: Access to all user features plus admin dashboard
- **Public**: Login, signup, product browsing (limited)

## Logout Process

### Frontend
- **Trigger**: Logout button in Navbar
- **API Call**: POST /api/auth/logout

### Backend
- **Route**: POST /api/auth/logout
- **Session Destruction**: Destroy current session
- **Response**: Success confirmation

### Frontend Update
- Clear loggedInUser state
- Clear cart state
- Redirect to login page

## Password Security

- **Hashing**: bcrypt with 10 salt rounds
- **No Plain Text Storage**: Passwords never stored in plain text
- **Reset Functionality**: Not implemented (future feature)

## Session Security

- **HttpOnly Cookies**: Prevent XSS access to session cookies
- **SameSite**: 'lax' to prevent CSRF
- **Secure**: true in production (HTTPS)
- **Expiration**: Default session expiration

## API Security

- **CORS**: Configured for localhost origins
- **Credentials**: 'include' for cross-origin requests
- **Input Sanitization**: Mongoose schema validation
- **Rate Limiting**: Not implemented (future feature)

## Error Handling

- **Invalid Credentials**: Generic "Invalid email or password" message
- **Session Expired**: Redirect to login
- **Unauthorized Access**: 403 Forbidden response
- **Server Errors**: 500 Internal Server Error

## Testing Authentication

### Manual Testing
1. Register new user
2. Login with credentials
3. Access protected routes
4. Logout and verify session cleared

### Automated Testing
- Unit tests for auth routes
- Integration tests for login flow
- Security audits for vulnerabilities

## Future Enhancements

- **JWT Tokens**: Alternative to sessions for API-first architecture
- **OAuth**: Social login options
- **Two-Factor Authentication**: Additional security layer
- **Password Reset**: Email-based recovery
- **Account Lockout**: Prevent brute force attacks
- **Audit Logs**: Track authentication events

## Code Examples

### Frontend Login Call
```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ email, password })
});
```

### Backend Route
```javascript
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.userId = user._id;
    res.json({ user });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});
```

For user and admin specific flows, see [User Data Flow](./user-data-flow.md) and [Admin Data Flow](./admin-data-flow.md).
