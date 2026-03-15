import { getDB } from "../config/mongodb.js";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

// Create new user
export async function createUser(email, password, name, phone, branch, year) {
  const db = getDB();
  const profiles = db.collection("profiles");

  // Check if user already exists
  const existingUser = await profiles.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const userId = uuidv4();
  const user = {
    _id: userId,
    email,
    password: hashedPassword,
    name: name || "",
    phone: phone || "",
    branch: branch || "",
    year: year || "",
    roll_number: "",
    role: "member",
    is_member: true,
    created_at: new Date(),
    updated_at: new Date(),
  };

  await profiles.insertOne(user);
  return { id: userId, email, name };
}

// Get user by email
export async function getUserByEmail(email) {
  const db = getDB();
  const profiles = db.collection("profiles");
  return await profiles.findOne({ email });
}

// Get user by ID
export async function getUserById(id) {
  const db = getDB();
  const profiles = db.collection("profiles");
  return await profiles.findOne({ _id: id });
}

// Verify password
export async function verifyPassword(inputPassword, hashedPassword) {
  return await bcrypt.compare(inputPassword, hashedPassword);
}

// Update user role
export async function updateUserRole(userId, role) {
  const db = getDB();
  const profiles = db.collection("profiles");

  const result = await profiles.updateOne(
    { _id: userId },
    {
      $set: {
        role,
        updated_at: new Date(),
      },
    }
  );

  return result.modifiedCount > 0;
}

// Update user profile
export async function updateUserProfile(userId, updates) {
  const db = getDB();
  const profiles = db.collection("profiles");

  const result = await profiles.updateOne(
    { _id: userId },
    {
      $set: {
        ...updates,
        updated_at: new Date(),
      },
    }
  );

  return result.modifiedCount > 0;
}

// Get all students
export async function getAllStudents() {
  const db = getDB();
  const profiles = db.collection("profiles");

  return await profiles.find({ is_member: true }).sort({ name: 1 }).toArray();
}

// Get students by filter
export async function getStudentsByFilter(branch, year) {
  const db = getDB();
  const profiles = db.collection("profiles");

  const filter = { is_member: true };
  if (branch) filter.branch = branch;
  if (year) filter.year = year;

  return await profiles.find(filter).sort({ name: 1 }).toArray();
}

// Promote student to admin/post_holder
export async function promoteStudent(studentId, newRole) {
  const db = getDB();
  const profiles = db.collection("profiles");

  const result = await profiles.updateOne(
    { _id: studentId },
    {
      $set: {
        role: newRole,
        updated_at: new Date(),
      },
    }
  );

  return result.modifiedCount > 0;
}

// Check if any admin exists
export async function checkAdminExists() {
  const db = getDB();
  const profiles = db.collection("profiles");

  const admin = await profiles.findOne({ role: "admin" });
  return admin !== null;
}

// Create admin user
export async function createAdmin(email, password, name = "Admin") {
  const db = getDB();
  const profiles = db.collection("profiles");

  // Check if user already exists
  const existingUser = await profiles.findOne({ email });
  if (existingUser) {
    throw new Error("Email already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const adminId = uuidv4();
  const admin = {
    _id: adminId,
    email,
    password: hashedPassword,
    name: name || "Admin",
    phone: "",
    branch: "",
    year: "",
    roll_number: "",
    role: "admin",
    is_member: false,
    created_at: new Date(),
    updated_at: new Date(),
  };

  await profiles.insertOne(admin);
  return { id: adminId, email, name };
}
// Delete a student
export async function deleteStudentProfile(studentId) {
  const db = getDB();
  const profiles = db.collection("profiles");

  // Prevent deleting an admin
  const user = await profiles.findOne({ _id: studentId });
  if (user && user.role === "admin") {
    throw new Error("Cannot delete an admin account.");
  }

  const result = await profiles.deleteOne({ _id: studentId });
  return result.deletedCount > 0;
}
