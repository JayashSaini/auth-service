import swaggerJsdoc from "swagger-jsdoc";

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Authentication API Documentation",
			version: "1.0.0",
			description: "API documentation for the authentication service",
		},
		servers: [
			{
				url: "http://localhost:8000/api/v1",
				description: "Development server",
			},
		],
		components: {
			securitySchemes: {
				cookieAuth: {
					type: "apiKey",
					in: "cookie",
					name: "accessToken",
				},
			},
			schemas: {
				User: {
					type: "object",
					properties: {
						id: { type: "integer" },
						email: { type: "string" },
						username: { type: "string" },
						role: { type: "string", enum: ["USER", "ADMIN"] },
						status: {
							type: "string",
							enum: ["ACTIVE", "BANNED", "LOCKED", "INACTIVE", "SUSPENDED"],
						},
						twoFactorAuthEnabled: { type: "boolean" },
						isEmailVerified: { type: "boolean" },
						lastLogin: { type: "string", format: "date-time" },
						createdAt: { type: "string", format: "date-time" },
						updatedAt: { type: "string", format: "date-time" },
					},
				},
				Session: {
					type: "object",
					properties: {
						id: { type: "string" },
						deviceInfo: { type: "string" },
						ipAddress: { type: "string" },
						lastActive: { type: "string", format: "date-time" },
						isValid: { type: "boolean" },
					},
				},
				ApiResponse: {
					type: "object",
					properties: {
						statusCode: { type: "integer" },
						data: { type: "object" },
						message: { type: "string" },
						success: { type: "boolean" },
					},
				},
				Error: {
					type: "object",
					properties: {
						statusCode: { type: "integer" },
						message: { type: "string" },
						errors: {
							type: "array",
							items: {
								type: "string",
							},
						},
					},
				},
				UserList: {
					type: "object",
					properties: {
						users: {
							type: "array",
							items: {
								$ref: "#/components/schemas/User",
							},
						},
						page: { type: "integer" },
						limit: { type: "integer" },
						total: { type: "integer" },
					},
				},
				LoginResponse: {
					type: "object",
					properties: {
						accessToken: { type: "string" },
						refreshToken: { type: "string" },
						user: {
							$ref: "#/components/schemas/User",
						},
					},
				},
			},
		},
	},
	apis: ["./src/routes/*.ts"], // Path to the API routes
};

export const specs = swaggerJsdoc(options);
