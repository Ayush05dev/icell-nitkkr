// import {
//   markAttendance,
//   getStudentAttendance,
//   getAttendanceByDate,
//   getAttendanceSummary,
//   bulkMarkAttendance,
//   getAttendanceReport,
// } from "../models/attendanceModel.js";

// // Mark attendance for a student
// export const markStudentAttendance = async (req, res) => {
//   try {
//     const { studentId, session, status } = req.body;

//     if (!studentId || !status) {
//       return res
//         .status(400)
//         .json({ error: "Student ID and status are required" });
//     }

//     if (!["present", "absent", "leave"].includes(status)) {
//       return res.status(400).json({ error: "Invalid status" });
//     }

//     const { data, error } = await markAttendance(
//       studentId,
//       session || "1",
//       status
//     );

//     if (error) {
//       return res.status(400).json({ error: error.message });
//     }

//     return res.json({
//       message: "Attendance marked successfully",
//       data,
//     });
//   } catch (err) {
//     console.error("Mark attendance error:", err);
//     return res.status(500).json({ error: "Server error" });
//   }
// };

// // Get student attendance
// export const getStudentAttendanceReport = async (req, res) => {
//   try {
//     const { studentId, startDate, endDate } = req.query;

//     if (!studentId) {
//       return res.status(400).json({ error: "Student ID is required" });
//     }

//     const start =
//       startDate ||
//       new Date(new Date().setDate(new Date().getDate() - 30))
//         .toISOString()
//         .split("T")[0];
//     const end = endDate || new Date().toISOString().split("T")[0];

//     const { data, error } = await getStudentAttendance(studentId, start, end);

//     if (error) {
//       return res.status(400).json({ error: error.message });
//     }

//     return res.json(data);
//   } catch (err) {
//     console.error("Get student attendance error:", err);
//     return res.status(500).json({ error: "Server error" });
//   }
// };

// // Get attendance by date
// export const getAttendanceByDateEndpoint = async (req, res) => {
//   try {
//     const { date, branch, year } = req.query;

//     if (!date) {
//       return res.status(400).json({ error: "Date is required" });
//     }

//     const { data, error } = await getAttendanceByDate(date, branch, year);

//     if (error) {
//       return res.status(400).json({ error: error.message });
//     }

//     return res.json(data);
//   } catch (err) {
//     console.error("Get attendance by date error:", err);
//     return res.status(500).json({ error: "Server error" });
//   }
// };

// // Get attendance summary for a student
// export const getStudentAttendanceSummary = async (req, res) => {
//   try {
//     const { studentId } = req.params;

//     if (!studentId) {
//       return res.status(400).json({ error: "Student ID is required" });
//     }

//     const result = await getAttendanceSummary(studentId);

//     if (result.error) {
//       return res.status(400).json({ error: result.error.message });
//     }

//     return res.json(result.data);
//   } catch (err) {
//     console.error("Get attendance summary error:", err);
//     return res.status(500).json({ error: "Server error" });
//   }
// };

// // Bulk mark attendance
// export const bulkMarkStudentAttendance = async (req, res) => {
//   try {
//     const { attendanceData } = req.body;

//     if (!attendanceData || !Array.isArray(attendanceData)) {
//       return res
//         .status(400)
//         .json({ error: "Attendance data array is required" });
//     }

//     const { data, error } = await bulkMarkAttendance(attendanceData);

//     if (error) {
//       return res.status(400).json({ error: error.message });
//     }

//     return res.json({
//       message: "Attendance marked for all students",
//       count: data.length,
//       data,
//     });
//   } catch (err) {
//     console.error("Bulk mark attendance error:", err);
//     return res.status(500).json({ error: "Server error" });
//   }
// };

// // Get attendance report for date range
// export const getAttendanceReportEndpoint = async (req, res) => {
//   try {
//     const { startDate, endDate, branch, year } = req.query;

//     if (!startDate || !endDate) {
//       return res
//         .status(400)
//         .json({ error: "Start date and end date are required" });
//     }

//     const { data, error } = await getAttendanceReport(
//       startDate,
//       endDate,
//       branch,
//       year
//     );

//     if (error) {
//       return res.status(400).json({ error: error.message });
//     }

//     return res.json(data);
//   } catch (err) {
//     console.error("Get attendance report error:", err);
//     return res.status(500).json({ error: "Server error" });
//   }
// };
