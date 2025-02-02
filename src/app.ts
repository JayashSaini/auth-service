import express, { Request, Response } from "express";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import requestIp from "request-ip";
import { ApiError } from "./utils/ApiError.js";
import cookieParser from "cookie-parser";
import morganMiddleware from "./logger/morgon.logger.js";
import swaggerUi from "swagger-ui-express";
import { specs } from "./docs/swagger.js";
import { ipBlockService } from "./service/ipBlock.service.js";

const app = express();

// Add type for environment variables
declare global {
	namespace NodeJS {
		interface ProcessEnv {
			CORS_ORIGIN: string;
			NODE_ENV: "development" | "production";
			// Add other env variables
		}
	}
}

// Separate middleware configuration
const corsOptions: cors.CorsOptions = {
	origin:
		process.env.CORS_ORIGIN === "*" ? "*" : process.env.CORS_ORIGIN.split(","),
	credentials: true,
};

app.use(cors(corsOptions));

app.use(requestIp.mw());

// Rate limiter to avoid misuse of the service and avoid cost spikes
const limiter = rateLimit({
	windowMs: 60 * 1000, // 1 minute
	max: 500, // Limit each IP to 500 requests per minute
	standardHeaders: true,
	legacyHeaders: false,
	keyGenerator: (req: Request) => req.clientIp || "unknown-ip",
	handler: async (req, _, __, options) => {
		const clientIp = req.clientIp || "unknown-ip";

		// Block IP for 24 hours if rate limit is exceeded
		await ipBlockService.blockIp(clientIp);

		throw new ApiError(
			429,
			`Too many requests. Your IP has been blocked for 24 hours due to excessive requests.`
		);
	},
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public")); // configure static file to save images locally
app.use(cookieParser());

// // required for passport
// app.use(
// 	session({
// 		secret: process.env.EXPRESS_SESSION_SECRET,
// 		resave: true,
// 		saveUninitialized: true,
// 	})
// ); // session secret
// app.use(passport.initialize());
// app.use(passport.session()); // persistent login sessions

app.use(morganMiddleware);

import { errorHandler } from "./middlewares/error.middlewares.js";
import userRouter from "./routes/user.routes.js";
import { ApiResponse } from "./utils/ApiResponse.js";

app.use("/api/v1/user", userRouter);
app.get("/api/v1/healthcheck", (req, res) => {
	res.status(200).json(new ApiResponse(200, {}, "Server is running"));
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// if endpoint not found
app.use((_, __, next) => {
	const error = new ApiError(404, "endpoint not found");
	next(error);
});

// common error handling middleware
app.use(errorHandler);

// Add Swagger documentation route

export { app };
