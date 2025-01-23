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
import { LoginTypeEnum } from "../constants.js";
import { User } from "@prisma/client";
import { CookieOptions } from "express";
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
	const user: User | null = req.user ?? null;

	if (!user) {
		throw new ApiError(404, "User not found");
	}

	// 	Compare the provided password with the stored password.
	const isPasswordValid = await comparePassword(password, user.password);

	//   - if password is correct go ahead if password is incorrect the follow these steps
	if (!isPasswordValid) {
		await handleFailedLoginAttempts(user);
	}

	// Check if **Two-Factor Authentication** is enabled:
	// - If enabled, send OTP for verification.
	// TODO: When Email Service is completed send OTP for verification

	// - If not enabled, generate access and refresh tokens.

	// - Generate an access and refresh token for the user.
	const { accessToken, refreshToken } = await generateTokens(user);

	res.cookie("accessToken", accessToken, {
		...cookieOptions,
		maxAge: convertToMilliseconds(process.env.ACCESS_TOKEN_EXPIRY),
	});

	res.cookie("refreshToken", refreshToken, cookieOptions);

	// - Store the access and refresh tokens in the user's session or cookie.
	await prisma.user.update({
		where: { id: user.id },
		data: {
			refreshToken,
			failedLoginAttempts: 0, // Reset failed login attempts after successful login
			lastLogin: new Date(), // Update last login timestamp
		},
	});

	// - Return a success response with user data.
	return res.status(200).json(
		new ApiResponse(200, {
			accessToken,
			refreshToken,
			user,
		})
	);
});

/**
 * Refresh the user's access token
 * @function refreshTokenHandler
 * @description Refreshes an expired access token using a valid refresh token.
 */
const refreshTokenHandler = asyncHandler(async (req, res) => {});

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
const deleteAccountHandler = asyncHandler(async (req, res) => {});

/**
 * Assign or update the user's role
 * @function setUserRoleHandler
 * @description Assigns or updates a user's role (admin, user, etc.).
 */
const setUserRoleHandler = asyncHandler(async (req, res) => {});

/**
 * Logout the user and invalidate tokens
 * @function logoutHandler
 * @description Logs the user out and invalidates their access/refresh tokens.
 */
const logoutHandler = asyncHandler(async (req, res) => {});

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
const resendOtpHandler = asyncHandler(async (req, res) => {});

/**
 * Enable or verify Two-Factor Authentication (2FA)
 * @function twoFactorAuthHandler
 * @description Enables or verifies Two-Factor Authentication (2FA) for the user.
 */
const twoFactorAuthHandler = asyncHandler(async (req, res) => {});

export {
	registerHandler,
	loginHandler,
	refreshTokenHandler,
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
};
