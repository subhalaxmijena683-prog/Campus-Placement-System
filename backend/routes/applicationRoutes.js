import express from "express";
import { applicantCount, createApplication, deleteApplication, getApplications, updateApplication } from "../controllers/applicationController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";
import { applicationValidation, idParamValidation } from "../validations/entityValidation.js";

const router = express.Router();
router.use(protect, adminOnly);
router.get("/counts", applicantCount);
router.route("/").get(getApplications).post(applicationValidation, validateRequest, createApplication);
router.route("/:id").put(idParamValidation, validateRequest, updateApplication).delete(idParamValidation, validateRequest, deleteApplication);

export default router;
