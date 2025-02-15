import { prisma } from "../db/index.js";
import { ApiError } from "../utils/ApiError.js";
import { RATE_LIMIT_CONFIG } from "../constants.js";
import { BlockedIPData, UserWithAuth } from "../types/index.js";

export const ipBlockService = {
	async isIpBlocked(ip: string): Promise<boolean> {
		const blockedIp = await prisma.blockedIP.findUnique({
			where: { ip },
			select: { blockedUntil: true }, // Performance: Only select needed field
		});
		return Boolean(
			blockedIp?.blockedUntil && blockedIp.blockedUntil > new Date()
		);
	},

	async blockIp(ip: string, duration: number = 24): Promise<void> {
		const blockedUntil = new Date(Date.now() + duration * 60 * 60 * 1000); // duration in hours
		await prisma.blockedIP.upsert({
			where: { ip },
			update: { blockedUntil },
			create: { ip, blockedUntil },
		});
	},

	async handleFailedLogin(user: UserWithAuth, ip: string): Promise<void> {
		const { MAX_FAILED_ATTEMPTS, BLOCK_DURATION } = RATE_LIMIT_CONFIG;

		const updatedUser = await this.incrementFailedAttempts(
			user,
			MAX_FAILED_ATTEMPTS,
			BLOCK_DURATION
		);
		await this.handleIPBlock(
			updatedUser,
			ip,
			MAX_FAILED_ATTEMPTS,
			BLOCK_DURATION
		);
	},

	async incrementFailedAttempts(
		user: UserWithAuth,
		maxAttempts: number,
		blockDuration: number
	): Promise<UserWithAuth> {
		return prisma.user.update({
			where: { id: user.id },
			data: {
				failedLoginAttempts: { increment: 1 },
				accountLockedUntil: this.calculateLockTime(
					user.failedLoginAttempts + 1,
					maxAttempts,
					blockDuration
				),
			},
		});
	},

	calculateLockTime(
		attempts: number,
		maxAttempts: number,
		duration: number
	): Date | null {
		return attempts >= maxAttempts
			? new Date(Date.now() + duration * 60 * 60 * 1000)
			: null;
	},

	async handleIPBlock(
		user: UserWithAuth,
		ip: string,
		maxAttempts: number,
		blockDuration: number
	): Promise<void> {
		// If max attempts reached, block both account and IP
		if (user.failedLoginAttempts >= maxAttempts) {
			await this.blockIp(ip, blockDuration);
			throw new ApiError(
				403,
				`Account and IP blocked for ${blockDuration} hours due to too many failed attempts`
			);
		}

		// Add to BlockedIP if close to max attempts
		if (user.failedLoginAttempts >= maxAttempts - 2) {
			await this.blockIp(ip, blockDuration);
		}
	},
};
