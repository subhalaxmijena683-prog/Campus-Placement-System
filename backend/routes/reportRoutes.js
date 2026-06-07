import express from "express";
import {
  attendanceReport,
  companyRecruitmentReport,
  recruitmentSummaryReport,
  selectionRejectionReport,
  studentPlacementReport
} from "../controllers/reportController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(protect, adminOnly);
router.get("/student-placement", studentPlacementReport);
router.get("/company-recruitment", companyRecruitmentReport);
router.get("/attendance", attendanceReport);
router.get("/selection-rejection", selectionRejectionReport);
router.get("/recruitment-summary", recruitmentSummaryReport);

export default router;
