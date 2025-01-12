import { errorHandler } from "../middlewares/error.middlewares.js";

/**
 * @description Common Error class to throw an error from anywhere.
 * The {@link errorHandler} middleware will catch this error at the central place and it will return an appropriate response to the client.
 */
class ApiError extends Error {
	statusCode: number;
	message: string;
	data: any | null;
	success: boolean;
	errors: any[];

	/**
	 *
	 * @param {number} statusCode - HTTP status code for the error.
	 * @param {string} message - Custom error message (defaults to "Something went wrong").
	 * @param {any[]} errors - Array of errors or additional details.
	 * @param {string} stack - The stack trace of the error.
	 */
	constructor(
		statusCode: number,
		message: string = "Something went wrong",
		errors: any[] = [],
		stack: string = ""
	) {
		super(message);
		this.statusCode = statusCode;
		this.data = null;
		this.message = message;
		this.success = false;
		this.errors = errors;

		if (stack) {
			this.stack = stack;
		} else {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}

export { ApiError };
