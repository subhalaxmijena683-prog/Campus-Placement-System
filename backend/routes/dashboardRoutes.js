import express from "express";
import { dashboard } from "../controllers/dashboardController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/", protect, adminOnly, dashboard);

export default router;
