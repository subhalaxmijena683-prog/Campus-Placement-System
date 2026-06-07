import Application from "../models/Application.js";
import Student from "../models/Student.js";
import Company from "../models/Company.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import { createProgressForApplication } from "../services/progressService.js";

const getApplications = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  const items = await Application.find(filter)
    .populate("studentId", "name rollNo branch cgpa")
    .populate("companyId", "companyName jobRole package")
    .sort({ createdAt: -1 });
  res.json({ items, total: items.length });
});

const createApplication = asyncHandler(async (req, res) => {
  const { studentId, companyId, status = "Applied" } = req.body;
  const [student, company] = await Promise.all([Student.findById(studentId), Company.findById(companyId)]);
  if (!student || !company) throw new ApiError("Student or company not found", 404);
  if (student.cgpa < company.eligibilityCGPA) throw new ApiError("Student does not meet company eligibility CGPA", 400);

  const application = await Application.create({ studentId, companyId, status });
  await createProgressForApplication(application);
  res.status(201).json(application);
});

const updateApplication = asyncHandler(async (req, res) => {
  const application = await Application.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!application) return res.status(404).json({ message: "Application not found" });
  await createProgressForApplication(application);
  res.json(application);
});

const deleteApplication = asyncHandler(async (req, res) => {
  const application = await Application.findByIdAndDelete(req.params.id);
  if (!application) return res.status(404).json({ message: "Application not found" });
  res.json({ message: "Application deleted" });
});

const applicantCount = asyncHandler(async (req, res) => {
  const items = await Application.aggregate([
    { $group: { _id: "$companyId", count: { $sum: 1 } } },
    { $lookup: { from: "companies", localField: "_id", foreignField: "_id", as: "company" } },
    { $unwind: "$company" },
    { $project: { companyId: "$_id", companyName: "$company.companyName", count: 1, _id: 0 } },
    { $sort: { count: -1 } }
  ]);
  res.json({ items });
});

export { getApplications, createApplication, updateApplication, deleteApplication, applicantCount };
