// src/global.d.ts
import { PrismaClient } from "@prisma/client";

declare global {
	var prisma: PrismaClient | undefined;
	namespace NodeJS {
		interface ProcessEnv {
			PORT: number;

			NODE_ENV: "development" | "production";

			DATABASE_URL: string;

			CORS_ORIGIN: string;

			ACCESS_TOKEN_SECRET: string;
			ACCESS_TOKEN_EXPIRY: string;

			REFRESH_TOKEN_SECRET: string;
			REFRESH_TOKEN_EXPIRY: string;

			EMAIL_VERIFICATION_TOKEN_EXPIRY: string;
			PASSWORD_TOKEN_EXPIRY: string;

			MAILGUN_API_KEY: string;

			KAFKA_CLIENT_ID: string;
			KAFKA_BROKERS: string;
			KAFKA_GROUP_ID: string;
			KAFKA_EMAIL_TOPIC: string;
		}
	}
}
