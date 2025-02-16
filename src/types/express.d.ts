// src/types/express.d.ts (or a similar path in your project)
import { User } from "@prisma/client"; // Prisma User type
import { authPayload } from ".";

declare global {
	namespace Express {
		interface Request {
			user?: authPayload | null; // Add the user property with the appropriate type
			fullUser: User | null;
		}
	}
}
