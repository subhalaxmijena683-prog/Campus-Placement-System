import express from "express";
import { attendanceSummary, getAttendance, markAttendance } from "../controllers/attendanceController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";
import { attendanceValidation } from "../validations/entityValidation.js";

const router = express.Router();
router.use(protect, adminOnly);
router.get("/summary", attendanceSummary);
router.route("/").get(getAttendance).post(attendanceValidation, validateRequest, markAttendance);

export default router;
