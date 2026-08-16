import express from "express";

import {
  getUsers,
  getProfile,
  signup,
  login,
} from "../controllers/userController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// =========================
// PUBLIC ROUTES
// =========================

// Signup
router.post("/signup", signup);

// Login
router.post("/login", login);

// =========================
// PROTECTED ROUTES
// =========================

// Get all users
router.get("/users", authMiddleware, getUsers);

// Get logged-in user's profile
router.get("/profile", authMiddleware, getProfile);

export default router;
