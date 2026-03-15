// Updated Event Attendance Schema Concept
export const eventAttendanceSchema = {
  _id: String, // UUID
  event_name: String, // e.g., "Annual Fest Coordination"
  event_type: String, // 'meet', 'external', 'internal', 'workshop'
  event_date: String, // e.g., "2026-03-15" (ISO date string for easy grouping)
  student_id: String, // reference to profile
  status: String, // 'present', 'absent', 'leave'
  marked_at: Date,
  marked_by: String, // admin id
  created_at: Date,
  updated_at: Date,
};
