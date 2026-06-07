import InterviewRound from "../models/InterviewRound.js";
import asyncHandler from "../utils/asyncHandler.js";

const getRounds = asyncHandler(async (req, res) => {
  const filter = req.query.companyId ? { companyId: req.query.companyId } : {};
  const items = await InterviewRound.find(filter).populate("companyId", "companyName").sort({ companyId: 1, roundNumber: 1 });
  res.json({ items, total: items.length });
});

const createRound = asyncHandler(async (req, res) => {
  const item = await InterviewRound.create(req.body);
  res.status(201).json(item);
});

const updateRound = asyncHandler(async (req, res) => {
  const item = await InterviewRound.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) return res.status(404).json({ message: "Round not found" });
  res.json(item);
});

const deleteRound = asyncHandler(async (req, res) => {
  const item = await InterviewRound.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: "Round not found" });
  res.json({ message: "Round deleted" });
});

export { getRounds, createRound, updateRound, deleteRound };
