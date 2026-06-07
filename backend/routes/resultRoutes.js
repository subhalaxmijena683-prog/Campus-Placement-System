import express from "express";
import { getResults, saveResult } from "../controllers/resultController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";
import { resultValidation } from "../validations/entityValidation.js";

const router = express.Router();
router.use(protect, adminOnly);
router.route("/").get(getResults).post(resultValidation, validateRequest, saveResult);

export default router;
