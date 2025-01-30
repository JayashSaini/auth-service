import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { prisma } from "../db/index.js";
import { ApiError } from "../utils/ApiError.js";
import { ACCOUNT_LOCK_DURATION, MAX_LOGIN_ATTEMPTS } from "../constants.js";
// Hash password with bcrypt
const hashPassword = async (password: string) => {
	const saltRounds = 10; // You can adjust the salt rounds as needed
	const hashedPassword = await bcrypt.hash(password, saltRounds);
	return hashedPassword;
};

const comparePassword = async (
	password: string,
	hashedPassword: string
): Promise<boolean> => {
	try {
		const isMatch = await bcrypt.compare(password, hashedPassword);
		return isMatch;
	} catch (err) {
		return false; // In case of error, return false
	}
};

const generateEmailVerificationToken = (email: string) => {
	// - Generate a unique verification token (e.g., UUID).
	const emailVerificationSecret: string =
		process.env.EMAIL_VERIFICATION_TOKEN_SECRET;
	const emailVerificationTokenExpiry: string =
		process.env.EMAIL_VERIFICATION_TOKEN_EXPIRY; // Token expiry in 30 minutes

	const emailVerificationToken = jwt.sign({ email }, emailVerificationSecret, {
		// - Set an expiry time (e.g., 30 Min).
		expiresIn: emailVerificationTokenExpiry, // Token expiry in 30 minutes
	});

	// - Set an expiry time (e.g., 30 minutes).
	const currentDate = new Date();
	const emailVerificationExpiry = new Date(currentDate.getTime() + 30 * 60000); // Add minutes

	// - Return the token to the user.
	return { emailVerificationToken, emailVerificationExpiry }; // Return the generated token
};

const generateAccessToken = (payload: User) => {
	const accessTokenSecret: string = process.env.ACCESS_TOKEN_SECRET;
	const accessTokenExpiry: string = process.env.ACCESS_TOKEN_EXPIRY;

	if (!accessTokenSecret || !accessTokenExpiry) {
		throw new Error(
			"Access token secret or expiry not defined in environment variables"
		);
	}

	const accessToken = jwt.sign(payload, accessTokenSecret, {
		expiresIn: accessTokenExpiry,
	});

	return accessToken;
};

const generateRefreshToken = (payload: { id: number }) => {
	const refreshTokenSecret: string = process.env.REFRESH_TOKEN_SECRET;
	const refreshTokenExpiry: string = process.env.REFRESH_TOKEN_EXPIRY;

	if (!refreshTokenSecret || !refreshTokenExpiry) {
		throw new Error(
			"Refresh token secret or expiry not defined in environment variables"
		);
	}

	const refreshToken = jwt.sign(payload, refreshTokenSecret, {
		expiresIn: refreshTokenExpiry,
	});

	return refreshToken;
};

const generateTokens = async (
	user: User
): Promise<{
	accessToken: string;
	refreshToken: string;
}> => {
	try {
		const accessToken = generateAccessToken(user);
		const refreshToken = generateRefreshToken(user);

		return { accessToken, refreshToken };
	} catch (error) {
		console.log(
			"\x1b[36merror while getting tokens\x1b[0m",
			error,
			"\x1b[36muser : \x1b[0m",
			user
		);

		throw new ApiError(500, "error while getting tokens");
	}
};

const handleFailedLoginAttempts = async (user: User) => {
	//   - check failed login attempt if it reach to maximum attempts throw an error and locked account
	if (user.failedLoginAttempts >= MAX_LOGIN_ATTEMPTS) {
		await prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				isLocked: true,
				accountLockedUntil: new Date(
					Date.now() + 1000 * 60 * 60 * 24 * ACCOUNT_LOCK_DURATION
				),
			},
		});
		throw new ApiError(
			401,
			`Account is locked for ${ACCOUNT_LOCK_DURATION}. Please reset your password.`
		);
	}
	//   - otherwise increase failed login attempts and throw an error Invalid password
	await prisma.user.update({
		where: {
			id: user.id,
		},
		data: {
			failedLoginAttempts: user.failedLoginAttempts + 1,
		},
	});

	throw new ApiError(401, "Invalid password");
};

function convertToMilliseconds(expiry: string) {
	const regex = /^(\d+)([a-zA-Z]+)$/;
	const match = expiry.match(regex);

	if (!match) {
		throw new Error("Invalid expiry format");
	}

	const value = parseInt(match[1], 10); // Numeric value
	const unit = match[2].toLowerCase(); // Unit (e.g., 'h', 'd')

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
