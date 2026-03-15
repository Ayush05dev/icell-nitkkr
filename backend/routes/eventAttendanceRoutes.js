import express from "express";
import verifyUser from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";
import {
  markStudentAttendance,
  getEventAttendance,
  getStudentEventAttendance,
  getStudentAttendanceStats,
  getUniqueEvents, // We will add this to help the frontend dropdown!
} from "../controllers/eventAttendanceController.js";

const router = express.Router();

// 1. POST /api/event-attendance/mark - Everything goes in the body now
router.post("/mark", verifyUser, isAdmin, markStudentAttendance);

// 2. GET /api/event-attendance/event - Use query params (e.g. ?name=Meet&date=2026-03-15)
router.get("/event", verifyUser, isAdmin, getEventAttendance);

// 3. GET /api/event-attendance/events/list - Get a list of all unique events marked so far
router.get("/events/list", verifyUser, isAdmin, getUniqueEvents);

// 4. GET student specific stats
router.get("/student/:studentId", verifyUser, getStudentEventAttendance);
router.get("/student/:studentId/stats", verifyUser, getStudentAttendanceStats);

export default router;
