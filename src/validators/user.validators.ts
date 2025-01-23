import { loginSchema, registerSchema } from "../schemas/user.schemas.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../db/index.js";
import { ApiError } from "../utils/ApiError.js";
import { formatDateWithoutTimezone } from "../utils/generalUtils.js";
import { LoginTypeEnum, StatusEnum } from "../constants.js";

/**
 * Register a new user
 * @function registerValidator
 * @description Handles data validation of registration user.
 */

const registerValidator = asyncHandler(async (req, _, next) => {
	// Step 1: Validate incoming user data (email, username, password).
	const parsedData = registerSchema.parse(req.body); // Using Zod schema to validate request data

	// Step 2: Check if email or username already exists in the database
	const existingUser = await prisma.user.findFirst({
		where: {
			OR: [{ email: parsedData.email }, { username: parsedData.username }], // Checking if email or username exists
		},
	});

	// Step 3: If user exists, check the reason why
	if (existingUser) {
		// If email is verified, return error for existing email or username
		if (existingUser.isEmailVerified) {
			// Check if email already exists in the database and is verified
			if (existingUser.email === parsedData.email) {
				// If email is verified and already exists, throw an error
				throw new ApiError(
					400,
					"Email is already registered, please verify your email."
				);
			}

			// Check if the username already exists in the database
			if (existingUser.username === parsedData.username) {
				// If username is already taken, throw an error
				throw new ApiError(400, "Username is already taken.");
			}
		}
	}

	// Step 4: If no issues with email or username, move to the next middleware
	next(); // Proceed to the next middleware or handler
});

const loginValidator = asyncHandler(async (req, _, next) => {
	const { email, password } = req.body;

	// Validate the incoming user data (email, password).
	loginSchema.parse({ email, password });

	// Retrieve user details from the database. If the user exists
	const user = await prisma.user.findFirst({
		where: {
			email,
		},
	});

	// If the user does not exist, throw an error
	if (!user) {
		throw new ApiError(404, "User not found.");
	}

	// Check the login type. If the login type is **GOOGLE**, throw an error: "You can only log in via Google. Please use Google Sign-In."
	if (user.loginType === LoginTypeEnum.GOOGLE) {
		throw new ApiError(
			401,
			"You can only log in via Google. Please use Google Sign-In."
		);
	}

	// - Verify the user's status. Allow login only if the user status is **ACTIVE**.
	if (user.status !== StatusEnum.ACTIVE) {
		const message =
			user.status === StatusEnum.DELETED
				? "Your account is deleted, please."
				: "User is blocked.";
		throw new ApiError(401, "User is not active.");
	}

	// - Check if the user account is **Locked**. If locked, do not proceed and respond with the appropriate message, including the **Locked Until** property.
	if (user.isLocked) {
		const lockedUntilDate = new Date(user?.accountLockedUntil ?? "");

		// Check if lockedUntilDate is valid
		if (isNaN(lockedUntilDate.getTime())) {
			throw new ApiError(400, "Invalid account locked date.");
		}

		// Check if the lock period has expired
		if (lockedUntilDate <= new Date()) {
			// Update account lock status
			await prisma.user.update({
				where: { id: user.id },
				data: { isLocked: false, accountLockedUntil: null },
			});
			user.isLocked = false;
			user.accountLockedUntil = null;
		} else {
			throw new ApiError(
				401,
				`User account is locked. Please try again after ${formatDateWithoutTimezone(
					lockedUntilDate
				)}.`
			);
		}
	}

	// 	- check is email verified
	if (!user.isEmailVerified) {
		throw new ApiError(401, "Please register again. email is not verified");
	}

	// - If all checks pass, continue to the next middleware or handler.
	req.user = user;

	next();
});

export { registerValidator, loginValidator };
