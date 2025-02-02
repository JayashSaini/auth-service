import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { prisma } from "../db/index.js";
import {
	hashPassword,
	generateEmailVerificationToken,
	comparePassword,
	generateTokens,
	handleFailedLoginAttempts,
	convertToMilliseconds,
} from "../service/user.service.js";
import { LoginTypeEnum, UserRolesEnum } from "../constants.js";
import { User, Status } from "@prisma/client";
import { CookieOptions } from "express";
import { verifyUserStatus } from "../schemas/user.schemas.js";
// import { sendMail } from "../service/mailgun.service.js";

/**
 * Authentication Route Handlers
 * ----------------------------------------
 * Handlers for user authentication and account management.
 *
 * Each handler corresponds to a controller function for user operations.
 *
 * @module userControllers
 */

// cookie configuration
const cookieOptions: CookieOptions = {
	maxAge: convertToMilliseconds(process.env.REFRESH_TOKEN_EXPIRY),
	httpOnly: true, // Cookie is only accessible via HTTP(S) and not client-side JavaScript
	secure: process.env.NODE_ENV === "production", // Cookie will only be sent over HTTPS if in production
	sameSite: "strict", // SameSite attribute to prevent CSRF attacks
};

/**
 * Register a new user
 * @function registerHandler
 * @description Handles user registration  creating a new user (Main Logic).
 */
const registerHandler = asyncHandler(async (req, res) => {
	const { username, email, password } = req.body;

	// Hash the password before saving it.
	const hashedPassword = await hashPassword(password);

	// Generating Verification Token:
	const { emailVerificationToken, emailVerificationExpiry } =
		generateEmailVerificationToken(email);

	// - Send email verification link to the user.
	// TODO: Firstly implement email service then use it
	// const isMailSent = await sendMail({
	// 	to: email,
	// 	subject: "Verify your email address",
	// 	text: `Please verify your email by clicking this link: http://localhost:3000/verify-email/${emailVerificationToken}`,
	// 	html: `Please verify your email by clicking this link: <a href="http://localhost:3000/verify-email/${emailVerificationToken}">http://localhost:3000/verify-email/${emailVerificationToken}</a>`,
	// });

	// - If sending email fails:
	//   - Handle the error and stop the process.
	// if (!isMailSent) {
	// 	//   - Provide a clear response and rollback changes if necessary.
	// 	throw new ApiError(
	// 		500,
	// 		"Failed to send email verification link.  Please Send it again."
	// 	);
	// }

	// - Create a new user in the database.
	// - Store user data in the database (ensure everything is perfect).
	const newUser = await prisma.user.create({
		data: {
			username,
			email,
			password: hashedPassword,
			// emailVerificationToken,
			// emailVerificationExpiry,
			isEmailVerified: true, // Set email verification status to false initially
			loginType: LoginTypeEnum.ID_PASSWORD,
		},
	});

	if (!newUser) {
		throw new ApiError(500, "Failed to register user.  Please try again.");
	}

	// - Return a success response with user data.
	return res
		.status(201)
		.json(
			new ApiResponse(
				201,
				{},
				"Your registration was successful! Please check your inbox (and spam folder) for verification"
			)
		);
});

/**
 * Login an existing user
 * @function loginHandler
 * @description Handles user login by validating credentials and generating tokens.
 */
const loginHandler = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	// Fetch the user from the database
	const user: User | null = await prisma.user.findUnique({
		where: { email },
	});

	if (!user) {
		throw new ApiError(404, "User not found");
	}

	// Compare the provided password with the stored password.
	const isPasswordValid = await comparePassword(password, user.password);

	// If password is incorrect, handle failed login attempts
	if (!isPasswordValid) {
		await handleFailedLoginAttempts(user);
		throw new ApiError(401, "Invalid credentials"); // Make it generic to avoid revealing if it's email or password
	}

	// Check if Two-Factor Authentication (2FA) is enabled
	if (user.twoFactorAuthEnabled) {
		// TODO: Send OTP for verification
		// You will need to handle OTP generation, storage, and validation separately.
		return res.status(200).json(new ApiResponse(200, "OTP sent for 2FA"));
	}

	// Proceed to generate tokens and update the user's record in the database

	const transaction = await prisma.$transaction(async (prisma) => {
		const { accessToken, refreshToken } = await generateTokens(user);

		res.cookie("accessToken", accessToken, {
			...cookieOptions,
			maxAge: convertToMilliseconds(process.env.ACCESS_TOKEN_EXPIRY),
		});

		res.cookie("refreshToken", refreshToken, cookieOptions);

		// Store the refresh token, reset failed login attempts, and update last login
		await prisma.user.update({
			where: { id: user.id },
			data: {
				refreshToken,
				failedLoginAttempts: 0, // Reset failed login attempts
				lastLogin: new Date(), // Update last login timestamp
			},
		});

		return { accessToken, refreshToken, user };
	});

	return res
		.status(200)
		.json(new ApiResponse(200, transaction, "User logged in successfully."));
});

