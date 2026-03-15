// import express from "express";
// import verifyUser, { requireAdmin } from "../middleware/authMiddleware.js";
// import {
//   createEvent,
//   getEvents,
//   getStudentsByYear,
//   markAttendance,
//   getEventAttendance,
//   getStudentAttendance,
// } from "../controllers/attendanceController.js";

// const router = express.Router();

// // ── Admin – Event Management ──────────────────────────────────────────────────
// router.post("/events", verifyUser, requireAdmin, createEvent);
// router.get("/events", verifyUser, getEvents);

// // ── Admin – Mark bulk attendance ──────────────────────────────────────────────
// router.post("/mark-bulk", verifyUser, requireAdmin, markAttendance);
// router.get("/event-attendance", verifyUser, requireAdmin, getEventAttendance);

// // ── Student filtering by year ────────────────────────────────────────────────
// router.get("/students-by-year", verifyUser, requireAdmin, getStudentsByYear);

// // ── Protected – Get student's attendance ──────────────────────────────────────
// router.get("/student", verifyUser, getStudentAttendance);

// export default router;
