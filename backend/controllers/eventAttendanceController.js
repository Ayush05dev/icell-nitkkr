import {
  markAttendance,
  fetchEventAttendance,
  fetchStudentEventAttendance,
  fetchStudentAttendanceStats,
  fetchUniqueEvents, // Added to get a list of past dynamic events
} from "../models/eventAttendanceModel.js";

// POST /api/event-attendance/mark - Mark attendance (using body)
export const markStudentAttendance = async (req, res) => {
  try {
    const { event_name, event_type, event_date, student_id, status } = req.body;

    // Validate required fields
    if (!event_name || !event_date || !student_id) {
      return res.status(400).json({ error: "Missing required event details" });
    }

    if (!["present", "absent", "leave", null].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const markedBy = req.user?.id || null;

    const { data, error } = await markAttendance(
      event_name,
      event_type,
      event_date,
      student_id,
      status,
      markedBy
    );

    if (error) return res.status(400).json({ error: error.message });

    res.json({ message: "Attendance marked", attendance: data });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/event-attendance/event - Get attendance for specific event via query params
export const getEventAttendance = async (req, res) => {
  try {
    const { name, date } = req.query;

    if (!name || !date) {
      return res
        .status(400)
        .json({ error: "Event name and date are required" });
    }

    const { data, error } = await fetchEventAttendance(name, date);
    if (error) return res.status(400).json({ error: error.message });

    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/event-attendance/student/:studentId - Get student's event attendance
export const getStudentEventAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { data, error } = await fetchStudentEventAttendance(studentId);
    if (error) return res.status(400).json({ error: error.message });
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/event-attendance/student/:studentId/stats - Get student attendance stats
export const getStudentAttendanceStats = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { data, error } = await fetchStudentAttendanceStats(studentId);
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/event-attendance/events/list - Get all unique events created
export const getUniqueEvents = async (req, res) => {
  try {
    const { data, error } = await fetchUniqueEvents();
    if (error) return res.status(400).json({ error: error.message });
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
