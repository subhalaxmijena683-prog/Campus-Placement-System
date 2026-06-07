import express from "express";
import { createCompany, deleteCompany, getCompanies, getCompany, updateCompany } from "../controllers/companyController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";
import { companyValidation, idParamValidation } from "../validations/entityValidation.js";

const router = express.Router();
router.use(protect, adminOnly);
router.route("/").get(getCompanies).post(companyValidation, validateRequest, createCompany);
router.route("/:id").get(idParamValidation, validateRequest, getCompany).put(idParamValidation, companyValidation, validateRequest, updateCompany).delete(idParamValidation, validateRequest, deleteCompany);

export default router;
