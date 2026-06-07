import cors from "cors";
import express from "express";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";
import roundRoutes from "./routes/roundRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => res.json({ status: "ok", service: "Campus Interview Tracking API" }));
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/rounds", roundRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
