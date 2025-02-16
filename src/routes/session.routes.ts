import { Router } from "express";
import {
	getUserSessionsHandler,
	terminateSessionHandler,
	terminateAllSessionsHandler,
} from "../controllers/session.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
	apiLimiter,
	sessionLimiter,
} from "../middlewares/security.middlewares.js";

const router = Router();

// api limiter
router.use(apiLimiter);
// auth middleware
router.use(verifyJWT);
// session express rate limit middleware
router.use(sessionLimiter);

router
	.route("/")
	.get(getUserSessionsHandler)
	.delete(terminateAllSessionsHandler);

router.route("/:sessionId").delete(terminateSessionHandler);

export default router;
