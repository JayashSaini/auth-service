import {
	loginSchema,
	registerSchema,
	setUserStatusSchema,
} from "../schemas/user.schemas.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../db/index.js";
import { ApiError } from "../utils/ApiError.js";
import { formatDateWithoutTimezone } from "../utils/generalUtils.js";
import { LoginTypeEnum, StatusEnum, UserRolesEnum } from "../constants.js";
import { Status, User } from "@prisma/client";
import jwt from "jsonwebtoken";

/**
 * Check user status and lock status
 * @function validateUserStatus
 * @description Handles user status and locked validation.
 */
const validateUserStatus = async (user: User) => {
	if (user.status === StatusEnum.ACTIVE) {
		return true;
	}

	// Handle Locked Account
	if (user.status === StatusEnum.LOCKED) {
		const lockedUntilDate = user.accountLockedUntil
			? new Date(user.accountLockedUntil)
			: null;

		if (!lockedUntilDate || isNaN(lockedUntilDate.getTime())) {
			throw new ApiError(400, "Invalid account lock date.");
		}

		if (lockedUntilDate <= new Date()) {
			// Unlock account after expiration
			await prisma.user.update({
				where: { id: user.id },
				data: { status: StatusEnum.ACTIVE, accountLockedUntil: null },
			});
			user.status = StatusEnum.ACTIVE;
			user.accountLockedUntil = null;
			return true;
		}

		throw new ApiError(
			403,
			`Your account is locked. Please try again after ${formatDateWithoutTimezone(
				lockedUntilDate
			)}.`
		);
	}

	// Handle Inactive Account (Reactivating)
	if (user.status === StatusEnum.INACTIVE) {
		await prisma.user.update({
			where: { id: user.id },
			data: { status: StatusEnum.ACTIVE },
		});
		user.status = StatusEnum.ACTIVE;
		return true;
	}

	// Handle Suspended or Banned Users
	if (user.status === StatusEnum.SUSPENDED) {
		throw new ApiError(
			403,
			"Your account is suspended. Contact support for assistance."
		);
	}

	if (user.status === StatusEnum.BANNED) {
		throw new ApiError(403, "Your account has been permanently banned.");
	}

	// If status is unrecognized, throw an error
	throw new ApiError(400, "Invalid user status.");
};

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

/**
 * Login a new user
 * @function loginValidator
 * @description Handles data validation of login user.
 */
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

	// Check User status and locked status
	await validateUserStatus(user);

	// 	- check is email verified
	if (!user.isEmailVerified) {
		throw new ApiError(401, "Please register again. email is not verified");
	}

	// - If all checks pass, continue to the next middleware or handler.
	req.user = user;

	next();
});

/**
 * Refresh Access token
 * @function refreshAccessTokenValidator
 * @description Handles refresh token validation of user.
 */
const refreshAccessTokenValidator = asyncHandler(async (req, _, next) => {
	// 	Validate the incoming refresh token:
	const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

	// Check if the refresh token exists and is valid.
	if (!refreshToken) {
		throw new ApiError(401, "Refresh token is missing.");
	}

	let decodedToken;

	try {
		decodedToken = jwt.verify(
			refreshToken,
			process.env.REFRESH_TOKEN_SECRET as string
		) as jwt.JwtPayload;
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError) {
			// Handle expired token
			throw new ApiError(401, "Refresh token expired. Please login again.");
		} else if (error instanceof jwt.JsonWebTokenError) {
			// Handle invalid token
			throw new ApiError(400, "Invalid refresh token. Please try again.");
		} else if (error instanceof jwt.NotBeforeError) {
			// Handle token used before its valid date
			throw new ApiError(400, "Refresh token is not yet valid.");
		} else {
			// Handle any other errors
			throw new ApiError(500, "An unexpected error occurred.");
		}
	}

	// If the refresh token is valid, retrieve the corresponding user from the database.
	// Retrieve user details from the database using the refresh token.
	const user: User | null = await prisma.user.findUnique({
		where: {
			id: decodedToken.id,
		},
	});

	// If the user does not exist, throw an error.
	if (!user) {
		throw new ApiError(404, "User not found.");
	}

	// Verify the user's status: Only allow login if the status is ACTIVE.
	await validateUserStatus(user);

	// set user to req object
	req.user = user;

	// - If all checks pass, continue to the next middleware or handler.
	next();
});

const setUserStatusValidator = asyncHandler(async (req, _, next) => {
	const { userId, status } = req.body;
	const user = req.user;

	// Validate the incoming user data (userId, status).
	setUserStatusSchema.parse({ userId, status });

	if (!user) {
		throw new ApiError(400, "Please login again.");
	}

	if (user.role !== UserRolesEnum.ADMIN) {
		throw new ApiError(
			403,
			"You do not have permission to change user status."
		);
	}

	req.user = user;

	next();
});

export {
	registerValidator,
	loginValidator,
	refreshAccessTokenValidator,
	setUserStatusValidator,
};
