import express, { Request, Response } from "express";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import requestIp from "request-ip";
import { ApiError } from "./utils/ApiError.js";
import cookieParser from "cookie-parser";
import morganMiddleware from "./logger/morgon.logger.js";

const app = express();

// global middlewares
app.use(
	cors({
		origin:
			process.env.CORS_ORIGIN === "*"
				? "*" // This might give CORS error for some origins due to credentials set to true
				: process.env.CORS_ORIGIN?.split(","), // For multiple cors origin for production. Refer https://github.com/hiteshchoudhary/apihub/blob/a846abd7a0795054f48c7eb3e71f3af36478fa96/.env.sample#L12C1-L12C12
		credentials: true,
	})
);

app.use(requestIp.mw());

// Rate limiter to avoid misuse of the service and avoid cost spikes
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 5000, // Limit each IP to 500 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	keyGenerator: (req: Request, _: Response) => {
		// Ensure that the keyGenerator always returns a string
		return req.clientIp || "unknown-ip"; // Return a fallback string if clientIp is undefined
	},
	handler: (_, __, ___, options) => {
		throw new ApiError(
			options.statusCode || 500,
			`There are too many requests. You are only allowed ${
				options.max
			} requests per ${options.windowMs / 60000} minutes`
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

// if endpoint not found
app.use((_, __, next) => {
	const error = new ApiError(404, "endpoint not found");
	next(error);
});

// common error handling middleware
app.use(errorHandler);

export { app };
