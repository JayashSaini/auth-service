// src/db/prisma.ts
import { PrismaClient } from "@prisma/client";
import logger from "../logger/winston.logger.js";
import { config } from "../config/index.js";

// Singleton pattern to avoid multiple instances of PrismaClient
let prisma: PrismaClient;

if (config.nodeEnv === "production") {
	prisma = new PrismaClient();
} else {
	// In development mode, use a global variable to avoid creating multiple instances
	if (!globalThis.prisma) {
		globalThis.prisma = new PrismaClient();
	}
	prisma = globalThis.prisma;
}

const connectPrisma = async (): Promise<void> => {
	try {
		await prisma.$connect();
		logger.info("✅ Successfully connected to the postgresql server");
	} catch (error) {
		console.error("Failed to connect to the database:", error);
		process.exit(1);
	}
};

// Disconnect on app termination
const disconnectPrisma = async (): Promise<void> => {
	try {
		await prisma.$disconnect();
		logger.info("Disconnected from the database.");
	} catch (error) {
		console.error("Failed to disconnect from the database:", error);
	}
};

export { prisma, connectPrisma, disconnectPrisma };
