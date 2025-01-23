import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ApiError } from "./ApiError.js";

/**
 * Async handler that wraps an async request handler to catch any errors
 * and pass them to the next middleware.
 *
 * @param requestHandler - The async request handler function.
 * @returns A function that catches errors and forwards them to the next middleware.
 */
const asyncHandler = (
	requestHandler: (
		req: Request,
		res: Response,
		next: NextFunction
	) => Promise<Response | void> | void
) => {
	return (req: Request, res: Response, next: NextFunction): void => {
		Promise.resolve(requestHandler(req, res, next)).catch((error) => {
			if (error instanceof ZodError) {
				// Handle Zod validation errors here
				const formattedErrors = error.errors.map((err) => {
					return {
						field: err.path.join("."), // Create a path for the field (e.g., email, username)
						message: err.message, // Add the error message
					};
				});

				// Throw a custom ApiError with the formatted errors
				const apiError = new ApiError(
					422,
					"Validation failed",
					formattedErrors
				);
				return next(apiError);
			}

			next(error);
		});
	};
};

export { asyncHandler };
