import { prisma } from "../db/index.js"; // Prisma client import
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client"; // Prisma User type
import { NextFunction, Request, Response } from "express";
import { AvailableUserRoles } from "../constants";

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
			process.env.ACCESS_TOKEN_SECRET as string
		) as jwt.JwtPayload;
		const user: User | null = await prisma.user.findUnique({
			where: { id: decodedToken?.id },
		});

		if (!user) {
			// client should make new access token and refresh token
			throw new ApiError(401, "Invalid access token");
		}

		req.user = user;
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
			process.env.ACCESS_TOKEN_SECRET as string
		) as jwt.JwtPayload;
		const user = await prisma.user.findUnique({
			where: { id: decodedToken?.id },
		});

		req.user = user || null;
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
		if (!req?.user?.id) {
			throw new ApiError(401, "Unauthorized request");
		}

		if (roles.includes(req.user?.role || "")) {
			next();
		} else {
			throw new ApiError(403, "You are not allowed to perform this action");
		}
	});

/**
 * Middleware to restrict access to only local development environments.
 */
export const avoidInProduction = asyncHandler(async (req, res, next) => {
	if (process.env.NODE_ENV === "development") {
		next();
	} else {
		throw new ApiError(
			403,
			"This service is only available in the local environment. For more details visit: https://github.com/hiteshchoudhary/apihub/#readme"
		);
	}
});
