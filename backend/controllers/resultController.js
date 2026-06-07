import Result from "../models/Result.js";
import asyncHandler from "../utils/asyncHandler.js";
import { updateProgressAfterResult } from "../services/progressService.js";

const getResults = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.companyId) filter.companyId = req.query.companyId;
  if (req.query.roundId) filter.roundId = req.query.roundId;
  const items = await Result.find(filter)
    .populate("studentId", "name rollNo branch")
    .populate("companyId", "companyName")
    .populate("roundId", "roundName roundNumber")
    .sort({ createdAt: -1 });
  res.json({ items, total: items.length });
});

const saveResult = asyncHandler(async (req, res) => {
  const progress = await updateProgressAfterResult(req.body);
  const result = await Result.findOneAndUpdate(
    { studentId: req.body.studentId, companyId: req.body.companyId, roundId: req.body.roundId },
    req.body,
    { upsert: true, new: true, runValidators: true }
  );
  res.status(201).json({ result, progress });
});

export { getResults, saveResult };
