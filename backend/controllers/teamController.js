// Team controller
import { getDB } from "../config/mongodb.js";

export async function getTeams(req, res) {
  try {
    const db = getDB();
    const teams = db.collection("teams");
    
    const data = await teams.find({}).toArray();
    res.json(data || []);
  } catch (error) {
    console.error("Get teams error:", error);
    res.status(500).json({ error: "Failed to get teams" });
  }
}
