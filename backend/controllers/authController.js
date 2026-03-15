import * as authModel from "../models/authModel.js";
import crypto from "crypto";
import {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { sendVerificationEmail } from "../utils/emailService.js";

const NITKKR_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@nitkkr\.ac\.in$/i;
const EMAIL_VERIFICATION_TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000;

function getBackendPublicUrl() {
  return (
    process.env.BACKEND_PUBLIC_URL ||
    `http://localhost:${process.env.PORT || 5000}`
  );
}

function getFrontendUrl() {
  return process.env.FRONTEND_URL || "http://localhost:5173";
}

// Register
export async function register(req, res) {
  try {
    const { email, password, name, phone, branch, year } = req.body;

    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ error: "Email, password, and name are required" });
    }

    if (!NITKKR_EMAIL_REGEX.test(email)) {
      return res.status(400).json({
        error: "Only @nitkkr.ac.in email addresses are allowed",
      });
    }

    const user = await authModel.createUser(
      email,
      password,
      name,
      phone,
      branch,
      year
    );

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenHash = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");
    const verificationTokenExpiry = new Date(
      Date.now() + EMAIL_VERIFICATION_TOKEN_EXPIRY_MS
    );

    await authModel.saveEmailVerificationToken(
      user.id,
      verificationTokenHash,
      verificationTokenExpiry
    );

    const verificationLink = `${getBackendPublicUrl()}/api/auth/verify-email?token=${verificationToken}`;
    await sendVerificationEmail(user.email, user.name, verificationLink);

    res.status(201).json({
      message:
        "Registration successful. Please verify your email from the link sent to your inbox.",
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(400).json({ error: error.message });
  }
}

// Login
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await authModel.getUserByEmail(email);

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await authModel.verifyPassword(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (!user.email_verified) {
      return res.status(403).json({
        error: "Please verify your email before logging in",
      });
    }

    const accessToken = generateToken(user._id, user.email, user.role);
    const refreshToken = generateRefreshToken(user._id);

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
}

export async function verifyEmail(req, res) {
  try {
    const { token } = req.query;
    const frontendUrl = getFrontendUrl();

    if (!token) {
      return res.redirect(`${frontendUrl}/login?verified=0`);
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const updatedUser = await authModel.verifyEmailByTokenHash(tokenHash);

    if (!updatedUser) {
      return res.redirect(`${frontendUrl}/login?verified=0`);
    }

    return res.redirect(`${frontendUrl}/login?verified=1`);
  } catch (error) {
    console.error("Verify email error:", error);
    return res.redirect(`${getFrontendUrl()}/login?verified=0`);
  }
}

// Refresh token
export async function refreshToken(req, res) {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({ error: "Refresh token is required" });
    }

    const payload = verifyRefreshToken(refresh_token);

    if (!payload) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    const user = await authModel.getUserById(payload.userId);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const newAccessToken = generateToken(user._id, user.email, user.role);

    res.json({
      access_token: newAccessToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(401).json({ error: "Token refresh failed" });
  }
}

// Get user profile
export async function getProfile(req, res) {
  try {
    const userId = req.user.userId;
    const user = await authModel.getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      branch: user.branch,
      year: user.year,
      role: user.role,
      is_member: user.is_member,
      email_verified: user.email_verified === true,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Failed to get profile" });
  }
}

// Update user profile
export async function updateProfile(req, res) {
  try {
    const userId = req.user.userId;
    const { name, phone, branch, year, roll_number } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (branch) updates.branch = branch;
    if (year) updates.year = year;
    if (roll_number) updates.roll_number = roll_number;

    await authModel.updateUserProfile(userId, updates);

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
}

// Get all students
export async function getAllStudents(req, res) {
  try {
    const students = await authModel.getAllStudents();
    res.json(students);
  } catch (error) {
    console.error("Get students error:", error);
    res.status(500).json({ error: "Failed to get students" });
  }
}

// Get students by filter
export async function getStudentsByFilter(req, res) {
  try {
    const { branch, year } = req.query;
    const students = await authModel.getStudentsByFilter(branch, year);
    res.json(students);
  } catch (error) {
    console.error("Filter students error:", error);
    res.status(500).json({ error: "Failed to filter students" });
  }
}

// Promote student
export async function promoteStudent(req, res) {
  try {
    const { studentId, newRole } = req.body;

    if (!studentId || !newRole) {
      return res
        .status(400)
        .json({ error: "Student ID and role are required" });
    }

    await authModel.promoteStudent(studentId, newRole);

    res.json({ message: "Student promoted successfully" });
  } catch (error) {
    console.error("Promote student error:", error);
    res.status(500).json({ error: "Failed to promote student" });
  }
}

// Get user attendance
export async function getAttendance(req, res) {
  try {
    const userId = req.user.userId;

    // Return real attendance data from database
    // For now, return empty array as no attendance records exist yet
    // In production, this would query the attendance collection
    const attendanceRecords = [];

    res.json(attendanceRecords);
  } catch (error) {
    console.error("Get attendance error:", error);
    res.status(500).json({ error: "Failed to get attendance" });
  }
}

// Admin setup - only works if no admin exists
export async function setupAdmin(req, res) {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check if admin already exists
    const adminExists = await authModel.checkAdminExists();
    if (adminExists) {
      return res.status(400).json({
        error: "Admin already exists. Contact existing admin for changes.",
      });
    }

    // Create admin
    const admin = await authModel.createAdmin(email, password, name || "Admin");

    const accessToken = generateToken(admin.id, admin.email, "admin");
    const refreshToken = generateRefreshToken(admin.id);

    res.status(201).json({
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: "admin",
      },
      access_token: accessToken,
      refresh_token: refreshToken,
      message: "Admin created successfully",
    });
  } catch (error) {
    console.error("Admin setup error:", error);
    res.status(500).json({ error: error.message || "Failed to setup admin" });
  }
}
// Add a new student manually (Admin only)
export async function addStudent(req, res) {
  try {
    const { name, email, password, branch, year, roll_number } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email, and password are required" });
    }

    // Reuse your existing createUser function from the model
    // Note: createUser doesn't take roll_number yet, so we will update the profile right after creation
    const newUser = await authModel.createUser(
      email,
      password,
      name,
      "", // phone
      branch,
      year
    );

    // If a roll number was provided, update the newly created profile
    if (roll_number) {
      await authModel.updateUserProfile(newUser.id, { roll_number });
    }

    res
      .status(201)
      .json({ message: "Student added successfully", student: newUser });
  } catch (error) {
    console.error("Add student error:", error);
    // If it's the "User already exists" error from the model, send a 400
    if (error.message === "User already exists") {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to add student" });
  }
}

// Delete a student (Admin only)
export async function deleteStudent(req, res) {
  try {
    const { id } = req.params;

    // Prevent deleting yourself
    if (id === req.user?.id) {
      return res
        .status(400)
        .json({ error: "You cannot delete your own account." });
    }

    const deleted = await authModel.deleteStudentProfile(id);

    if (!deleted) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Delete student error:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to delete student" });
  }
}
