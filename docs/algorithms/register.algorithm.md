# Updated User Registration Algorithm

## 1. Validation (Register Validator):

- Validate incoming user data (email, username, password) using a schema (e.g., Zod).
- Check if the email or username already exists in the database:
  - If the user exists:
    - If the email is verified:
      - If the email exists, return an error: "Email is already registered and verified."
      - If the username exists, return an error: "Username is already taken."
    - If the email is **not** verified:
      - Check if the verification token is still valid:
        - If valid, return an error: "Verification email already sent. Please check your inbox."
        - If expired:
          - Generate a new verification token.
          - Send a new verification email.
          - Update the user's record with the new token and expiry time.
          - Return a response: "Verification email expired. A new verification email has been sent."
- If no issues with email or username, proceed to the next middleware.

## 2. Main Logic (Register Handler):

- Hash the password before storing it securely.
- Generate an Email Verification Token:
  - Create a secure, time-limited token (e.g., expires in 30 minutes).
  - Store the token and its expiry time in the database.
- Save the user data in the database.
- Send a verification email to the user.
- If any step fails (database insert, email sending):
  - Handle the error gracefully.
  - Roll back changes if necessary.
  - Provide a clear response to the client.

## 3. Response to Client:

- If registration is successful:
  - Inform the user: "Registration successful. Please check your email for verification."
- If any validation or system error occurs:
  - Provide an appropriate error message with clear instructions.
