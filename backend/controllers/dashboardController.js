import { getDashboardStats } from "../models/dashboardModel.js";

// GET /api/admin/stats - fetch dashboard statistics
export const getAdminStats = async (req, res) => {
  try {
    const data = await getDashboardStats();
    res.json(data);
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
