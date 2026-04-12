import express from "express";
import verifyUser, { requireAdmin } from "../middleware/authMiddleware.js";
import {
  getAllPhotos,
  getEventTags,
  getPhotosByEvent,
  uploadPhoto,
  removePhoto,
} from "../controllers/galleryController.js";

const router = express.Router();

// ── Public endpoints ──────────────────────────────────────────────────────────
// Get all gallery photos
router.get("/", getAllPhotos);

// Get unique event tags
router.get("/tags", getEventTags);

// Get photos by specific event
router.get("/:event", getPhotosByEvent);

// ── Admin only endpoints ──────────────────────────────────────────────────────
// Upload new photo (requires auth + admin)
router.post("/", verifyUser, requireAdmin, uploadPhoto);

// Delete photo (requires auth + admin)
router.delete("/:id", verifyUser, requireAdmin, removePhoto);

export default router;
