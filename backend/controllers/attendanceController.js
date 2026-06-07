import Attendance from "../models/Attendance.js";
import asyncHandler from "../utils/asyncHandler.js";
import { updateProgressAfterAttendance } from "../services/progressService.js";

const getAttendance = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.companyId) filter.companyId = req.query.companyId;
  if (req.query.roundId) filter.roundId = req.query.roundId;
  const items = await Attendance.find(filter)
    .populate("studentId", "name rollNo branch")
    .populate("companyId", "companyName")
    .populate("roundId", "roundName roundNumber")
    .sort({ createdAt: -1 });
  res.json({ items, total: items.length });
});

const markAttendance = asyncHandler(async (req, res) => {
  const progress = await updateProgressAfterAttendance(req.body);
  const attendance = await Attendance.findOneAndUpdate(
    { studentId: req.body.studentId, companyId: req.body.companyId, roundId: req.body.roundId },
    req.body,
    { upsert: true, new: true, runValidators: true }
  );
  res.status(201).json({ attendance, progress });
});

const attendanceSummary = asyncHandler(async (req, res) => {
  const items = await Attendance.aggregate([{ $group: { _id: "$attendanceStatus", count: { $sum: 1 } } }]);
  res.json({ items });
});

export { getAttendance, markAttendance, attendanceSummary };
