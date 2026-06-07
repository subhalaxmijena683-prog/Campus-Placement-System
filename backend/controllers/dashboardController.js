import Application from "../models/Application.js";
import Attendance from "../models/Attendance.js";
import CandidateProgress from "../models/CandidateProgress.js";
import Company from "../models/Company.js";
import InterviewRound from "../models/InterviewRound.js";
import Student from "../models/Student.js";
import asyncHandler from "../utils/asyncHandler.js";

const dashboard = asyncHandler(async (req, res) => {
  const [
    totalStudents,
    totalCompanies,
    totalApplications,
    totalInterviewRounds,
    progressCounts,
    companyWise,
    attendanceSummary,
    selectionSummary
  ] = await Promise.all([
    Student.countDocuments(),
    Company.countDocuments(),
    Application.countDocuments(),
    InterviewRound.countDocuments(),
    CandidateProgress.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Application.aggregate([
      { $group: { _id: { companyId: "$companyId", status: "$status" }, count: { $sum: 1 } } },
      { $lookup: { from: "companies", localField: "_id.companyId", foreignField: "_id", as: "company" } },
      { $unwind: "$company" },
      { $project: { companyName: "$company.companyName", status: "$_id.status", count: 1, _id: 0 } },
      { $sort: { companyName: 1 } }
    ]),
    Attendance.aggregate([{ $group: { _id: "$attendanceStatus", count: { $sum: 1 } } }]),
    CandidateProgress.aggregate([
      { $match: { status: { $in: ["Selected", "Rejected", "Offer Received"] } } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ])
  ]);

  const getCount = (status) => progressCounts.find((item) => item._id === status)?.count || 0;

  res.json({
    cards: {
      totalStudents,
      totalCompanies,
      totalApplications,
      totalInterviewRounds,
      studentsInProcess: getCount("In Process"),
      selectedStudents: getCount("Selected"),
      rejectedStudents: getCount("Rejected"),
      offerReceivedStudents: getCount("Offer Received")
    },
    charts: {
      companyWise,
      attendanceSummary,
      selectionSummary,
      recruitmentProgress: progressCounts
    }
  });
});

export { dashboard };
