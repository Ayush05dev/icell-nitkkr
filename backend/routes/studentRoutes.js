import express from "express";
import verifyUser, { requireAdmin } from "../middleware/authMiddleware.js";
import {
  getStudents,
  getStudent,
  promoteToPostHolder,
  getAllPostHolders,
} from "../controllers/studentController.js";

const router = express.Router();

// ── Public endpoints ──────────────────────────────────────────────────────────
router.get("/post-holders", getAllPostHolders);

// ── Protected endpoints ───────────────────────────────────────────────────────
router.get("/", verifyUser, getStudents);
router.get("/:id", verifyUser, getStudent);

// ── Admin only endpoints ──────────────────────────────────────────────────────
router.post("/promote", verifyUser, requireAdmin, promoteToPostHolder);

export default router;
