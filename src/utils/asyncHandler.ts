import { Request, Response, NextFunction } from "express";

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
	) => Promise<void> | void
) => {
	return (req: Request, res: Response, next: NextFunction): void => {
		Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
	};
};

export { asyncHandler };
