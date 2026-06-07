import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Application from "../models/Application.js";
import Attendance from "../models/Attendance.js";
import CandidateProgress from "../models/CandidateProgress.js";
import Company from "../models/Company.js";
import InterviewRound from "../models/InterviewRound.js";
import Result from "../models/Result.js";
import Student from "../models/Student.js";
import User from "../models/User.js";
import { createProgressForApplication, updateProgressAfterAttendance, updateProgressAfterResult } from "../services/progressService.js";

dotenv.config();

const branches = ["Computer Science", "Information Technology", "Electronics", "Mechanical", "Civil"];
const roundNames = ["Aptitude Test", "Coding Round", "Technical Round", "Group Discussion", "HR Round"];

const students = Array.from({ length: 20 }, (_, index) => ({
  name: `Student ${index + 1}`,
  rollNo: `CPS${String(index + 1).padStart(3, "0")}`,
  email: `student${index + 1}@campus.edu`,
  phone: `9876500${String(index + 1).padStart(3, "0")}`,
  branch: branches[index % branches.length],
  cgpa: Number((6.5 + (index % 7) * 0.45).toFixed(2)),
  passingYear: 2026
}));

const companies = [
  { companyName: "Infosys", package: 4.8, location: "Bengaluru", eligibilityCGPA: 6.5, jobRole: "Systems Engineer", description: "Enterprise technology consulting and development role." },
  { companyName: "TCS Digital", package: 7.0, location: "Pune", eligibilityCGPA: 7.0, jobRole: "Digital Developer", description: "Full-stack engineering for digital transformation programs." },
  { companyName: "Wipro Turbo", package: 6.5, location: "Hyderabad", eligibilityCGPA: 6.8, jobRole: "Project Engineer", description: "Product engineering, cloud, and automation projects." },
  { companyName: "Accenture", package: 5.5, location: "Mumbai", eligibilityCGPA: 6.5, jobRole: "Associate Software Engineer", description: "Application development and modernization work." },
  { companyName: "Zoho", package: 8.5, location: "Chennai", eligibilityCGPA: 7.2, jobRole: "Software Developer", description: "Product engineering for SaaS business applications." }
];

const clearCollections = () =>
  Promise.all([
    User.deleteMany(),
    Student.deleteMany(),
    Company.deleteMany(),
    Application.deleteMany(),
    InterviewRound.deleteMany(),
    Attendance.deleteMany(),
    Result.deleteMany(),
    CandidateProgress.deleteMany()
  ]);

const seed = async () => {
  await connectDB();
  await clearCollections();

  await User.create({
    name: "Campus Admin",
    email: "admin@campus.edu",
    password: "Admin@123",
    role: "Admin"
  });

  const createdStudents = await Student.insertMany(students);
  const createdCompanies = await Company.insertMany(companies);

  const createdRounds = [];
  for (const company of createdCompanies) {
    for (let index = 0; index < roundNames.length; index += 1) {
      createdRounds.push(
        await InterviewRound.create({
          companyId: company._id,
          roundName: roundNames[index],
          roundNumber: index + 1
        })
      );
    }
  }

  for (let index = 0; index < createdStudents.length; index += 1) {
    const student = createdStudents[index];
    const company = createdCompanies[index % createdCompanies.length];
    if (student.cgpa < company.eligibilityCGPA) continue;

    const application = await Application.create({ studentId: student._id, companyId: company._id, status: "Applied" });
    await createProgressForApplication(application);
    const companyRounds = createdRounds.filter((round) => String(round.companyId) === String(company._id));
    const roundsToAttempt = index % 4 === 0 ? 5 : index % 3 === 0 ? 2 : 3;

    for (const round of companyRounds.slice(0, roundsToAttempt)) {
      const absent = index % 9 === 0 && round.roundNumber === 2;
      await Attendance.findOneAndUpdate(
        { studentId: student._id, companyId: company._id, roundId: round._id },
        { studentId: student._id, companyId: company._id, roundId: round._id, attendanceStatus: absent ? "Absent" : "Present" },
        { upsert: true }
      );
      await updateProgressAfterAttendance({ studentId: student._id, companyId: company._id, roundId: round._id, attendanceStatus: absent ? "Absent" : "Present" });
      if (absent) break;

      const fail = index % 7 === 0 && round.roundNumber === 3;
      await updateProgressAfterResult({ studentId: student._id, companyId: company._id, roundId: round._id, result: fail ? "Rejected" : "Selected" });
      await Result.findOneAndUpdate(
        { studentId: student._id, companyId: company._id, roundId: round._id },
        { studentId: student._id, companyId: company._id, roundId: round._id, result: fail ? "Rejected" : "Selected" },
        { upsert: true }
      );
      if (fail) break;
    }
  }

  console.log("Seed complete");
  console.log("Admin login: admin@campus.edu / Admin@123");
  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
