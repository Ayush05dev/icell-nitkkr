import express from "express";
import verifyUser, { requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// TODO: Implement gallery routes with MongoDB
// import {
//   getAllPhotos,
//   getPhotosByTag,
//   uploadPhoto,
//   removePhoto,
//   getAllTags,
// } from "../controllers/galleryController.js";

// ── Public endpoints ──────────────────────────────────────────────────────────
// router.get("/", getAllPhotos);
// router.get("/tags", getAllTags);
// router.get("/tag/:tag", getPhotosByTag);

// ── Admin only endpoints ──────────────────────────────────────────────────────
// router.post("/", verifyUser, requireAdmin, uploadPhoto);
// router.delete("/:id", verifyUser, requireAdmin, removePhoto);

export default router;
