# Logout Algorithm

## 1. Main Logic (logout handler):

- Get the user from req.user and validate it.
- If the user is not found, return a 404 error.
- Clear accessToken and refreshToken cookies securely.
- Remove the refresh token from the database and update lastLogin.

## 2. Response to Client:

- Inform the user that they have logged out successfully.
