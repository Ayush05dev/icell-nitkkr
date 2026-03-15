import express from "express";
import {
  register,
  login,
  refreshToken,
  getProfile,
  updateProfile,
  getAllStudents,
  getStudentsByFilter,
  promoteStudent,
  getAttendance,
  addStudent,
  deleteStudent,
  setupAdmin,
} from "../controllers/authController.js";
import verifyUser, { requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/setup-admin", setupAdmin);

// Protected routes
router.get("/profile", verifyUser, getProfile);
router.put("/profile", verifyUser, updateProfile);
router.get("/attendance", verifyUser, getAttendance);

// Admin routes
router.get("/students", verifyUser, requireAdmin, getAllStudents);
router.post("/students", verifyUser, requireAdmin, addStudent); // <-- Added POST route to create a student!
router.delete("/students/:id", verifyUser, requireAdmin, deleteStudent); // <-- Added DELETE route to remove a student!
router.get("/students/filter", verifyUser, requireAdmin, getStudentsByFilter);
router.post("/promote-student", verifyUser, requireAdmin, promoteStudent);

export default router;
