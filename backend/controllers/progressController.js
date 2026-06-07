import CandidateProgress from "../models/CandidateProgress.js";
import asyncHandler from "../utils/asyncHandler.js";
import { markOfferReceived } from "../services/progressService.js";

const getProgress = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  const items = await CandidateProgress.find(filter)
    .populate("studentId", "name rollNo branch cgpa")
    .populate("companyId", "companyName jobRole package")
    .populate("currentRound", "roundName roundNumber")
    .populate("completedRounds", "roundName roundNumber")
    .sort({ updatedAt: -1 });
  res.json({ items, total: items.length });
});

const offerReceived = asyncHandler(async (req, res) => {
  const progress = await markOfferReceived(req.body.studentId, req.body.companyId);
  res.json(progress);
});

export { getProgress, offerReceived };
