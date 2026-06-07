import mongoose from "mongoose";

const candidateProgressSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true, index: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true, index: true },
    currentRound: { type: mongoose.Schema.Types.ObjectId, ref: "InterviewRound", default: null },
    status: {
      type: String,
      enum: ["Applied", "In Process", "Completed All Rounds", "Rejected", "Selected", "Offer Received"],
      default: "Applied",
      index: true
    },
    completedRounds: [{ type: mongoose.Schema.Types.ObjectId, ref: "InterviewRound" }],
    finalResult: { type: String, enum: ["Pending", "Rejected", "Selected", "Offer Received"], default: "Pending" }
  },
  { timestamps: true }
);

candidateProgressSchema.index({ studentId: 1, companyId: 1 }, { unique: true });

export default mongoose.model("CandidateProgress", candidateProgressSchema);
