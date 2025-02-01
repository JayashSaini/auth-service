# User Access Token Refresh Algorithm

## 1. Validation (Refresh Token Validator)

- **Validate the incoming refresh token**:
  - Check if the refresh token exists and is valid.
  - If the refresh token is invalid or expired, return a failure response.
- **Retrieve user details** from the database using the refresh token.
  - **Verify the user's status**: Only allow login if the status is **ACTIVE**.
  - **Check if the user account is locked**:
    - If the account is locked (`isLocked: true`), ensure to check the `accountLockedUntil` field.
    - If the lock period is still active, do not proceed and respond with the appropriate message that includes the **Locked Until** date.

## 2. Main Logic (Login Handler)

- **Generate Tokens**:
  - Create a new **access token** and **refresh token** for the user.
  - Set the **access token expiry** time to **1 hour** and the **refresh token expiry** time to **15 days**.
- **Store the refresh token** in the database:
  - Update the **refreshToken** field in the user model with the new refresh token.
  - Store the **refresh token expiry** time.
- **Update User Properties**:
  - Handle any errors during database operations (e.g., if inserting the refresh token fails).
  - If any operation fails, **rollback** any changes to maintain consistency.
  - Provide a clear response with the error message to the user.

### Example Failure Scenarios:

- If refreshing the token fails due to invalid or expired token.
- If database insertion fails when storing the new refresh token.
- If email notification fails (if relevant).

## 3. Response to Client

- If everything succeeds, respond with:
  - A **success message** confirming that the access token has been refreshed.
  - Return the newly generated **access token** and its expiry time.
  - Optionally, return the **refresh token** and its expiry time.
    """
