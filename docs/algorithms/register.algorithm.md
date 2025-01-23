# User Registration Algorithm

## 1. Validation (register validator):

- Validate incoming user data (email, username, password).
- Check if email or username already exists in the database:
  - If exists:
    - Check if email is verified.
    - If verified, throw an error "Email or username already exists".
    - If not verified, allow user to create a new account (send verification email).

## 2. Main Logic (register handler):

- Hash the password before saving it.
- Generate Verification Token:
  - Create a secure token for email verification.
  - Set an expiry time (e.g., 30 Min).
  - Store the token and its expiry time in the database.
- Store user data in the database (ensure everything is perfect).
- Send email verification to the user.
- If any step fails (DB insert, email sending):
  - Handle the error and stop the process.
  - Provide a clear response and rollback changes if necessary.

## 3. Response to Client:

- Inform the user to check their email for verification.
