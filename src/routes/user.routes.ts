import { Router } from "express";
import {
	deleteAccountHandler,
	getAllUsersHandler,
	getSelfHandler,
	loginHandler,
	logoutHandler,
	refreshAccessTokenHandler,
	registerHandler,
	setUserStatusHandler,
	twoFactorAuthHandler,
	verifyEmailHandler,
	verify2FAHandler,
	changePasswordRequestHandler,
	changePasswordHandler,
	forgotPasswordRequestHandler,
	forgotPasswordHandler,
	resendVerifyEmailHandler,
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
import {
	checkIpBlock,
	authLimiter,
	apiLimiter,
} from "../middlewares/security.middlewares.js";
const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication endpoints
 *   - name: User
 *     description: User management endpoints
 *   - name: Sessions
 *     description: Session management endpoints
 */

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - username
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               username:
 *                 type: string
 *     responses:
 *       201:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Invalid input
 */
router.use(checkIpBlock);
router.use(apiLimiter);
router.route("/register").post(registerValidator, registerHandler);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: accessToken=abcde12345; HttpOnly; Secure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.use(checkIpBlock);
router.route("/login").post(authLimiter, loginValidator, loginHandler);

// refreshAccessTokenValidator handles user input validation, refreshAccessTokenHandler contains the main refresh token logic
router
	.route("/refresh-access-token")
	.post(refreshAccessTokenValidator, refreshAccessTokenHandler);

router.route("/verify-email/:token").post(verifyEmailHandler);
router.route("/resend-verify-email").post(resendVerifyEmailHandler);
router.route("/2fa/:token").post(verify2FAHandler);
router.route("/forgot-password-request").post(forgotPasswordRequestHandler);
router.route("/forgot-password/:token").post(forgotPasswordHandler);

// authenticated routes starts from here
router.use(verifyJWT);

// get self
router.route("/").get(getSelfHandler);
router
	.route("/all")
	.get(verifyPermission([UserRolesEnum.ADMIN]), getAllUsersHandler);

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

router.route("/change-password-request").post(changePasswordRequestHandler);
router.route("/change-password/:token").post(changePasswordHandler);
/**
 * @swagger
 * /user/sessions:
 *   get:
 *     summary: Get user sessions
 *     tags: [Sessions]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of user sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Session'
 *   delete:
 *     summary: Terminate all sessions
 *     tags: [Sessions]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: All sessions terminated
 */

/**
 * @swagger
 * /user/sessions/{sessionId}:
 *   delete:
 *     summary: Terminate specific session
 *     tags: [Sessions]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Session terminated
 *       403:
 *         description: Unauthorized to terminate session
 */

/**
 * @swagger
 * /user/refresh-access-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get current user profile
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */

/**
 * @swagger
 * /user/all:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ALL, ACTIVE, BANNED, LOCKED, INACTIVE, SUSPENDED]
 *           default: ALL
 *         description: Filter users by status
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       403:
 *         description: Not authorized to access this resource
 */

/**
 * @swagger
 * /user/delete:
 *   delete:
 *     summary: Delete user account
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       403:
 *         description: Not authorized to delete this account
 */

/**
 * @swagger
 * /user/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */

/**
 * @swagger
 * /user/toggle/2FA:
 *   patch:
 *     summary: Toggle Two-Factor Authentication
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: 2FA settings updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */

/**
 * @swagger
 * /user/status:
 *   patch:
 *     summary: Update user status (Admin only)
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - status
 *             properties:
 *               userId:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, BANNED, LOCKED, INACTIVE, SUSPENDED]
 *     responses:
 *       200:
 *         description: User status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       403:
 *         description: Not authorized to update user status
 */

export default router;
