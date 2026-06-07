import Student from "../models/Student.js";
import asyncHandler from "../utils/asyncHandler.js";

const buildStudentQuery = (query) => {
  const filter = {};
  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { rollNo: { $regex: query.search, $options: "i" } },
      { branch: { $regex: query.search, $options: "i" } }
    ];
  }
  if (query.branch) filter.branch = { $regex: query.branch, $options: "i" };
  return filter;
};

const getStudents = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const filter = buildStudentQuery(req.query);
  const [items, total] = await Promise.all([
    Student.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Student.countDocuments(filter)
  ]);
  res.json({ items, page, pages: Math.ceil(total / limit), total });
});

const getStudent = asyncHandler(async (req, res) => {
  const item = await Student.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Student not found" });
  res.json(item);
});

const createStudent = asyncHandler(async (req, res) => {
  const item = await Student.create(req.body);
  res.status(201).json(item);
});

const updateStudent = asyncHandler(async (req, res) => {
  const item = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) return res.status(404).json({ message: "Student not found" });
  res.json(item);
});

const deleteStudent = asyncHandler(async (req, res) => {
  const item = await Student.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: "Student not found" });
  res.json({ message: "Student deleted" });
});

export { getStudents, getStudent, createStudent, updateStudent, deleteStudent };