/**
 * Refresh the user's access token
 * @function refreshAccessToken
 * @description Refreshes an expired access token using a valid refresh token.
 */
const refreshAccessTokenHandler = asyncHandler(async (req, res) => {
	// 	Generate Tokens:
	// Create a new access token and refresh token for the user.
	const user: User | undefined | null = req.user;

	if (!user) {
		throw new ApiError(404, "User not found");
	}

	// Start a transaction
	const transaction = await prisma.$transaction(async (prisma) => {
		// Create a new access token and refresh token for the user.
		const { accessToken, refreshToken } = await generateTokens(user);

		// Set the access token expiry time to 1 hour and the refresh token expiry time to 15 days.
		res.cookie("accessToken", accessToken, {
			...cookieOptions,
			maxAge: convertToMilliseconds(process.env.ACCESS_TOKEN_EXPIRY),
		});

		res.cookie("refreshToken", refreshToken, cookieOptions);

		// Store the refresh token in the database
		await prisma.user.update({
			where: { id: user.id },
			data: {
				refreshToken,
			},
		});

		// Return the tokens and user information
		return { accessToken, refreshToken, user };
	});

	// Handle any errors during database operations (e.g., if inserting the refresh token fails).
	// If any operation fails, rollback any changes to maintain consistency.

	// Provide a clear response with the error message to the user.
	res
		.status(200)
		.json(new ApiResponse(200, transaction, "Token Refreshed Successfully"));
});

/**
 * Handle forgot password requests
 * @function forgotPasswordHandler
 * @description Processes forgot password requests by sending OTP to the user.
 */
const forgotPasswordHandler = asyncHandler(async (req, res) => {});

/**
 * Verify OTP for password reset or 2FA
 * @function verifyOtpHandler
 * @description Verifies the OTP provided for password reset or two-factor authentication.
 */
const verifyOtpHandler = asyncHandler(async (req, res) => {});

/**
 * Change the user's password
 * @function changePasswordHandler
 * @description Handles password change requests after verification of current password or OTP.
 */
const changePasswordHandler = asyncHandler(async (req, res) => {});

/**
 * Delete the user's account
 * @function deleteAccountHandler
 * @description Deletes a user's account from the database after verification.
 */

const deleteAccountHandler = asyncHandler(async (req, res) => {
	// Get the user from req.user and validate it.
	const user: User | undefined | null = req.user;
	const { userId } = req.body;

	if (!user) {
		throw new ApiError(404, "User not found");
	}

	if (!userId) {
		throw new ApiError(400, "User ID is required.");
	}

	// Ensure user has permission to delete the account
	if (user.id !== userId && user.role !== UserRolesEnum.ADMIN) {
		throw new ApiError(
			403,
			"You do not have permission to delete this account."
		);
	}

	// If the account is deleted by the user, remove cookies.
	if (user.id === userId) {
		res.clearCookie("accessToken");
		res.clearCookie("refreshToken");
	}

	try {
		// Start transaction (if deleting related data)
		await prisma.$transaction(async (prisma) => {
			// TODO: Delete user's profile data from related tables if necessary.

			// Delete user from database
			await prisma.user.delete({
				where: { id: userId },
			});
		});

		// Send a delete email to the user (indicating whether deleted by the user or an admin).
		// TODO: Implement email notification system.

		// Return success response
		return res
			.status(200)
			.json(new ApiResponse(200, {}, "User account deleted successfully."));
	} catch (error) {
		throw new ApiError(500, "An error occurred while deleting the account.");
	}
});

/**
 * Assign or update the user's role
 * @function setUserRoleHandler
 * @description Assigns or updates a user's role (admin, user, etc.).
 */

// INFO: Currently we only support admin and user roles so we don't need this functionality
const setUserRoleHandler = asyncHandler(async (req, res) => {});

/**
 * Logout the user and invalidate tokens
 * @function logoutHandler
 * @description Logs the user out and invalidates their access/refresh tokens.
 */
