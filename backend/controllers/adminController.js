// Admin Controller
import { getDB } from "../config/mongodb.js";
import * as authModel from "../models/authModel.js";

/**
 * Get admin statistics
 */
export async function getStats(req, res) {
  try {
    const db = getDB();

    // Using Promise.all runs all these database queries at the exact same time
    // instead of waiting for one to finish before starting the next. It makes your dashboard load instantly!
    const [
      totalStudents,
      totalBlogs,
      totalEvents,
      totalPhotos,
      totalNewsletters,
      activeMembers,
    ] = await Promise.all([
      db.collection("profiles").countDocuments({}), // Assuming all profiles are students
      db.collection("blogs").countDocuments({}),
      db.collection("events").countDocuments({}),
      db.collection("gallery").countDocuments({}), // Fetching photos for the frontend
      db.collection("newsletters").countDocuments({}), // Fetching newsletters
      db.collection("profiles").countDocuments({ is_member: true }), // Fetching active members
    ]);

    // Send back the EXACT keys your AdminDashboard.jsx is expecting
    res.json({
      totalStudents,
      totalBlogs,
      totalEvents,
      totalPhotos,
      totalNewsletters,
      activeMembers,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ error: "Failed to get statistics" });
  }
}

/**
 * Get all members (admin view)
 */
export async function getAllMembers(req, res) {
  try {
    const db = getDB();
    const profiles = db.collection("profiles");

    const members = await profiles
      .find({ is_member: true })
      .sort({ created_at: -1 })
      .toArray();

    res.json(members);
  } catch (error) {
    console.error("Get members error:", error);
    res.status(500).json({ error: "Failed to get members" });
  }
}

/**
 * Promote/demote member
 */
export async function promoteMember(req, res) {
  try {
    const { memberId, newRole } = req.body;

    if (!memberId || !newRole) {
      return res.status(400).json({ error: "Member ID and role are required" });
    }

    const validRoles = ["member", "post_holder", "admin"];
    if (!validRoles.includes(newRole)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const db = getDB();
    const profiles = db.collection("profiles");

    const result = await profiles.updateOne(
      { _id: memberId },
      {
        $set: {
          role: newRole,
          updated_at: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Member not found" });
    }

    res.json({
      message: "Member role updated successfully",
      memberId,
      newRole,
    });
  } catch (error) {
    console.error("Promote member error:", error);
    res.status(500).json({ error: "Failed to update member role" });
  }
}
