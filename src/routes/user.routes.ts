import { Router } from "express";
import {
	deleteAccountHandler,
	loginHandler,
	logoutHandler,
	refreshAccessTokenHandler,
	registerHandler,
	setUserStatusHandler,
	twoFactorAuthHandler,
} from "../controllers/user.controllers.js";
import {
	loginValidator,
	refreshAccessTokenValidator,
	registerValidator,
	setUserStatusValidator,
} from "../validators/user.validators.js";
import {
	verifyJWT,
	verifyPermission,
} from "../middlewares/auth.middlewares.js";
import { UserRolesEnum } from "../constants.js";
const router = Router();

// registerValidator handles user input validation, registerHandler contains the main registration logic
router.route("/register").post(registerValidator, registerHandler);

// loginValidator handles user input validation, loginHandler contains the main login logic
router.route("/login").post(loginValidator, loginHandler);

// refreshAccessTokenValidator handles user input validation, refreshAccessTokenHandler contains the main refresh token logic
router
	.route("/refresh-access-token")
	.post(refreshAccessTokenValidator, refreshAccessTokenHandler);

// authenticated routes starts from here
router.use(verifyJWT);

// delete user account
router
	.route("/delete")
	.delete(
		verifyPermission([UserRolesEnum.ADMIN, UserRolesEnum.USER]),
		deleteAccountHandler
	);

// logoutHandler contains the main logout logic
router.route("/logout").post(logoutHandler);

// toggle 2FA authentication
router.route("/toggle/2FA").patch(twoFactorAuthHandler);

// set user status to banned or suspended
router
	.route("/status")
	.patch(
		verifyPermission([UserRolesEnum.ADMIN]),
		setUserStatusValidator,
		setUserStatusHandler
	);

export default router;
