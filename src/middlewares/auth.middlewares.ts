import { prisma } from "../db/index.js"; // Prisma client import
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { AvailableUserRoles, UserRolesEnum } from "../constants.js";
import { config } from "../config/index.js";
import { authPayload } from "../types/index.js";

/**
 * Middleware to verify JWT
 * @description This middleware will check if the JWT token is valid and if the user exists in the database.
 */
export const verifyJWT = asyncHandler(async (req, res, next) => {
	const token =
		req.cookies?.accessToken ||
		req.header("Authorization")?.replace("Bearer ", "");

	if (!token) {
		throw new ApiError(401, "Unauthorized request");
	}

	try {
		const decodedToken = jwt.verify(
			token,
			config.accessToken.secret as string
		) as jwt.JwtPayload;

		if (!decodedToken) {
			// client should make new access token and refresh token
			throw new ApiError(401, "Invalid access token");
		}
		const { id, email, role, sessionId, status } = decodedToken;

		req.user = { id, email, role, sessionId, status };
		next();
	} catch (error: unknown) {
		// Handle error explicitly by checking the type of `error`
		if (error instanceof Error) {
			// If the error is a known instance of Error, send a custom message
			throw new ApiError(401, error.message || "Invalid access token");
		} else {
			// If the error is not of type `Error`, send a generic message
			throw new ApiError(
				401,
				"An unknown error occurred during token verification"
			);
		}
	}
});

/**
 * Middleware to check logged in users for unprotected routes.
 * @description This middleware will silently fail and set `req.user` if the user is logged in, or do nothing if not.
 */
export const getLoggedInUserOrIgnore = asyncHandler(async (req, res, next) => {
	const token =
		req.cookies?.accessToken ||
		req.header("Authorization")?.replace("Bearer ", "");

	try {
		const decodedToken = jwt.verify(
			token,
			config.accessToken.secret as string
		) as jwt.JwtPayload;

		const { id, email, role, sessionId, status } = decodedToken;

		req.user = { id, email, role, sessionId, status };

		next();
	} catch (error) {
		next(); // Silent failure; req.user will be null
	}
});

/**
 * Middleware to verify user permissions based on their role.
 * @param {AvailableUserRoles[]} roles - The roles that are allowed to access the route.
 */
export const verifyPermission = (roles: typeof AvailableUserRoles = []) =>
	asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
		if (!req?.user?.id && !req.user?.role) {
			throw new ApiError(401, "Unauthorized request");
		}

		const userRole: any = req.user?.role;
		if (roles.includes(userRole)) {
			next();
		} else {
			throw new ApiError(403, "You are not allowed to perform this action");
		}
	});
