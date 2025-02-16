import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { prisma } from "../db/index.js";
import { sessionService } from "../service/session.service.js";

const getUserSessionsHandler = asyncHandler(async (req, res) => {
	const user = req.user;

	if (!user) {
		throw new ApiError(404, "User not found");
	}

	const sessions = await sessionService.getUserSessions(user.id);

	return res
		.status(200)
		.json(
			new ApiResponse(200, { sessions }, "Sessions retrieved successfully")
		);
});

const terminateSessionHandler = asyncHandler(async (req, res) => {
	const { sessionId } = req.params;
	const user = req.user;

	if (!user) {
		throw new ApiError(404, "User not found");
	}

	const session = await prisma.userSession.findUnique({
		where: { id: sessionId },
	});

	if (!session || session.userId !== user.id) {
		throw new ApiError(403, "Unauthorized to terminate this session");
	}

	await sessionService.invalidateSession(sessionId);

	return res
		.status(200)
		.json(new ApiResponse(200, {}, "Session terminated successfully"));
});

const terminateAllSessionsHandler = asyncHandler(async (req, res) => {
	const user = req.user;

	if (!user) {
		throw new ApiError(404, "User not found");
	}

	await prisma.userSession.updateMany({
		where: {
			userId: user.id,
			isValid: true,
		},
		data: { isValid: false },
	});

	// Clear current session cookies
	res.clearCookie("accessToken");
	res.clearCookie("refreshToken");

	return res
		.status(200)
		.json(new ApiResponse(200, {}, "All sessions terminated successfully"));
});

export {
	getUserSessionsHandler,
	terminateSessionHandler,
	terminateAllSessionsHandler,
};
