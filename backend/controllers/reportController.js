import PDFDocument from "pdfkit";
import Application from "../models/Application.js";
import Attendance from "../models/Attendance.js";
import CandidateProgress from "../models/CandidateProgress.js";
import Company from "../models/Company.js";
import Student from "../models/Student.js";
import asyncHandler from "../utils/asyncHandler.js";

const writeRows = (doc, rows, columns) => {
  rows.forEach((row) => {
    doc.moveDown(0.35);
    columns.forEach((column) => {
      doc.fontSize(9).text(`${column.label}: ${column.value(row)}`, { continued: false });
    });
    doc.moveDown(0.25).strokeColor("#e5e7eb").moveTo(50, doc.y).lineTo(545, doc.y).stroke();
  });
};

const escapeCsv = (value) => {
  const text = value === undefined || value === null ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
};

const createCsv = (res, title, rows, columns) => {
  const filename = `${title.toLowerCase().replaceAll(" ", "-")}.csv`;
  const header = columns.map((column) => escapeCsv(column.label)).join(",");
  const body = rows.map((row) => columns.map((column) => escapeCsv(column.value(row))).join(",")).join("\n");
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.send([header, body].filter(Boolean).join("\n"));
};

const createReport = (req, res, title, rows, columns) => {
  if (req.query.format === "csv") {
    createCsv(res, title, rows, columns);
    return;
  }

  const doc = new PDFDocument({ margin: 50 });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${title.toLowerCase().replaceAll(" ", "-")}.pdf"`);
  doc.pipe(res);
  doc.fontSize(18).fillColor("#111827").text(title);
  doc.fontSize(10).fillColor("#6b7280").text(`Generated on ${new Date().toLocaleString()}`);
  doc.moveDown();
  writeRows(doc, rows, columns);
  doc.end();
};

const studentPlacementReport = asyncHandler(async (req, res) => {
  const rows = await CandidateProgress.find()
    .populate("studentId", "name rollNo branch cgpa")
    .populate("companyId", "companyName package jobRole")
    .sort({ updatedAt: -1 });
  createReport(req, res, "Student Placement Report", rows, [
    { label: "Student", value: (row) => `${row.studentId?.name} (${row.studentId?.rollNo})` },
    { label: "Branch", value: (row) => row.studentId?.branch },
    { label: "Company", value: (row) => row.companyId?.companyName },
    { label: "Status", value: (row) => row.status }
  ]);
});

const companyRecruitmentReport = asyncHandler(async (req, res) => {
  const rows = await Application.find().populate("companyId", "companyName jobRole package").populate("studentId", "name rollNo");
  createReport(req, res, "Company Recruitment Report", rows, [
    { label: "Company", value: (row) => row.companyId?.companyName },
    { label: "Role", value: (row) => row.companyId?.jobRole },
    { label: "Student", value: (row) => `${row.studentId?.name} (${row.studentId?.rollNo})` },
    { label: "Status", value: (row) => row.status }
  ]);
});

const attendanceReport = asyncHandler(async (req, res) => {
  const rows = await Attendance.find().populate("studentId", "name rollNo").populate("companyId", "companyName").populate("roundId", "roundName roundNumber");
  createReport(req, res, "Attendance Report", rows, [
    { label: "Student", value: (row) => `${row.studentId?.name} (${row.studentId?.rollNo})` },
    { label: "Company", value: (row) => row.companyId?.companyName },
    { label: "Round", value: (row) => `${row.roundId?.roundNumber}. ${row.roundId?.roundName}` },
    { label: "Attendance", value: (row) => row.attendanceStatus }
  ]);
});

const selectionRejectionReport = asyncHandler(async (req, res) => {
  const rows = await CandidateProgress.find({ status: { $in: ["Selected", "Rejected", "Offer Received"] } })
    .populate("studentId", "name rollNo branch")
    .populate("companyId", "companyName");
  createReport(req, res, "Selection Rejection Report", rows, [
    { label: "Student", value: (row) => `${row.studentId?.name} (${row.studentId?.rollNo})` },
    { label: "Company", value: (row) => row.companyId?.companyName },
    { label: "Final Result", value: (row) => row.finalResult },
    { label: "Status", value: (row) => row.status }
  ]);
});

const recruitmentSummaryReport = asyncHandler(async (req, res) => {
  const [students, companies, applications, progress] = await Promise.all([
    Student.countDocuments(),
    Company.countDocuments(),
    Application.countDocuments(),
    CandidateProgress.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }])
  ]);
  const rows = [
    { metric: "Total Students", value: students },
    { metric: "Total Companies", value: companies },
    { metric: "Total Applications", value: applications },
    ...progress.map((item) => ({ metric: item._id, value: item.count }))
  ];
  createReport(req, res, "Recruitment Summary Report", rows, [
    { label: "Metric", value: (row) => row.metric },
    { label: "Value", value: (row) => row.value }
  ]);
});

export {
  studentPlacementReport,
  companyRecruitmentReport,
  attendanceReport,
  selectionRejectionReport,
  recruitmentSummaryReport
};
