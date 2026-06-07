import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true, index: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true, index: true },
    roundId: { type: mongoose.Schema.Types.ObjectId, ref: "InterviewRound", required: true, index: true },
    attendanceStatus: { type: String, enum: ["Present", "Absent"], required: true, index: true }
  },
  { timestamps: true }
);

attendanceSchema.index({ studentId: 1, companyId: 1, roundId: 1 }, { unique: true });

export default mongoose.model("Attendance", attendanceSchema);
