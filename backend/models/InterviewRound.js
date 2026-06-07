import mongoose from "mongoose";

const interviewRoundSchema = new mongoose.Schema(
  {
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true, index: true },
    roundName: { type: String, required: true, trim: true },
    roundNumber: { type: Number, required: true, min: 1 }
  },
  { timestamps: true }
);

interviewRoundSchema.index({ companyId: 1, roundNumber: 1 }, { unique: true });

export default mongoose.model("InterviewRound", interviewRoundSchema);
