import { Router } from "express";
import verifyUser, { requireAdmin } from "../middleware/authMiddleware.js";
import {
  getAllGalleryGroups,
  getGalleryGroup,
  createGalleryGroup,
  updateGalleryGroup,
  deleteGalleryGroup,
  addImageToGroup,
  deleteImageFromGroup,
  setGroupThumbnail,
} from "../controllers/galleryGroupController.js";

const router = Router();

// ─── Public Routes ──────────────────────────────────────────────────────
// GET /api/gallery-groups - get all gallery groups
router.get("/", getAllGalleryGroups);

// GET /api/gallery-groups/:groupId - get single gallery group with all images
router.get("/:groupId", getGalleryGroup);

// ─── Admin Routes ───────────────────────────────────────────────────────
// POST /api/gallery-groups - create new gallery group (admin only)
router.post("/", verifyUser, requireAdmin, createGalleryGroup);

// PATCH /api/gallery-groups/:groupId - update gallery group (admin only)
router.patch("/:groupId", verifyUser, requireAdmin, updateGalleryGroup);

// DELETE /api/gallery-groups/:groupId - delete entire gallery group (admin only)
router.delete("/:groupId", verifyUser, requireAdmin, deleteGalleryGroup);

// POST /api/gallery-groups/:groupId/images - add image to group (admin only)
router.post("/:groupId/images", verifyUser, requireAdmin, addImageToGroup);

// DELETE /api/gallery-groups/:groupId/images/:imageId - delete image from group (admin only)
router.delete(
  "/:groupId/images/:imageId",
  verifyUser,
  requireAdmin,
  deleteImageFromGroup
);

// PATCH /api/gallery-groups/:groupId/thumbnail/:imageId - set thumbnail (admin only)
router.patch(
  "/:groupId/thumbnail/:imageId",
  verifyUser,
  requireAdmin,
  setGroupThumbnail
);

export default router;
