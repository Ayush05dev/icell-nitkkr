import express from "express";
import verifyUser, { requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// TODO: Implement newsletter routes with MongoDB
import {
  getAllNewsletters,
  getNewsletterById,
  createNewsletter,
  //   deleteNewsletter,
} from "../controllers/newsletterController.js";

// ── Public endpoints ──────────────────────────────────────────────────────────
router.get("/", getAllNewsletters);
router.get("/:id", getNewsletterById);

// ── Admin only endpoints ──────────────────────────────────────────────────────
router.post("/", verifyUser, requireAdmin, createNewsletter);
// router.delete("/:id", verifyUser, requireAdmin, deleteNewsletter);

export default router;
