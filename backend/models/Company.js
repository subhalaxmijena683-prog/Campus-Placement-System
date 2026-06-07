import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, unique: true, trim: true, index: true },
    package: { type: Number, required: true, min: 0 },
    location: { type: String, required: true, trim: true },
    eligibilityCGPA: { type: Number, required: true, min: 0, max: 10 },
    jobRole: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

companySchema.index({ companyName: "text", jobRole: "text" });

export default mongoose.model("Company", companySchema);