const logoutHandler = asyncHandler(async (req, res) => {
	// Get the user from req.user and validate it.
	const user: User | undefined | null = req.user;

	if (!user) {
		throw new ApiError(404, "User not found");
	}

	// Clear the cookies to log the user out.
	res.clearCookie("accessToken");
	res.clearCookie("refreshToken");

	// Remove the refresh token from the database.
	await prisma.user.update({
		where: { id: user.id },
		data: {
			refreshToken: "",
			lastLogin: new Date(), // Update last login timestamp
		},
	});

	// Return a success response.
	return res
		.status(200)
		.json(new ApiResponse(200, {}, "User logged out successfully."));
});

/**
 * Handle Single Sign-On (SSO) via Google
 * @function ssoHandler
 * @description Handles the OAuth login flow with Google for Single Sign-On.
 */
const ssoHandler = asyncHandler(async (req, res) => {});

/**
 * Handle social sign-in callback (Google OAuth)
 * @function socialSignInCallbackHandler
 * @description Callback function after successful social sign-in through Google.
 */
const socialSignInCallbackHandler = asyncHandler(async (req, res) => {});

/**
 * Resend OTP for verification
 * @function resendOtpHandler
 * @description Resends OTP to the user for verification purposes.
 */

// TODO: implement this after messaging service
const resendOtpHandler = asyncHandler(async (req, res) => {});

/**
 * Enable or verify Two-Factor Authentication (2FA)
 * @function twoFactorAuthHandler
 * @description Enables or verifies Two-Factor Authentication (2FA) for the user.
 */
const twoFactorAuthHandler = asyncHandler(async (req, res) => {
	// Get the user from req.user and validate it.
	const user: User | undefined | null = req.user;

	if (!user) {
		throw new ApiError(404, "User not found");
	}

	// toggle two factor auth enabled
	const updatedUser = await prisma.user.update({
		where: { id: user.id },
		data: {
			twoFactorAuthEnabled: !user.twoFactorAuthEnabled,
		},
	});

	return res
		.status(200)
		.json(
			new ApiResponse(200, { user: updatedUser }, "2FA toggled successfully")
		);
});

const setUserStatusHandler = asyncHandler(async (req, res) => {
	const { userId, status } = req.body;

	const updatedUser = await prisma.user.update({
		where: { id: userId },
		data: {
			status,
		},
	});

	if (!updatedUser) {
		throw new ApiError(500, "Failed to update user status.");
	}

	return res
		.status(200)
		.json(
			new ApiResponse(
				200,
				{ user: updatedUser },
				"User status updated successfully"
			)
		);
});

const getSelfHandler = asyncHandler(async (req, res) => {
	const user = req.user;
	if (!user) {
		throw new ApiError(404, "User not found");
	}

	return res
		.status(200)
		.json(new ApiResponse(200, { user }, "User get successfully"));
});

const getAllUsersHandler = asyncHandler(async (req, res) => {
	const { page = 1, limit = 10, status = "ALL" } = req.query;
	const skip = (Number(page) - 1) * Number(limit);

	const parsedStatus = verifyUserStatus.safeParse({ status });
	if (!parsedStatus.success) {
		return res
			.status(400)
			.json(new ApiResponse(400, null, `Please provide valid status`));
	}

	// Cast the status to the correct type
	const statusEnum = status === "ALL" ? undefined : (status as Status);

	const users = await prisma.user.findMany({
		where: {
			status: statusEnum,
		},
		select: {
			id: true,
			email: true,
			username: true,
			role: true,
			status: true,
			createdAt: true,
			updatedAt: true,
			accountLockedUntil: true,
			lastLogin: true,
			isEmailVerified: true,
			loginType: true,
			twoFactorAuthEnabled: true,
		},
		skip: Number(skip),
		take: Number(limit),
		orderBy: {
			createdAt: "desc",
		},
	});

	return res
		.status(200)
		.json(new ApiResponse(200, { users }, "Users fetched successfully"));
});

export {
	registerHandler,
	loginHandler,
	refreshAccessTokenHandler,
	forgotPasswordHandler,
	verifyOtpHandler,
	changePasswordHandler,
	deleteAccountHandler,
	setUserRoleHandler,
	logoutHandler,
	ssoHandler,
	socialSignInCallbackHandler,
	resendOtpHandler,
	twoFactorAuthHandler,
	setUserStatusHandler,
	getSelfHandler,
	getAllUsersHandler,
};
