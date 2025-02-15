import morgan from "morgan";
import logger from "./winston.logger.js";
import { config } from "../config/index.js";

const stream = {
	// Use the http severity
	write: (message: string) => logger.http(message.trim()),
};

const skip = () => {
	const env = config.nodeEnv || "development";
	return env !== "development";
};

const morganMiddleware = morgan(
	":remote-addr :method :url :status - :response-time ms",
	{ stream, skip }
);

export default morganMiddleware;
