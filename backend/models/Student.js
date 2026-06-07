import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    rollNo: { type: String, required: true, unique: true, trim: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    branch: { type: String, required: true, trim: true, index: true },
    cgpa: { type: Number, required: true, min: 0, max: 10 },
    passingYear: { type: Number, required: true, min: 2000, max: 2100 }
  },
  { timestamps: true }
);

studentSchema.index({ name: "text", rollNo: "text", branch: "text" });

export default mongoose.model("Student", studentSchema);
