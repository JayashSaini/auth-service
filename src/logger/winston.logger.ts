import winston from "winston";

// Define your severity levels.
const levels = {
	error: 0,
	warn: 1,
	info: 2,
	http: 3,
	debug: 4,
};

// Set color mappings
const colors = {
	error: "red", // Default red color for errors
	warn: "yellow",
	info: "cyan", // Use cyan (aqua blue) for info messages
	http: "magenta", // Use magenta for HTTP logs (you can adjust if you like another color)
	debug: "white",
};

// Link colors to levels
winston.addColors(colors);

// Custom format for HTTP logs to highlight status codes with custom colors
const httpFormat = winston.format.printf((info) => {
	const { statusCode, message, timestamp } = info;
	let statusMessage = message;

	// If status code is 400 or above, change the message color to coral red (vivid)
	if (typeof statusCode === "number" && statusCode >= 400) {
		statusMessage = `${statusCode} - ${message}`;
	} else {
		statusMessage = `${statusCode} - ${message}`;
	}

	return `[${timestamp}] HTTP ${statusMessage}`;
});

// General format for logs
const format = winston.format.combine(
	// Add timestamp
	winston.format.timestamp({ format: "DD MMM, YYYY - HH:mm:ss:ms" }),
	// Colorize the logs
	winston.format.colorize({ all: true }),
	// Define log format (timestamp, level, message)
	winston.format.printf(
		(info) => `[${info.timestamp}] ${info.level}: ${info.message}`
	)
);

// Define transports
const transports = [
	// Console transport for development logs
	new winston.transports.Console(),
	// File transport for error logs
	new winston.transports.File({ filename: "logs/error.log", level: "error" }),
	// File transport for info logs
	new winston.transports.File({ filename: "logs/info.log", level: "info" }),
	// File transport for HTTP logs, formatted with custom httpFormat
	new winston.transports.File({
		filename: "logs/http.log",
		level: "http",
		format: winston.format.combine(winston.format.colorize(), httpFormat),
	}),
];

// Create the logger instance
const logger = winston.createLogger({
	level: "debug", // Set level to debug for capturing all logs
	levels,
	format,
	transports,
});

export default logger;
