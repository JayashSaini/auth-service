# User Login Algorithm

## 1. Validation (login validator):

- Validate the incoming user data (email, password).
- Retrieve user details from the database. If the user exists:
  - Check the login type. If the login type is **GOOGLE**, throw an error: "You can only log in via Google. Please use Google Sign-In."
  - Verify the user's status. Allow login only if the user status is **ACTIVE**.
  - Check if the user account is **Locked**. If locked, do not proceed and respond with the appropriate message, including the **Locked Until** property.
  - Check if the email exists in the database:
    - If the email exists:
      - Verify if the email is confirmed.
      - If confirmed, proceed to the next controller.
      - If not confirmed, throw an error: "Email is not verified."

## 2. Main Logic (login handler):

- Check if **Two-Factor Authentication** is enabled:
  - If enabled, send an email to the user.
  - If not enabled, proceed to compare the password.
- Compare the provided password with the stored password.
  - if password is correct go ahead if password is incorrect the follow these steps
  - check failed login attempt if it reach to maximum attempts throw an error and locked account
  - otherwise increase failed login attempts and throw an error Invalid password
- Generate Tokens:
  - Create a secure token for login.
  - Set the **access token** expiry time to **1 hour** and the **refresh token** expiry time to **15 days**.
  - Store the refresh token and its expiry time in the database.
- Update user properties:
  - Set **isLogin** to **true**.
  - Update **lastLogin** with the current timestamp.
- Handle failures:
  - If any step fails (e.g., database insertion or email sending), handle the error and stop the process.
  - Provide a clear response to the user and roll back any changes if necessary.

## 3. Response to Client:

- Inform the user of a successful login.
