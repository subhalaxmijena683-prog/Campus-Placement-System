import express from "express";
import { getProgress, offerReceived } from "../controllers/progressController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(protect, adminOnly);
router.get("/", getProgress);
router.post("/offer", offerReceived);

export default router;
