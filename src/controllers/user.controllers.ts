import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { prisma } from "../db/index.js";
import {
	hashPassword,
	generateEmailVerificationToken,
	comparePassword,
	convertToMilliseconds,
	generatePasswordToken,
	generateAccessToken,
	generateRefreshToken,
} from "../service/user.service.js";
import { LoginTypeEnum, UserRolesEnum } from "../constants.js";
import { User, Status } from "@prisma/client";
import { CookieOptions } from "express";
import {
	changePasswordValidator,
	emailValidator,
	forgotPasswordValidator,
	verifyUserStatus,
} from "../schemas/user.schemas.js";
import { sessionService } from "../service/session.service.js";
import { ipBlockService } from "../service/ipBlock.service.js";
import { config } from "../config/index.js";
import { sendMail } from "../service/message.service.js";
import { authPayload } from "../types/index.js";

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
	maxAge: convertToMilliseconds(config.refreshToken.expiry),
	httpOnly: true, // Cookie is only accessible via HTTP(S) and not client-side JavaScript
	secure: config.nodeEnv === "production", // Cookie will only be sent over HTTPS if in production
	sameSite: "strict", // SameSite attribute to prevent CSRF attacks
};

/**
 * Register a new user
 * @function registerHandler
 * @description Handles user registration  creating a new user (Main Logic).
 */
const registerHandler = asyncHandler(async (req, res) => {
	const { username, email, password } = req.body;

	// Hash the password before saving it
	const hashedPassword = await hashPassword(password);

	// Generate email verification token
	const { emailVerificationToken, emailVerificationExpiry } =
		generateEmailVerificationToken();

	// Send email verification link
	const isMailSent = sendMail({
		to: email,
		subject: "Verify your email address",
		templateId: "emailVerificationTemplate",
		data: {
			username,
			emailVerificationToken,
		},
	});

	if (!isMailSent) {
		throw new ApiError(500, "Failed to send email verification link.");
	}

	// Create a new user in the database
	const newUser = await prisma.user.create({
		data: {
			username,
			email,
			password: hashedPassword,
			emailVerificationToken,
			emailVerificationExpiry,
			loginType: LoginTypeEnum.ID_PASSWORD,
		},
	});

	if (!newUser) {
		throw new ApiError(500, "Failed to register user. Please try again.");
	}

	return res
		.status(201)
		.json(
			new ApiResponse(
				201,
				{},
				"Your registration was successful! Please check your email for verification."
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
	const clientIp = req.clientIp || req.ip;

	try {
		// Check if IP is blocked
		const isBlocked = await ipBlockService.isIpBlocked(clientIp ?? "none");
		if (isBlocked) {
			throw new ApiError(
				403,
				"Your IP is temporarily blocked. Please try again later."
			);
		}

		const user = req.fullUser;
		if (!user) {
			throw new ApiError(401, "Invalid credentials");
		}

		// Verify password
		const isPasswordValid = await comparePassword(password, user.password);

		if (!isPasswordValid) {
			await ipBlockService.handleFailedLogin(user, clientIp ?? "");
			throw new ApiError(401, "Incorrect password");
		}

		// Check if Two-Factor Authentication (2FA) is enabled
		if (user.twoFactorAuthEnabled) {
			// If token is expired, generate a new one and update the user record
			const { emailVerificationToken, emailVerificationExpiry } =
				generateEmailVerificationToken();

			const isMailSent = sendMail({
				to: user.email,
				subject: "2FA Authentication Email",
				templateId: "twoFATemplate",
				data: {
					username: user.username,
					emailVerificationToken,
				},
			});

			if (!isMailSent) {
				throw new ApiError(500, "Failed to send verification email.");
			}

			// Update user record with new verification token and expiry time
			await prisma.user.update({
				where: { email: email },
				data: {
					emailVerificationToken,
					emailVerificationExpiry,
				},
			});

			return res
				.status(200)
				.json(new ApiResponse(200, {}, "Verification email has been sent."));
		}

		// Proceed to generate tokens and update the user's record in the database

		// generate refresh token
		const refreshToken = generateRefreshToken({ id: user.id });

		// Create new session
		const session = await sessionService.createSession(
			user.id,
			refreshToken,
			req
		);

		// generate access token
		const accessToken = generateAccessToken({
			id: user.id,
			email: user.email,
			status: user.status,
			role: user.role,
			sessionId: session.id,
		});

		// Store the refresh token, reset failed login attempts, and update last login
		const updatedUser = await prisma.user.update({
			where: { id: user.id },
			data: {
				failedLoginAttempts: 0, // Reset failed login attempts
				accountLockedUntil: null,
			},
		});

		res.cookie("refreshToken", refreshToken, cookieOptions);
		res.cookie("accessToken", accessToken, {
			...cookieOptions,
			maxAge: convertToMilliseconds(config.accessToken.expiry),
		});

		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					{ accessToken, refreshToken, user: updatedUser },
					"User logged in successfully."
				)
			);
	} catch (error) {
		throw error;
	}
});

