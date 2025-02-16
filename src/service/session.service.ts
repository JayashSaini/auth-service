import { UserSession } from "@prisma/client";
import { prisma } from "../db/index.js";
import { Request } from "express";
import { UAParser } from "ua-parser-js";

export const sessionService = {
	async createSession(userId: number, refreshToken: string, req: Request) {
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
				refreshToken: refreshToken,
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
	async updateSessionPeriod(
		sessionId: string,
		refreshToken: string
	): Promise<UserSession> {
		return prisma.userSession.update({
			where: { id: sessionId },
			data: { refreshToken },
		});
	},
};
