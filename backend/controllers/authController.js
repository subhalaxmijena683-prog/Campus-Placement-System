import User from "../models/User.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role = "Admin" } = req.body;
  const existing = await User.findOne({ email });
  if (existing) throw new ApiError("Email already registered", 409);

  const user = await User.create({ name, email, password, role });
  res.status(201).json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token: generateToken(user)
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError("Invalid email or password", 401);
  }

  res.json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token: generateToken(user)
  });
});

const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

const logout = asyncHandler(async (req, res) => {
  res.json({ message: "Logged out successfully" });
});

export { register, login, me, logout };
