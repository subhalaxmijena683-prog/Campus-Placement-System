import { body, param } from "express-validator";

const mongoId = (field, location = "body") => {
  const source = location === "param" ? param(field) : body(field);
  return source.isMongoId().withMessage(`${field} must be a valid id`);
};

const studentValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("rollNo").trim().notEmpty().withMessage("Roll number is required"),
  body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("phone").trim().isLength({ min: 7 }).withMessage("Phone is required"),
  body("branch").trim().notEmpty().withMessage("Branch is required"),
  body("cgpa").isFloat({ min: 0, max: 10 }).withMessage("CGPA must be between 0 and 10"),
  body("passingYear").isInt({ min: 2000, max: 2100 }).withMessage("Passing year is invalid")
];

const companyValidation = [
  body("companyName").trim().notEmpty().withMessage("Company name is required"),
  body("package").isFloat({ min: 0 }).withMessage("Package must be positive"),
  body("location").trim().notEmpty().withMessage("Location is required"),
  body("eligibilityCGPA").isFloat({ min: 0, max: 10 }).withMessage("Eligibility CGPA must be between 0 and 10"),
  body("jobRole").trim().notEmpty().withMessage("Job role is required"),
  body("description").trim().notEmpty().withMessage("Description is required")
];

const applicationValidation = [
  mongoId("studentId"),
  mongoId("companyId"),
  body("status").optional().isIn(["Applied", "In Process", "Rejected", "Selected", "Offer Received"])
];

const roundValidation = [
  mongoId("companyId"),
  body("roundName").trim().notEmpty().withMessage("Round name is required"),
  body("roundNumber").isInt({ min: 1 }).withMessage("Round number must be at least 1")
];

const attendanceValidation = [
  mongoId("studentId"),
  mongoId("companyId"),
  mongoId("roundId"),
  body("attendanceStatus").isIn(["Present", "Absent"]).withMessage("Attendance must be Present or Absent")
];

const resultValidation = [
  mongoId("studentId"),
  mongoId("companyId"),
  mongoId("roundId"),
  body("result").isIn(["Selected", "Rejected", "Pending"]).withMessage("Result must be Selected, Rejected, or Pending")
];

const idParamValidation = [mongoId("id", "param")];

export {
  studentValidation,
  companyValidation,
  applicationValidation,
  roundValidation,
  attendanceValidation,
  resultValidation,
  idParamValidation
};
