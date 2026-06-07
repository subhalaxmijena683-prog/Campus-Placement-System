import express from "express";
import { createRound, deleteRound, getRounds, updateRound } from "../controllers/roundController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";
import { idParamValidation, roundValidation } from "../validations/entityValidation.js";

const router = express.Router();
router.use(protect, adminOnly);
router.route("/").get(getRounds).post(roundValidation, validateRequest, createRound);
router.route("/:id").put(idParamValidation, roundValidation, validateRequest, updateRound).delete(idParamValidation, validateRequest, deleteRound);

export default router;
