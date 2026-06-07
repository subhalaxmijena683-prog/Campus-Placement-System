import Application from "../models/Application.js";
import Attendance from "../models/Attendance.js";
import CandidateProgress from "../models/CandidateProgress.js";
import InterviewRound from "../models/InterviewRound.js";
import Result from "../models/Result.js";
import ApiError from "../utils/apiError.js";

const idsEqual = (a, b) => String(a) === String(b);

const getOrderedRounds = (companyId) =>
  InterviewRound.find({ companyId }).sort({ roundNumber: 1, createdAt: 1 });

const ensureApplication = async (studentId, companyId) => {
  const application = await Application.findOne({ studentId, companyId });
  if (!application) {
    throw new ApiError("Student must be registered to the company first", 400);
  }
  return application;
};

const syncApplicationStatus = async (studentId, companyId, status) => {
  await Application.findOneAndUpdate({ studentId, companyId }, { status }, { new: true });
};

const createProgressForApplication = async (application) => {
  const rounds = await getOrderedRounds(application.companyId);
  return CandidateProgress.findOneAndUpdate(
    { studentId: application.studentId, companyId: application.companyId },
    {
      $setOnInsert: {
        studentId: application.studentId,
        companyId: application.companyId,
        currentRound: rounds[0]?._id || null,
        status: application.status || "Applied",
        completedRounds: [],
        finalResult: "Pending"
      }
    },
    { upsert: true, new: true }
  );
};

const validateRoundEntry = async ({ studentId, companyId, roundId }) => {
  await ensureApplication(studentId, companyId);
  const rounds = await getOrderedRounds(companyId);
  const targetIndex = rounds.findIndex((round) => idsEqual(round._id, roundId));

  if (targetIndex === -1) {
    throw new ApiError("Round does not belong to this company", 400);
  }

  const progress = await CandidateProgress.findOne({ studentId, companyId });
  if (["Rejected", "Selected", "Offer Received"].includes(progress?.status)) {
    throw new ApiError(`Candidate progress is already ${progress.status}`, 400);
  }

  for (let index = 0; index < targetIndex; index += 1) {
    const previousRound = rounds[index];
    const attendance = await Attendance.findOne({ studentId, companyId, roundId: previousRound._id });
    const result = await Result.findOne({ studentId, companyId, roundId: previousRound._id });

    if (attendance?.attendanceStatus !== "Present") {
      throw new ApiError(`Candidate cannot move to round ${targetIndex + 1} without present attendance in previous rounds`, 400);
    }

    if (result?.result !== "Selected") {
      throw new ApiError(`Candidate cannot move to round ${targetIndex + 1} without selection in previous rounds`, 400);
    }
  }

  if (progress?.completedRounds?.some((completedRound) => idsEqual(completedRound, roundId))) {
    throw new ApiError("Candidate cannot move backward to a completed round", 400);
  }

  return { rounds, targetIndex };
};

const updateProgressAfterAttendance = async ({ studentId, companyId, roundId, attendanceStatus }) => {
  await validateRoundEntry({ studentId, companyId, roundId });

  if (attendanceStatus === "Absent") {
    const progress = await CandidateProgress.findOneAndUpdate(
      { studentId, companyId },
      { status: "Rejected", finalResult: "Rejected", currentRound: roundId },
      { new: true, upsert: true }
    );
    await syncApplicationStatus(studentId, companyId, "Rejected");
    return progress;
  }

  await syncApplicationStatus(studentId, companyId, "In Process");
  return CandidateProgress.findOneAndUpdate(
    { studentId, companyId },
    { status: "In Process", currentRound: roundId },
    { new: true, upsert: true }
  );
};

const updateProgressAfterResult = async ({ studentId, companyId, roundId, result }) => {
  const { rounds, targetIndex } = await validateRoundEntry({ studentId, companyId, roundId });
  const attendance = await Attendance.findOne({ studentId, companyId, roundId });

  if (attendance?.attendanceStatus !== "Present") {
    throw new ApiError("Present attendance is required before entering a selected result", 400);
  }

  if (result === "Rejected") {
    const rejected = await CandidateProgress.findOneAndUpdate(
      { studentId, companyId },
      { status: "Rejected", finalResult: "Rejected", currentRound: roundId },
      { new: true, upsert: true }
    );
    await syncApplicationStatus(studentId, companyId, "Rejected");
    return rejected;
  }

  if (result === "Pending") {
    await syncApplicationStatus(studentId, companyId, "In Process");
    return CandidateProgress.findOneAndUpdate(
      { studentId, companyId },
      { status: "In Process", finalResult: "Pending", currentRound: roundId },
      { new: true, upsert: true }
    );
  }

  const nextRound = rounds[targetIndex + 1] || null;
  const allRoundsSelected = !nextRound;
  const status = allRoundsSelected ? "Selected" : "In Process";
  const finalResult = allRoundsSelected ? "Selected" : "Pending";

  const progress = await CandidateProgress.findOneAndUpdate(
    { studentId, companyId },
    {
      status,
      finalResult,
      currentRound: nextRound?._id || roundId,
      $addToSet: { completedRounds: roundId }
    },
    { new: true, upsert: true }
  );

  await syncApplicationStatus(studentId, companyId, status);
  return progress;
};

const markOfferReceived = async (studentId, companyId) => {
  const progress = await CandidateProgress.findOne({ studentId, companyId });
  if (!progress || progress.status !== "Selected") {
    throw new ApiError("Only selected candidates can receive an offer", 400);
  }

  const updated = await CandidateProgress.findOneAndUpdate(
    { studentId, companyId },
    { status: "Offer Received", finalResult: "Offer Received" },
    { new: true }
  );
  await syncApplicationStatus(studentId, companyId, "Offer Received");
  return updated;
};

export {
  createProgressForApplication,
  validateRoundEntry,
  updateProgressAfterAttendance,
  updateProgressAfterResult,
  markOfferReceived
};
