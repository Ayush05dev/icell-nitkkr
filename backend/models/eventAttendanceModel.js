import { getDB } from "../config/mongodb.js";
import { v4 as uuidv4 } from "uuid";

// Mark attendance
export async function markAttendance(
  eventName,
  eventType,
  eventDate,
  studentId,
  status,
  markedBy
) {
  try {
    const db = getDB();
    const attendance = db.collection("event_attendance");

    const existing = await attendance.findOne({
      event_name: eventName,
      event_date: eventDate,
      student_id: studentId,
    });

    if (existing) {
      await attendance.updateOne(
        { _id: existing._id },
        {
          $set: {
            status,
            event_type: eventType, // Update in case the admin changed the type
            marked_at: new Date(),
            marked_by: markedBy,
            updated_at: new Date(),
          },
        }
      );
      return {
        data: { ...existing, status, event_type: eventType },
        error: null,
      };
    } else {
      const record = {
        _id: uuidv4(),
        event_name: eventName,
        event_type: eventType,
        event_date: eventDate,
        student_id: studentId,
        status,
        marked_at: new Date(),
        marked_by: markedBy,
        created_at: new Date(),
        updated_at: new Date(),
      };
      await attendance.insertOne(record);
      return { data: record, error: null };
    }
  } catch (error) {
    return { data: null, error };
  }
}

// Fetch event attendance
export async function fetchEventAttendance(eventName, eventDate) {
  try {
    const db = getDB();
    const attendance = db.collection("event_attendance");
    const profiles = db.collection("profiles");

    const records = await attendance
      .find({
        event_name: eventName,
        event_date: eventDate,
      })
      .toArray();

    const enriched = await Promise.all(
      records.map(async (record) => {
        const student = await profiles.findOne({ _id: record.student_id });
        return {
          ...record,
          student_name: student?.name,
          student_email: student?.email,
          student_branch: student?.branch,
        };
      })
    );
    return { data: enriched, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

// Fetch student attendance history
export async function fetchStudentEventAttendance(studentId) {
  try {
    const db = getDB();
    const attendance = db.collection("event_attendance");

    // Since event_name and event_date are now saved directly in the record,
    // we don't need to do a secondary lookup to an 'events' collection anymore!
    const records = await attendance
      .find({ student_id: studentId })
      .sort({ marked_at: -1 })
      .toArray();

    return { data: records, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

// Fetch student attendance stats
export async function fetchStudentAttendanceStats(studentId) {
  try {
    const db = getDB();
    const attendance = db.collection("event_attendance");
    const records = await attendance.find({ student_id: studentId }).toArray();

    const stats = {
      total: records.length,
      present: records.filter((r) => r.status === "present").length,
      absent: records.filter((r) => r.status === "absent").length,
      leave: records.filter((r) => r.status === "leave").length,
      percentage:
        records.length > 0
          ? Math.round(
              (records.filter((r) => r.status === "present").length /
                records.length) *
                100
            )
          : 0,
    };
    return { data: stats, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

// Helper: Get unique events to populate a dropdown on the frontend
export async function fetchUniqueEvents() {
  try {
    const db = getDB();
    const attendance = db.collection("event_attendance");

    // Uses MongoDB aggregation to group by event name and date so we don't get duplicates
    const uniqueEvents = await attendance
      .aggregate([
        {
          $group: {
            _id: { name: "$event_name", date: "$event_date" },
            type: { $first: "$event_type" },
          },
        },
        {
          $project: {
            _id: 0,
            name: "$_id.name",
            date: "$_id.date",
            type: 1,
          },
        },
        { $sort: { date: -1 } },
      ])
      .toArray();

    return { data: uniqueEvents, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
