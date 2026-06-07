import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true, index: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true, index: true },
    roundId: { type: mongoose.Schema.Types.ObjectId, ref: "InterviewRound", required: true, index: true },
    result: { type: String, enum: ["Selected", "Rejected", "Pending"], required: true, index: true }
  },
  { timestamps: true }
);

resultSchema.index({ studentId: 1, companyId: 1, roundId: 1 }, { unique: true });

export default mongoose.model("Result", resultSchema);
