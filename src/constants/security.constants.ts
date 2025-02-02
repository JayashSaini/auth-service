export const RATE_LIMIT_CONFIG = {
	GLOBAL: {
		windowMs: 60 * 1000, // 1 minute
		max: 500,
		message: "Too many requests. Your IP has been blocked for 24 hours.",
	},
	AUTH: {
		windowMs: 15 * 60 * 1000,
		max: 5,
		message: "Too many login attempts. Please try again after 15 minutes.",
	},
	MAX_FAILED_ATTEMPTS: 5,
	BLOCK_DURATION: 24, // hours
} as const;
