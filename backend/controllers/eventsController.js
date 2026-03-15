import * as eventModel from "../models/eventModel.js";
import * as attendanceModel from "../models/eventAttendanceModel.js";

// ── Public ────────────────────────────────────────────────────────────────────

// GET /api/events — list all events
export async function listEvents(req, res) {
  try {
    const events = await eventModel.getAllEvents();
    res.json(events);
  } catch (error) {
    console.error("List events error:", error);
    res.status(500).json({ error: "Failed to get events" });
  }
}

// GET /api/events/:id — get single event
export async function getEvent(req, res) {
  try {
    const event = await eventModel.getEventById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    console.error("Get event error:", error);
    res.status(500).json({ error: "Failed to get event" });
  }
}

// GET /api/events/upcoming — get upcoming events
export async function getUpcomingEvents(req, res) {
  try {
    const events = await eventModel.getUpcomingEvents();
    res.json(events);
  } catch (error) {
    console.error("Get upcoming events error:", error);
    res.status(500).json({ error: "Failed to get upcoming events" });
  }
}

// ── Admin – Events CRUD ───────────────────────────────────────────────────────

// POST /api/events — create new event (admin)

export async function createEvent(req, res) {
  try {
    const {
      name,
      description,
      date,
      time,
      location,
      image,
      category,
      capacity,
      status,
    } = req.body;

    if (!name || !date) {
      return res.status(400).json({ error: "Name and date are required" });
    }

    // ✅ FIXED: We are passing arguments one by one, separated by commas!
    // Notice there are NO curly braces {} around these arguments.
    const event = await eventModel.createEvent(
      name,
      description || "",
      date,
      time || "",
      location || "",
      image || "",
      category || "",
      capacity ? parseInt(capacity) : 0,
      req.user?.userId || req.user?.id // Safely grabs the admin ID
    );

    res.status(201).json(event);
  } catch (error) {
    console.error("Create event error:", error);
    res.status(500).json({ error: "Failed to create event" });
  }
}
// PATCH /api/events/:id — update event (admin)
export async function updateEvent(req, res) {
  try {
    await eventModel.updateEvent(req.params.id, req.body);
    res.json({ message: "Event updated successfully" });
  } catch (error) {
    console.error("Update event error:", error);
    res.status(500).json({ error: "Failed to update event" });
  }
}

// DELETE /api/events/:id — delete event (admin)
export async function deleteEvent(req, res) {
  try {
    await eventModel.deleteEvent(req.params.id);
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Delete event error:", error);
    res.status(500).json({ error: "Failed to delete event" });
  }
}

// ── Admin – Attendance ────────────────────────────────────────────────────────

// POST /api/events/:eventId/attendance — mark attendance (admin)
export async function markAttendance(req, res) {
  try {
    const { eventId } = req.params;
    const { studentId, status } = req.body;

    if (!studentId || !status) {
      return res
        .status(400)
        .json({ error: "Student ID and status are required" });
    }

    if (!["present", "absent", "leave"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    await attendanceModel.markAttendance(
      eventId,
      studentId,
      status,
      req.user.userId
    );

    res.json({ message: "Attendance marked successfully" });
  } catch (error) {
    console.error("Mark attendance error:", error);
    res.status(500).json({ error: "Failed to mark attendance" });
  }
}

// GET /api/events/:eventId/attendance — get event attendance (admin)
export async function getEventAttendance(req, res) {
  try {
    const { eventId } = req.params;
    const attendance = await attendanceModel.getEventAttendance(eventId);
    res.json(attendance);
  } catch (error) {
    console.error("Get event attendance error:", error);
    res.status(500).json({ error: "Failed to get attendance" });
  }
}

// ── Student – Personal Attendance ─────────────────────────────────────────────

// GET /api/student/attendance — get student's attendance history
export async function getStudentAttendance(req, res) {
  try {
    const studentId = req.user.userId;
    const attendance = await attendanceModel.getStudentEventAttendance(
      studentId
    );
    res.json(attendance);
  } catch (error) {
    console.error("Get student attendance error:", error);
    res.status(500).json({ error: "Failed to get attendance" });
  }
}

// GET /api/student/attendance/stats — get student attendance stats
export async function getAttendanceStats(req, res) {
  try {
    const studentId = req.user.userId;
    const stats = await attendanceModel.getStudentAttendanceStats(studentId);
    res.json(stats);
  } catch (error) {
    console.error("Get attendance stats error:", error);
    res.status(500).json({ error: "Failed to get attendance stats" });
  }
}
