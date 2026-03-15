import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import {
  Check,
  X,
  Save,
  Search,
  Download,
  Plus,
  Calendar,
  Trash2,
  ArrowLeft,
} from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function AdminAttendance() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // App State
  const [students, setStudents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  // Active View State
  const [viewState, setViewState] = useState("list"); // 'list', 'create', 'edit'
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("meet");
  const [eventDate, setEventDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [attendance, setAttendance] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const getToken = () =>
    localStorage.getItem("accessToken") || localStorage.getItem("access_token");

  // Check authorization
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Initial Data Load (Students & Past Events)
  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const token = getToken();

      // Fetch all students
      const studentRes = await fetch(`${API}/api/students`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!studentRes.ok) throw new Error("Failed to fetch students");
      const studentData = await studentRes.json();
      setStudents(Array.isArray(studentData) ? studentData : []);

      // Fetch unique past events
      const eventsRes = await fetch(`${API}/api/event-attendance/events/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        setPastEvents(Array.isArray(eventsData) ? eventsData : []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Fetch specific event attendance when editing
  const loadEventAttendance = async (name, date, type) => {
    try {
      setLoading(true);
      setEventName(name);
      setEventDate(date);
      setEventType(type);
      setViewState("edit");
      setSearchTerm("");

      const token = getToken();
      const res = await fetch(
        `${API}/api/event-attendance/event?name=${encodeURIComponent(
          name
        )}&date=${date}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        const data = await res.json();
        const attendanceMap = {};
        data?.forEach((record) => {
          attendanceMap[record.student_id] = record.status;
        });
        setAttendance(attendanceMap);
      }
    } catch (err) {
      console.error("Failed to load existing attendance", err);
      alert("Failed to load attendance for this event.");
    } finally {
      setLoading(false);
    }
  };

  // Delete an entire event
  const handleDeleteEvent = async (name, date, e) => {
    e.stopPropagation(); // Prevent triggering the row click
    if (
      !window.confirm(
        `Are you sure you want to delete "${name}"? This removes all attendance records for this event.`
      )
    ) {
      return;
    }

    try {
      setDeleting(true);
      const token = getToken();
      const res = await fetch(
        `${API}/api/event-attendance/event?name=${encodeURIComponent(
          name
        )}&date=${date}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to delete event");

      // Refresh the list
      await fetchInitialData();
      alert("Event deleted successfully!");
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message}`);
    } finally {
      setDeleting(false);
    }
  };

  const handleCreateNew = () => {
    setEventName("");
    setEventType("meet");
    setEventDate(new Date().toISOString().split("T")[0]);
    setAttendance({});
    setSearchTerm("");
    setViewState("create");
  };

  const handleBackToList = () => {
    setViewState("list");
    fetchInitialData(); // Refresh the list in case we just saved a new event
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === status ? null : status,
    }));
  };

  const handleMarkAll = (status) => {
    const newAttendance = { ...attendance };
    filteredStudents.forEach((student) => {
      newAttendance[student._id || student.id] = status;
    });
    setAttendance(newAttendance);
  };

  const handleSave = async () => {
    if (!eventName.trim()) {
      alert("Please provide an Event Name");
      return;
    }

    try {
      setSaving(true);
      const token = getToken();

      const savePromises = Object.entries(attendance).map(
        ([studentId, status]) => {
          return fetch(`${API}/api/event-attendance/mark`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              event_name: eventName,
              event_type: eventType,
              event_date: eventDate,
              student_id: studentId,
              status,
            }),
          }).then((res) => {
            if (!res.ok)
              throw new Error(`Failed to save for student ${studentId}`);
            return res.json();
          });
        }
      );

      await Promise.all(savePromises);
      alert("Attendance saved successfully!");
      if (viewState === "create") {
        setViewState("edit"); // Switch to edit mode so they don't create duplicates
      }
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: filteredStudents.length,
    present: filteredStudents.filter(
      (s) => attendance[s._id || s.id] === "present"
    ).length,
    absent: filteredStudents.filter(
      (s) => attendance[s._id || s.id] === "absent"
    ).length,
    leave: filteredStudents.filter((s) => attendance[s._id || s.id] === "leave")
      .length,
  };

  if (loading && students.length === 0) {
    return (
      <div className="flex h-screen bg-[#0d0d0d] text-white">
        <AdminSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <div className="flex-1 overflow-auto flex items-center justify-center">
          <p className="text-[#666]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0d0d0d] text-white">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 overflow-auto p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Event Attendance</h1>
            <p className="text-[#555] text-sm">
              Manage events and track student participation.
            </p>
          </div>
          {viewState === "list" ? (
            <button
              onClick={handleCreateNew}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 font-medium transition"
            >
              <Plus size={18} /> New Event
            </button>
          ) : (
            <button
              onClick={handleBackToList}
              className="px-4 py-2 bg-[#1f1f1f] hover:bg-[#2f2f2f] text-white rounded-lg flex items-center gap-2 font-medium transition"
            >
              <ArrowLeft size={18} /> Back to Events
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg border border-red-500 bg-red-500/10 text-red-400">
            {error}
          </div>
        )}

        {/* VIEW 1: PAST EVENTS LIST */}
        {viewState === "list" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4 text-[#ddd]">
              Past Events
            </h2>
            {pastEvents.length === 0 ? (
              <div className="p-6 rounded-lg border border-[#1f1f1f] bg-[#111111] text-center text-[#666]">
                No events found. Click "New Event" to start tracking attendance.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pastEvents.map((ev, index) => (
                  <div
                    key={index}
                    onClick={() =>
                      loadEventAttendance(ev.name, ev.date, ev.type)
                    }
                    className="p-5 rounded-xl border border-[#1f1f1f] bg-[#111111] hover:border-purple-500/50 cursor-pointer transition group relative"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-white truncate pr-6">
                        {ev.name}
                      </h3>
                      <button
                        onClick={(e) => handleDeleteEvent(ev.name, ev.date, e)}
                        disabled={deleting}
                        className="absolute top-4 right-4 text-[#555] hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                        title="Delete Event"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="flex gap-3 text-xs text-[#888]">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />{" "}
                        {new Date(ev.date).toLocaleDateString()}
                      </span>
                      <span className="capitalize px-2 py-0.5 bg-[#1f1f1f] rounded text-[#aaa]">
                        {ev.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: CREATE OR EDIT ATTENDANCE */}
        {(viewState === "create" || viewState === "edit") && (
          <>
            {/* Event Details Form */}
            <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-6 mb-8">
              <h2 className="text-lg font-semibold mb-4 text-purple-400">
                {viewState === "create" ? "Event Details" : "Editing Event"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm text-[#888] mb-2">
                    Event Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Spring Fest Prep"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    disabled={viewState === "edit"}
                    className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#333] focus:border-purple-500 focus:outline-none disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#888] mb-2">
                    Event Type
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#333] focus:border-purple-500 focus:outline-none"
                  >
                    <option value="meet">Regular Meet</option>
                    <option value="internal">Internal Event</option>
                    <option value="external">External Event</option>
                    <option value="workshop">Workshop</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[#888] mb-2">Date</label>
                  <div className="relative">
                    <Calendar
                      size={18}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#555]"
                    />
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      disabled={viewState === "edit"}
                      className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#333] focus:border-purple-500 focus:outline-none disabled:opacity-50"
                      style={{ colorScheme: "dark" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Attendance Tools */}
            <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="relative w-full md:w-96">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#555]"
                />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#111111] border border-[#1f1f1f] text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleMarkAll("present")}
                  className="px-4 py-2 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition text-sm font-medium"
                >
                  All Present
                </button>
                <button
                  onClick={() => handleMarkAll("absent")}
                  className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition text-sm font-medium"
                >
                  All Absent
                </button>
                <button
                  onClick={() => setAttendance({})}
                  className="px-4 py-2 rounded-lg bg-[#1f1f1f] text-[#aaa] hover:bg-[#2f2f2f] transition text-sm font-medium"
                >
                  Clear Selection
                </button>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              <div className="p-3 rounded-lg bg-[#111111] border border-[#1f1f1f] text-center">
                <p className="text-xs text-[#555] mb-1">Total</p>
                <p className="text-xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
                <p className="text-xs text-green-400 mb-1">Present</p>
                <p className="text-xl font-bold text-green-400">
                  {stats.present}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-center">
                <p className="text-xs text-red-400 mb-1">Absent</p>
                <p className="text-xl font-bold text-red-400">{stats.absent}</p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-center">
                <p className="text-xs text-yellow-400 mb-1">Leave</p>
                <p className="text-xl font-bold text-yellow-400">
                  {stats.leave}
                </p>
              </div>
            </div>

            {/* Students Table */}
            <div className="rounded-lg border border-[#1f1f1f] overflow-hidden mb-6">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#111111] border-b border-[#1f1f1f]">
                    <th className="px-6 py-3 text-left text-sm text-[#888]">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm text-[#888]">
                      Branch
                    </th>
                    <th className="px-6 py-3 text-left text-sm text-[#888]">
                      Attendance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => {
                    const studentId = student._id || student.id;
                    return (
                      <tr
                        key={studentId}
                        className="border-b border-[#1f1f1f] hover:bg-[#1a1a1a] transition"
                      >
                        <td className="px-6 py-4 text-sm text-white">
                          {student.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#666]">
                          {student.branch}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleAttendanceChange(studentId, "present")
                              }
                              className={`p-2 rounded ${
                                attendance[studentId] === "present"
                                  ? "bg-green-500 text-white"
                                  : "bg-[#1f1f1f] text-[#666] hover:bg-[#2f2f2f]"
                              }`}
                              title="Mark Present"
                            >
                              <Check size={18} />
                            </button>
                            <button
                              onClick={() =>
                                handleAttendanceChange(studentId, "absent")
                              }
                              className={`p-2 rounded ${
                                attendance[studentId] === "absent"
                                  ? "bg-red-500 text-white"
                                  : "bg-[#1f1f1f] text-[#666] hover:bg-[#2f2f2f]"
                              }`}
                              title="Mark Absent"
                            >
                              <X size={18} />
                            </button>
                            <button
                              onClick={() =>
                                handleAttendanceChange(studentId, "leave")
                              }
                              className={`p-2 rounded ${
                                attendance[studentId] === "leave"
                                  ? "bg-yellow-500 text-white"
                                  : "bg-[#1f1f1f] text-[#666] hover:bg-[#2f2f2f]"
                              }`}
                              title="Mark Leave"
                            >
                              <Download size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white flex items-center gap-2 font-medium"
            >
              <Save size={18} /> {saving ? "Saving..." : "Save Attendance"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
