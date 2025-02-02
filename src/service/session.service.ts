import { prisma } from "../db/index.js";
import { Request } from "express";
import { UAParser } from "ua-parser-js";

export const sessionService = {
	async createSession(userId: number, req: Request) {
		const parser = new (UAParser as any)();
		const deviceInfo = {
			browser: parser.getBrowser().name,
			os: parser.getOS().name,
			device: parser.getDevice().type || "desktop",
		};

		return prisma.userSession.create({
			data: {
				userId,
				deviceInfo: JSON.stringify(deviceInfo),
				ipAddress: req.ip ?? "0.0.0.0",
				refreshToken: req.cookies.refreshToken,
			},
		});
	},

	async invalidateSession(sessionId: string) {
		return prisma.userSession.update({
			where: { id: sessionId },
			data: { isValid: false },
		});
	},

	async getUserSessions(userId: number) {
		return prisma.userSession.findMany({
			where: {
				userId,
				isValid: true,
			},
			orderBy: {
				lastActive: "desc",
			},
		});
	},

	async updateSessionActivity(sessionId: string) {
		return prisma.userSession.update({
			where: { id: sessionId },
			data: { lastActive: new Date() },
		});
	},
};
