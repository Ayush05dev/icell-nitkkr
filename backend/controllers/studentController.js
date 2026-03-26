import * as authModel from "../models/authModel.js";

// Get all students or filter by branch/year
export async function getStudents(req, res) {
  try {
    const { branch, year } = req.query;

    let students;

    if (branch && year) {
      students = await authModel.getStudentsByFilter(branch, year);
    } else if (branch) {
      students = await authModel.getStudentsByFilter(branch, null);
    } else if (year) {
      students = await authModel.getStudentsByFilter(null, year);
    } else {
      students = await authModel.getAllStudents();
    }

    res.json(students);
  } catch (error) {
    console.error("Get students error:", error);
    res.status(500).json({ error: "Failed to get students" });
  }
}

// Get single student
export async function getStudent(req, res) {
  try {
    const { id } = req.params;
    const student = await authModel.getUserById(id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    console.error("Get student error:", error);
    res.status(500).json({ error: "Failed to get student" });
  }
}

// Promote student to post holder
export async function promoteToPostHolder(req, res) {
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

// Get all post holders
export async function getAllPostHolders(req, res) {
  try {
    const allUsers = await authModel.getAllStudentsAdmin();
    const filtered = allUsers.filter((s) => s.role === "post_holder");
    res.json(filtered);
  } catch (error) {
    console.error("Get post holders error:", error);
    res.status(500).json({ error: "Failed to get post holders" });
  }
}
