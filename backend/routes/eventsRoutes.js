import { Router } from "express";
import verifyUser, { requireAdmin } from "../middleware/authMiddleware.js";
import {
  listEvents,
  getEvent,
  getUpcomingEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  markAttendance,
  getEventAttendance,
  getStudentAttendance,
  getAttendanceStats,
  checkMyCertificate,
  getEventCertificate,
} from "../controllers/eventsController.js";

const router = Router();

// ── Public ────────────────────────────────────────────────────────────────────
router.get("/", listEvents);
router.get("/upcoming", getUpcomingEvents);

// ── Student – Certificate & Participation ──────────────────────────────────────
router.get("/:id/check-my-certificate", verifyUser, checkMyCertificate);
router.get("/:id/my-certificate", verifyUser, getEventCertificate);
router.get("/:id", getEvent); // Must come after specific routes

// ── Admin – Events CRUD ───────────────────────────────────────────────────────
router.post("/", verifyUser, requireAdmin, createEvent);
router.patch("/:id", verifyUser, requireAdmin, updateEvent);
router.delete("/:id", verifyUser, requireAdmin, deleteEvent);

// ── Admin – Attendance ────────────────────────────────────────────────────────
router.post("/:eventId/attendance", verifyUser, requireAdmin, markAttendance);
router.get(
  "/:eventId/attendance",
  verifyUser,
  requireAdmin,
  getEventAttendance
);

// ── Student – Personal Attendance ─────────────────────────────────────────────
router.get("/student/attendance", verifyUser, getStudentAttendance);
router.get("/student/attendance/stats", verifyUser, getAttendanceStats);

export default router;
