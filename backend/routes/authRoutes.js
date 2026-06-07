import express from "express";
import { login, logout, me, register } from "../controllers/authController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";
import { loginValidation, registerValidation } from "../validations/authValidation.js";

const router = express.Router();

router.post("/register", registerValidation, validateRequest, register);
router.post("/login", loginValidation, validateRequest, login);
router.post("/logout", protect, logout);
router.get("/me", protect, adminOnly, me);

export default router;
