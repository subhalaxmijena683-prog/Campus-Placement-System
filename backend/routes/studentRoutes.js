import express from "express";
import { createStudent, deleteStudent, getStudent, getStudents, updateStudent } from "../controllers/studentController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";
import { idParamValidation, studentValidation } from "../validations/entityValidation.js";

const router = express.Router();
router.use(protect, adminOnly);
router.route("/").get(getStudents).post(studentValidation, validateRequest, createStudent);
router.route("/:id").get(idParamValidation, validateRequest, getStudent).put(idParamValidation, studentValidation, validateRequest, updateStudent).delete(idParamValidation, validateRequest, deleteStudent);

export default router;
