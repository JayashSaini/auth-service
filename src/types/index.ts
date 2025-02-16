import { Role, Status, User } from "@prisma/client";

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

export interface Email {
	to: string;
	subject: string;
	templateId: string;
	data: {};
}

export interface authPayload {
	id: number;
	email: string;
	status: Status;
	role: Role;
	sessionId: string;
}
