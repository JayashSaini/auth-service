import { NextFunction, Request, Response } from "express";
import logger from "../logger/winston.logger.js";
import { ApiError } from "../utils/ApiError.js";
import { config } from "../config/index.js";

/**
 * Error handling middleware for catching errors.
 * @param err The error to be handled.
 * @param req The request object.
 * @param res The response object.
 * @param next The next function to be passed.
 */
const errorHandler = (
	err: Error | ApiError,
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	let error: ApiError | Error = err;

	// If the error is not an instance of ApiError, create a new ApiError
	if (!(error instanceof ApiError)) {
		const statusCode = (error as ApiError).statusCode || 500;
		const message = (error as Error).message || "Something went wrong";
		const stack = (error as Error).stack || "";
		error = new ApiError(statusCode, message, [], stack);
	}

	const apiError = error as ApiError;

	// Prepare the response
	const response = {
		message: apiError.message,
		...(config.nodeEnv === "development" ? { stack: apiError.stack } : {}),
		statusCode: apiError.statusCode,
		errors: apiError.errors || [],
	};

	// Send the response with the appropriate status code
	res.status(apiError.statusCode).json(response);
};

export { errorHandler };
