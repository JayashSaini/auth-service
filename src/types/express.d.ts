// src/types/express.d.ts (or a similar path in your project)
import { User } from "@prisma/client"; // Prisma User type

declare global {
	namespace Express {
		interface Request {
			user?: User | null; // Add the user property with the appropriate type
		}
	}
}
