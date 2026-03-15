import express from "express";
import {
  getStats,
  getAllMembers,
  promoteMember,
} from "../controllers/adminController.js";
import verifyUser, { requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// All admin routes require authentication and admin role
router.get("/stats", verifyUser, requireAdmin, getStats);
router.get("/members", verifyUser, requireAdmin, getAllMembers);
router.post("/promote-member", verifyUser, requireAdmin, promoteMember);

export default router;
