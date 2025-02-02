import { User } from "@prisma/client";

export interface BlockedIPData {
	ip: string;
	duration?: number;
}

export interface UserWithAuth extends User {
	failedLoginAttempts: number;
	accountLockedUntil: Date | null;
}

export interface RateLimitConfig {
	windowMs: number;
	max: number;
	message: string;
}
