import { Router } from "express";
import {
	loginHandler,
	registerHandler,
} from "../controllers/user.controllers.js";
import {
	loginValidator,
	registerValidator,
} from "../validators/user.validators.js";
const router = Router();

// registerValidator handles user input validation, registerHandler contains the main registration logic
router.route("/register").post(registerValidator, registerHandler);

// loginValidator handles user input validation, loginHandler contains the main login logic
router.route("/login").post(loginValidator, loginHandler);

export default router;
