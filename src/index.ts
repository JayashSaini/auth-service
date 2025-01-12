import dotenv from "dotenv";
// Load environment variables
dotenv.config({
	path: "./.env",
});

import { connectPrisma } from "./db/prisma.js";
import { app } from "./app.js";
import logger from "./logger/winston.logger.js";

const PORT = process.env.PORT || 8000;

async function startApp() {
	try {
		// Start the server
		app.listen(PORT, () => {
			logger.info(`✅ Server is running on port: ${PORT}`);
		});
	} catch (error) {
		logger.error("Error starting the server: ", error);
		process.exit(1); // Exit process on failure
	}
}

async function bootstrap() {
	try {
		// Connect to the database
		await connectPrisma();

		// Start the application
		await startApp();
	} catch (error) {
		logger.error("❌ Application initialization failed: ", error);
		process.exit(1); // Exit process on failure
	}
}

// Start the app
bootstrap();
