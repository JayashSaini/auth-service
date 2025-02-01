import { z } from "zod";
import { StatusEnum } from "../constants.js";

export const registerSchema = z.object({
	email: z
		.string({
			required_error: "Email is required",
			invalid_type_error: "Email must be a string",
		})
		.trim()
		.email("Please provide a valid email address."), // Email format validation

	username: z
		.string({
			required_error: "Username is required",
			invalid_type_error: "Username must be a string",
		})
		.trim()
		.min(3, "Username must be at least 3 characters")
		.max(20, "Username cannot be more than 20 characters long.")
		.regex(
			/^[a-zA-Z0-9_]+$/, // Alphanumeric and underscore only
			"Username can only contain alphanumeric characters and underscores (_)."
		),

	password: z
		.string({
			required_error: "Password is required",
			invalid_type_error: "Password must be a string",
		})
		.trim()
		.min(8, "Password must be at least 8 characters")
		.max(25, "Password cannot be more than 25 characters long."),
});

export const loginSchema = z.object({
	// Validate email with proper format and trim whitespace
	email: z
		.string({
			required_error: "Email is required",
			invalid_type_error: "Email must be a string",
		})
		.trim()
		.email("Please provide a valid email address."),
	// Validate password with min/max length and clearer error messages
	password: z
		.string({
			required_error: "Password is required",
			invalid_type_error: "Password must be a string",
		})
		.trim()
		.min(8, "Password must be at least 8 characters")
		.max(25, "Password cannot be more than 25 characters long."),
});

export const setUserStatusSchema = z.object({
	userId: z.number({
		required_error: "User ID is required",
		invalid_type_error: "User ID must be a number",
	}),
	status: z.enum(["ACTIVE", "BANNED", "SUSPENDED"], {
		invalid_type_error: "User status is invalid",
		required_error: "status is required",
	}),
});
