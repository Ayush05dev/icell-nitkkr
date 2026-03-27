import { getDB } from "../config/mongodb.js";

/**
 * Get dashboard statistics
 * Returns counts for users and content
 */
export async function getDashboardStats() {
  try {
    const db = getDB();

    // User Statistics
    // 1. Total Users (students + members + post holders)
    const totalUsers = await db.collection("profiles").countDocuments({
      role: { $in: ["student", "member"] },
    });

    // 2. Total Students (role = "student")
    const totalStudents = await db.collection("profiles").countDocuments({
      role: "student",
    });

    // 3. Total Members (role = "member")
    const totalMembers = await db.collection("profiles").countDocuments({
      role: "member",
    });

    // 4. Total Post Holders (users with post_position set to non-null value)
    const totalPostHolders = await db.collection("profiles").countDocuments({
      post_position: { $ne: null, $exists: true },
    });

    // 5. Unverified Users (email_verified = false)
    const unverifiedUsers = await db.collection("profiles").countDocuments({
      email_verified: false,
    });

    // Content Statistics
    // 6. Total Events
    const totalEvents = await db.collection("events").countDocuments({});

    // 7. Total Blogs
    const totalBlogs = await db.collection("blogs").countDocuments({});

    // 8. Gallery Photos
    const totalPhotos = await db.collection("gallery").countDocuments({});

    // 9. Total Newsletters
    const totalNewsletters = await db
      .collection("newsletters")
      .countDocuments({});

    return {
      // User Stats
      totalUsers: totalUsers || 0,
      totalStudents: totalStudents || 0,
      totalMembers: totalMembers || 0,
      totalPostHolders: totalPostHolders || 0,
      unverifiedUsers: unverifiedUsers || 0,

      // Content Stats
      totalEvents: totalEvents || 0,
      totalBlogs: totalBlogs || 0,
      totalPhotos: totalPhotos || 0,
      totalNewsletters: totalNewsletters || 0,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw new Error("Failed to fetch dashboard statistics");
  }
}
