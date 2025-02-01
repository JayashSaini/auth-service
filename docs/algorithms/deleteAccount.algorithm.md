# User Delete Account Algorithm

## 1. Main Logic (delete account handler):

- Only the user and admin can delete a user account.
- Get the user from req.user and validate it.
- If the account is deleted by the user, remove cookies.
- Remove the user's profile credentials from our database.
- Remove the user's auth credentials from our database.
- Send a delete email to the user (indicating whether deleted by the user or an admin).

## 2. Response to Client:

- Inform the user of a deleted account.
