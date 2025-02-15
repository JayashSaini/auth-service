import dotenv from "dotenv";

dotenv.config({
	path: `.env.${process.env.NODE_ENV}`,
});

export const config = {
	nodeEnv: (process.env.NODE_ENV || "development") as
		| "development"
		| "production",
	port: process.env.PORT || 8000,
	host: process.env.HOST || "127.0.0.1",
	databaseUrl: process.env.DATABASE_URL || "",
	corsOrigin: process.env.CORS_ORIGIN || "*",

	accessToken: {
		secret: process.env.ACCESS_TOKEN_SECRET || "default_secret",
		expiry: process.env.ACCESS_TOKEN_EXPIRY || "1h",
	},

	refreshToken: {
		secret: process.env.REFRESH_TOKEN_SECRET || "default_secret",
		expiry: process.env.REFRESH_TOKEN_EXPIRY || "15d",
	},

	emailVerificationToken: {
		secret: process.env.EMAIL_VERIFICATION_TOKEN_SECRET || "default_secret",
		expiry: process.env.EMAIL_VERIFICATION_TOKEN_EXPIRY || "30m",
	},

	mailgun: {
		apiKey: process.env.MAILGUN_API_KEY || "",
	},

	kafka: {
		clientId: process.env.KAFKA_CLIENT_ID,
		brokers: (process.env.KAFKA_BROKERS || "localhost:9092").split(","),
		groupId: process.env.KAFKA_GROUP_ID,
		topics: {
			email: process.env.KAFKA_EMAIL_TOPIC,
		},
	},
};
