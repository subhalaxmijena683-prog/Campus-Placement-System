import Company from "../models/Company.js";
import asyncHandler from "../utils/asyncHandler.js";

const getCompanies = asyncHandler(async (req, res) => {
  const filter = req.query.search
    ? { companyName: { $regex: req.query.search, $options: "i" } }
    : {};
  const items = await Company.find(filter).sort({ companyName: 1 });
  res.json({ items, total: items.length });
});

const getCompany = asyncHandler(async (req, res) => {
  const item = await Company.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Company not found" });
  res.json(item);
});

const createCompany = asyncHandler(async (req, res) => {
  const item = await Company.create(req.body);
  res.status(201).json(item);
});

const updateCompany = asyncHandler(async (req, res) => {
  const item = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) return res.status(404).json({ message: "Company not found" });
  res.json(item);
});

const deleteCompany = asyncHandler(async (req, res) => {
  const item = await Company.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: "Company not found" });
  res.json({ message: "Company deleted" });
});

export { getCompanies, getCompany, createCompany, updateCompany, deleteCompany };
