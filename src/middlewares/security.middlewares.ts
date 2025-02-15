import { Request, Response, NextFunction } from "express";
import { rateLimit } from "express-rate-limit";
import { ApiError } from "../utils/ApiError.js";
import { ipBlockService } from "../service/ipBlock.service.js";

// IP Blocking Middleware
export const checkIpBlock = async (
	req: Request,
	_: Response,
	next: NextFunction
) => {
	const clientIp = req.clientIp || req.ip;

	try {
		const isBlocked = await ipBlockService.isIpBlocked(clientIp ?? "none");
		if (isBlocked) {
			throw new ApiError(
				403,
				"Your IP is temporarily blocked. Please try again later."
			);
		}
		next();
	} catch (error) {
		next(error);
	}
};

// Rate Limiting Configuration
const createRateLimiter = (windowMs: number, max: number, message: string) =>
	rateLimit({
		windowMs,
		max,
		standardHeaders: true,
		legacyHeaders: false,
		keyGenerator: (req: Request): string => req.clientIp || "unknown-ip",
		handler: (_, __, ___, options) => {
			throw new ApiError(429, message);
		},
	});

// Different Rate Limiters for different endpoints
export const authLimiter = createRateLimiter(
	15 * 60 * 1000, // 15 minutes
	10, // 10 requests
	"Too many login attempts. Please try again after 15 minutes."
);

export const apiLimiter = createRateLimiter(
	60 * 1000, // 1 minute
	100, // 100 requests
	"Too many requests. Please try again after 1 minute."
);

// Session Rate Limiter
export const sessionLimiter = createRateLimiter(
	60 * 1000, // 1 minute
	10, // 10 requests
	"Too many session operations. Please try again after 1 minute."
);