/**
 * Refresh the user's access token
 * @function refreshAccessToken
 * @description Refreshes an expired access token using a valid refresh token.
 */
const refreshAccessTokenHandler = asyncHandler(async (req, res) => {
	// 	Generate Tokens:
	// Create a new access token and refresh token for the user.
	const user: User | undefined | null = req.fullUser;
	const { userSession } = req.body;

	if (!userSession) {
		throw new ApiError(400, "Invalid request body");
	}

	if (!user) {
		throw new ApiError(404, "User not found");
	}

	// Start a transaction

	// Create a new access token and refresh token for the user.
	const refreshToken = generateRefreshToken({ id: user.id });

	// Create new session
	const session = await sessionService.updateSessionPeriod(
		userSession.id,
		refreshToken
	);

	// generate access token
	const accessToken = generateAccessToken({
		id: user.id,
		email: user.email,
		status: user.status,
		role: user.role,
		sessionId: session.id,
	});

	// Set the access token expiry time to 1 hour and the refresh token expiry time to 15 days.
	res.cookie("accessToken", accessToken, {
		...cookieOptions,
		maxAge: convertToMilliseconds(config.accessToken.expiry),
	});

	res.cookie("refreshToken", refreshToken, cookieOptions);

	// Handle any errors during database operations (e.g., if inserting the refresh token fails).

	// Provide a clear response with the error message to the user.
	res
		.status(200)
		.json(
			new ApiResponse(
				200,
				{ accessToken, refreshToken, user },
				"Token Refreshed Successfully"
			)
		);
});

/**
 * Verify email after user's registration
 * @function verifyEmailHandler
 * @description Verify email after user's registration.
 */
const verifyEmailHandler = asyncHandler(async (req, res) => {
	const { token } = req.params;

	if (!token) {
		throw new ApiError(400, "Email verification token is missing");
	}

	// Find user by token & check if not expired
	const user = await prisma.user.findFirst({
		where: {
			emailVerificationToken: token,
			emailVerificationExpiry: { gte: new Date() }, // Fix: Use `new Date()`
		},
	});

	if (!user) {
		throw new ApiError(400, "Invalid or expired token");
	}

	// Update user to mark as verified & remove token
	await prisma.user.update({
		where: { id: user.id },
		data: {
			isEmailVerified: true,
			emailVerificationToken: null,
			emailVerificationExpiry: null,
		},
	});

	return res
		.status(200)
		.json(new ApiResponse(200, {}, "User verified successfully!"));
});

const verify2FAHandler = asyncHandler(async (req, res) => {
	const { token } = req.params;

	if (!token) {
		throw new ApiError(400, "Email verification token is missing");
	}

	// Find user by token & check if not expired
	const user = await prisma.user.findFirst({
		where: {
			emailVerificationToken: token,
			emailVerificationExpiry: { gte: new Date() }, // Fix: Use `new Date()`
		},
	});

	if (!user) {
		throw new ApiError(400, "Invalid or expired token");
	}

	const refreshToken = generateRefreshToken({ id: user.id });

	// Create new session
	const session = await sessionService.createSession(
		user.id,
		refreshToken,
		req
	);

	// generate access token
	const accessToken = generateAccessToken({
		id: user.id,
		email: user.email,
		status: user.status,
		role: user.role,
		sessionId: session.id,
	});

	// Store the refresh token, reset failed login attempts, and update last login
	const updatedUser = await prisma.user.update({
		where: { id: user.id },
		data: {
			failedLoginAttempts: 0, // Reset failed login attempt
			accountLockedUntil: null,
			emailVerificationToken: null,
			emailVerificationExpiry: null,
		},
	});

	res.cookie("refreshToken", refreshToken, cookieOptions);
	res.cookie("accessToken", accessToken, {
		...cookieOptions,
		maxAge: convertToMilliseconds(config.accessToken.expiry),
	});

	return res
		.status(200)
		.json(
			new ApiResponse(
				200,
				{ accessToken, refreshToken, user: updatedUser },
				"User logged in successfully."
			)
		);
});

