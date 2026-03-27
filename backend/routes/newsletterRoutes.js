import express from "express";
import verifyUser, { requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

import {
  getAllNewsletters,
  getNewsletterById,
  createNewsletter,
  editNewsletter,
  removeNewsletter,
  downloadNewsletter,
} from "../controllers/newsletterController.js";

// ── Public endpoints ──────────────────────────────────────────────────────────
router.get("/", getAllNewsletters);
router.get("/:id", getNewsletterById);

// ── Admin only endpoints ──────────────────────────────────────────────────────
router.post("/", verifyUser, requireAdmin, createNewsletter);
router.patch("/:id", verifyUser, requireAdmin, editNewsletter);
router.delete("/:id", verifyUser, requireAdmin, removeNewsletter);

// ── Download tracking endpoint ────────────────────────────────────────────────
router.post("/:id/download", downloadNewsletter);

export default router;
