import express from "express";
import {
  getStats,
  getAllMembers,
  promoteMember,
  getVerifiedStudents,
  getAllStudentsAdmin,
  promoteStudent,
  demoteToStudent,
  deleteUnverifiedStudent,
  changePromotedUserRole,
  getCleanupJobStats,
  triggerUnverifiedCleanup,
} from "../controllers/adminController.js";
import verifyUser, { requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// All admin routes require authentication and admin role
router.get("/stats", verifyUser, requireAdmin, getStats);
router.get("/members", verifyUser, requireAdmin, getAllMembers);
router.post("/promote-member", verifyUser, requireAdmin, promoteMember);

// Student management endpoints
router.get("/students/verified", verifyUser, requireAdmin, getVerifiedStudents);
router.get("/students/all", verifyUser, requireAdmin, getAllStudentsAdmin);
router.post("/students/promote", verifyUser, requireAdmin, promoteStudent);
router.post(
  "/students/change-role",
  verifyUser,
  requireAdmin,
  changePromotedUserRole
);
router.post("/students/demote", verifyUser, requireAdmin, demoteToStudent);
router.post(
  "/students/delete-unverified",
  verifyUser,
  requireAdmin,
  deleteUnverifiedStudent
);

// Cleanup job endpoints
router.get("/cleanup/stats", verifyUser, requireAdmin, getCleanupJobStats);
router.post(
  "/cleanup/trigger",
  verifyUser,
  requireAdmin,
  triggerUnverifiedCleanup
);

export default router;