/**
 * Handle forgot password requests
 * @function forgotPasswordHandler
 * @description Processes forgot password requests by sending OTP to the user.
 */
const forgotPasswordHandler = asyncHandler(async (req, res) => {
	const { newPassword, confirmPassword } = req.body;
	const { token } = req.params;

	if (!token) {
		throw new ApiError(400, "Password request token is required.");
	}

	forgotPasswordValidator.parse({ newPassword, confirmPassword });

	if (newPassword !== confirmPassword) {
		throw new ApiError(400, "New password and confirm password do not match.");
	}

	// Find user by token & check if not expired
	const user = await prisma.user.findFirst({
		where: {
			resetPasswordToken: token,
			resetPasswordExpiry: { gte: new Date() },
		},
	});

	if (!user) {
		throw new ApiError(400, "Password request is failed or expired");
	}

	// Hash the password before saving it
	const hashedPassword = await hashPassword(newPassword);

	const updatedUser = await prisma.user.update({
		where: {
			id: user.id,
		},
		data: {
			password: hashedPassword,
			resetPasswordExpiry: null,
			resetPasswordToken: null,
		},
	});

	return res
		.status(200)
		.json(
			new ApiResponse(200, { user: updatedUser }, "Password reset successfully")
		);
});

/**
 * request for forgot password
 * @function forgotPasswordRequestHandler
 * @description it's send a mail for forgot password.
 */
const forgotPasswordRequestHandler = asyncHandler(async (req, res) => {
	const { email } = req.body;

	// email validator
	emailValidator.parse({ email });

	const user = await prisma.user.findFirst({ where: { email } });

	if (!user) {
		throw new ApiError(404, "User not found.");
	}

	const { passwordToken, passwordExpiry } = generatePasswordToken();

	const isMailSent = sendMail({
		to: user.email,
		subject: "Forgot Password Request",
		templateId: "forgotPasswordTemplate",
		data: {
			username: user.username,
			passwordToken,
		},
	});

	if (!isMailSent) {
		throw new ApiError(500, "Failed to send verification email.");
	}

	// Update user record with new verification token and expiry time
	await prisma.user.update({
		where: { email: user.email },
		data: {
			resetPasswordExpiry: passwordExpiry,
			resetPasswordToken: passwordToken,
		},
	});

	return res
		.status(200)
		.json(
			new ApiResponse(200, {}, "Forgot password request has been sent to mail.")
		);
});

/**
 * Change the user's password
 * @function changePasswordHandler
 * @description Handles password change requests after verification of current password or OTP.
 */
const changePasswordHandler = asyncHandler(async (req, res) => {
	const { newPassword, oldPassword } = req.body;
	const { token } = req.params;

	changePasswordValidator.parse({ newPassword, oldPassword });

	if (!token) {
		throw new ApiError(400, "Password request token is required.");
	}

	// Find user by token & check if not expired
	const user = await prisma.user.findFirst({
		where: {
			resetPasswordToken: token,
			resetPasswordExpiry: { gte: new Date() },
		},
	});

	if (!user) {
		throw new ApiError(400, "Password request is failed or expired");
	}

	const isPasswordValid = comparePassword(oldPassword, user?.password);

	if (!isPasswordValid) {
		throw new ApiError(400, "Old password is incorrect");
	}

	// Hash the password before saving it
	const hashedPassword = await hashPassword(newPassword);

	const updatedUser = await prisma.user.update({
		where: {
			id: user.id,
		},
		data: {
			password: hashedPassword,
			resetPasswordExpiry: null,
			resetPasswordToken: null,
		},
	});

	return res
		.status(200)
		.json(
			new ApiResponse(
				200,
				{ user: updatedUser },
				"Password updated successfully"
			)
		);
});

