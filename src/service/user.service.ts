import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { prisma } from "../db/index.js";
import { ApiError } from "../utils/ApiError.js";
import {
	ACCOUNT_LOCK_DURATION,
	MAX_LOGIN_ATTEMPTS,
	StatusEnum,
} from "../constants.js";

// Hash password using bcrypt
// This function hashes the user's password with a salt and returns the hashed password.
const hashPassword = async (password: string) => {
	const saltRounds = 10; // You can adjust the salt rounds as needed for strength.
	const hashedPassword = await bcrypt.hash(password, saltRounds);
	return hashedPassword;
};

// Compare the plain text password with the hashed password stored in the database
// This function compares the password provided by the user with the hashed version in the database.
const comparePassword = async (
	password: string,
	hashedPassword: string
): Promise<boolean> => {
	try {
		// Compare the passwords and return the result (true if they match, false otherwise)
		const isMatch = await bcrypt.compare(password, hashedPassword);
		return isMatch;
	} catch (err) {
		// Return false in case of an error, meaning password comparison failed
		return false;
	}
};

// Generate email verification token
// This function generates a JWT token for email verification with a 30-minute expiry.
const generateEmailVerificationToken = (email: string) => {
	const emailVerificationSecret: string =
		process.env.EMAIL_VERIFICATION_TOKEN_SECRET;
	const emailVerificationTokenExpiry: string =
		process.env.EMAIL_VERIFICATION_TOKEN_EXPIRY; // Token expiry in 30 minutes

	// Create the token using the email and a secret key
	const emailVerificationToken = jwt.sign({ email }, emailVerificationSecret, {
		expiresIn: "30m", // Token expiry in 30 minutes
		algorithm: "HS256",
	});

	// Set the token expiry time
	const currentDate = new Date();
	const emailVerificationExpiry = new Date(currentDate.getTime() + 30 * 60000); // Add 30 minutes

	// Return both the token and its expiry date
	return { emailVerificationToken, emailVerificationExpiry };
};

// Generate access token
// This function creates a JWT access token using user information with a 1-hour expiry.
const generateAccessToken = (payload: User) => {
	const accessTokenSecret: string = process.env.ACCESS_TOKEN_SECRET;
	const accessTokenExpiry: string = process.env.ACCESS_TOKEN_EXPIRY;

	// Throw an error if either the secret or expiry is missing
	if (!accessTokenSecret || !accessTokenExpiry) {
		throw new Error(
			"Access token secret or expiry not defined in environment variables"
		);
	}

	// Create the access token using the user's payload and secret key
	const accessToken = jwt.sign(payload, accessTokenSecret, {
		expiresIn: "1h", // Token expiry in 1 hour
		algorithm: "HS256",
	});

	// Return the generated access token
	return accessToken;
};

// Generate refresh token
// This function creates a JWT refresh token for the user with a 15-day expiry.
const generateRefreshToken = (payload: { id: number }) => {
	const refreshTokenSecret: string = process.env.REFRESH_TOKEN_SECRET;
	const refreshTokenExpiry: string = process.env.REFRESH_TOKEN_EXPIRY;

	// Throw an error if either the secret or expiry is missing
	if (!refreshTokenSecret || !refreshTokenExpiry) {
		throw new Error(
			"Refresh token secret or expiry not defined in environment variables"
		);
	}

	// Create the refresh token using the user's payload and secret key
	const refreshToken = jwt.sign(payload, refreshTokenSecret, {
		expiresIn: "15d", // Token expiry in 15 days
		algorithm: "HS256",
	});

	// Return the generated refresh token
	return refreshToken;
};

// Generate both access and refresh tokens
// This function generates both the access and refresh tokens for the user.
const generateTokens = async (
	user: User
): Promise<{
	accessToken: string;
	refreshToken: string;
}> => {
	try {
		// Generate the access and refresh tokens
		const accessToken = generateAccessToken(user);
		const refreshToken = generateRefreshToken(user);

		// Return both tokens
		return { accessToken, refreshToken };
	} catch (error) {
		// Log error if there's an issue generating the tokens
		console.log(
			"\x1b[36merror while getting tokens\x1b[0m",
			error,
			"\x1b[36muser : \x1b[0m",
			user
		);

		// Throw an error if token generation fails
		throw new ApiError(500, "Error while getting tokens");
	}
};

// Handle failed login attempts
// This function checks if the user has exceeded the max login attempts and locks the account if necessary.
const handleFailedLoginAttempts = async (user: User) => {
	// Check if failed login attempts have exceeded the max allowed
	if (user.failedLoginAttempts >= MAX_LOGIN_ATTEMPTS) {
		// Lock the account and set the account locked duration (e.g., 24 hours)
		await prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				status: StatusEnum.LOCKED,
				accountLockedUntil: new Date(
					Date.now() + 1000 * 60 * 60 * 24 * ACCOUNT_LOCK_DURATION
				),
			},
		});
		// Throw an error if the account is locked
		throw new ApiError(
			401,
			`Account is locked for ${ACCOUNT_LOCK_DURATION} days. Please reset your password.`
		);
	}

	// If the user hasn't exceeded the max attempts, increment the failed login count
	await prisma.user.update({
		where: {
			id: user.id,
		},
		data: {
			failedLoginAttempts: user.failedLoginAttempts + 1,
		},
	});

	// Throw an error for invalid password
	throw new ApiError(401, "Invalid password");
};

// Convert expiry time string to milliseconds
// This function converts the expiry time (e.g., "1h", "2d") into milliseconds.
function convertToMilliseconds(expiry: string) {
	const regex = /^(\d+)([a-zA-Z]+)$/; // Regex to match number and time unit (e.g., "1h", "30m")
	const match = expiry.match(regex);

	if (!match) {
		throw new Error("Invalid expiry format");
	}

	const value = parseInt(match[1], 10); // Numeric value (e.g., "1" from "1h")
	const unit = match[2].toLowerCase(); // Time unit (e.g., "h" for hours)

	// Convert the value based on the time unit
	switch (unit) {
		case "ms": // milliseconds
			return value;
		case "s": // seconds
			return value * 1000;
		case "m": // minutes
			return value * 1000 * 60;
		case "h": // hours
			return value * 1000 * 60 * 60;
		case "d": // days
			return value * 1000 * 60 * 60 * 24;
		case "w": // weeks
			return value * 1000 * 60 * 60 * 24 * 7;
		default:
			throw new Error("Unsupported time unit");
	}
}

export {
	hashPassword,
	generateEmailVerificationToken,
	generateAccessToken,
	generateRefreshToken,
	comparePassword,
	generateTokens,
	handleFailedLoginAttempts,
	convertToMilliseconds,
};
