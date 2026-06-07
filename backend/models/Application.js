import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true, index: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true, index: true },
    applicationDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["Applied", "In Process", "Rejected", "Selected", "Offer Received"],
      default: "Applied",
      index: true
    }
  },
  { timestamps: true }
);

applicationSchema.index({ studentId: 1, companyId: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);