/**
 * Request for change the user's password
 * @function changePasswordRequestHandler
 * @description Send a email with token to verify user.
 */
const changePasswordRequestHandler = asyncHandler(async (req, res) => {
	const authUser = req.user;

	const user = await prisma.user.findUnique({
		where: {
			id: authUser?.id,
		},
	});
	if (!user) {
		throw new ApiError(404, "User not found");
	}

	const { passwordToken, passwordExpiry } = generatePasswordToken();

	const isMailSent = sendMail({
		to: user.email,
		subject: "Change Password Request",
		templateId: "changePasswordTemplate",
		data: {
			username: user.username,
			passwordToken,
		},
	});

	if (!isMailSent) {
		throw new ApiError(500, "Failed to send verification email.");
	}

	// Update user record with new verification token and expiry time
	await prisma.user.update({
		where: { email: user.email },
		data: {
			resetPasswordExpiry: passwordExpiry,
			resetPasswordToken: passwordToken,
		},
	});

	return res
		.status(200)
		.json(
			new ApiResponse(
				200,
				{},
				"Change password request has been sent to  mail."
			)
		);
});

/**
 * Delete the user's account
 * @function deleteAccountHandler
 * @description Deletes a user's account from the database after verification.
 */

const deleteAccountHandler = asyncHandler(async (req, res) => {
	// Get the user from req.user and validate it.
	const user: authPayload | undefined | null = req.user;
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
	const user = req.user;

	if (!user) {
		throw new ApiError(404, "User not found");
	}

	// Invalidate current session and clear cookies in a transaction

	await sessionService.invalidateSession(user.sessionId);

	// Clear cookies and remove refresh token
	res.clearCookie("accessToken");
	res.clearCookie("refreshToken");

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
 * Resend Email for verification
 * @function resendVerifyEmailHandler
 * @description Resends Email to the user for verification purposes.
 */

const resendVerifyEmailHandler = asyncHandler(async (req, res) => {
	const { email } = req.body;

	emailValidator.parse({ email });

	const user = await prisma.user.findUnique({
		where: { email },
	});

	if (!user) {
		throw new ApiError(404, "User not found.");
	}

	if (user.isEmailVerified) {
		throw new ApiError(400, "Email is already verified.");
	}

	// Generate email verification token
	const { emailVerificationToken, emailVerificationExpiry } =
		generateEmailVerificationToken();

	// Send email verification link
	const isMailSent = sendMail({
		to: email,
		subject: "Verify your email address",
		templateId: "emailVerificationTemplate",
		data: {
			username: user.username,
			emailVerificationToken,
		},
	});

	if (!isMailSent) {
		throw new ApiError(500, "Failed to send email verification link.");
	}

	// Create a new user in the database
	await prisma.user.update({
		where: { id: user.id },
		data: {
			emailVerificationToken,
			emailVerificationExpiry,
		},
	});

	return res
		.status(200)
		.json(new ApiResponse(200, {}, "Verification email resent successfully."));
});

/**
 * Enable or verify Two-Factor Authentication (2FA)
 * @function twoFactorAuthHandler
 * @description Enables or verifies Two-Factor Authentication (2FA) for the user.
 */
const twoFactorAuthHandler = asyncHandler(async (req, res) => {
	// Get the user from req.user and validate it.
	const authUser: authPayload | undefined | null = req.user;

	const user = await prisma.user.findUnique({
		where: { id: authUser?.id },
	});

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
	const authUser: authPayload | null | undefined = req.user;

	const user = await prisma.user.findUnique({
		where: {
			id: authUser?.id,
		},
		select: {
			id: true,
			email: true,
			username: true,
			isEmailVerified: true,
			createdAt: true,
			role: true,
			twoFactorAuthEnabled: true,
			status: true,
			updatedAt: true,
		},
	});

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
			isEmailVerified: true,
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
	forgotPasswordRequestHandler,
	changePasswordHandler,
	deleteAccountHandler,
	setUserRoleHandler,
	logoutHandler,
	verifyEmailHandler,
	verify2FAHandler,
	changePasswordRequestHandler,
	ssoHandler,
	socialSignInCallbackHandler,
	resendVerifyEmailHandler,
	twoFactorAuthHandler,
	setUserStatusHandler,
	getSelfHandler,
	getAllUsersHandler,
};
