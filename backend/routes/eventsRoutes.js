
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
} from "../controllers/eventsController.js";

const router = Router();

// ── Public ────────────────────────────────────────────────────────────────────
router.get("/", listEvents);
router.get("/upcoming", getUpcomingEvents);
router.get("/:id", getEvent);

// ── Admin – Events CRUD ───────────────────────────────────────────────────────
router.post("/", verifyUser, requireAdmin, createEvent);
router.patch("/:id", verifyUser, requireAdmin, updateEvent);
router.delete("/:id", verifyUser, requireAdmin, deleteEvent);

// ── Admin – Attendance ────────────────────────────────────────────────────────
router.post("/:eventId/attendance", verifyUser, requireAdmin, markAttendance);
router.get("/:eventId/attendance", verifyUser, requireAdmin, getEventAttendance);

// ── Student – Personal Attendance ─────────────────────────────────────────────
router.get("/student/attendance", verifyUser, getStudentAttendance);
router.get("/student/attendance/stats", verifyUser, getAttendanceStats);

export default router;