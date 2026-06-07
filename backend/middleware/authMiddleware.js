import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    throw new ApiError("Authentication token required", 401);
  }

  const token = header.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select("-password");

  if (!user) {
    throw new ApiError("User no longer exists", 401);
  }

  req.user = user;
  next();
});

const adminOnly = (req, res, next) => {
  if (req.user?.role !== "Admin") {
    throw new ApiError("Admin access required", 403);
  }
  next();
};

export { protect, adminOnly };
