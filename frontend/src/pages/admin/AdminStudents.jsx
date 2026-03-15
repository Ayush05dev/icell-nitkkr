import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import api from "../../services/api";
import {
  Plus,
  Search,
  Trash2,
  Award,
  ChevronDown,
  X,
  Check,
} from "lucide-react";

const BRANCHES = ["CSE", "ECE", "ME", "CIVIL", "EEE", "BT"];
const YEARS = ["1st", "2nd", "3rd", "4th"];
const POSITIONS = [
  "President",
  "Vice President",
  "Secretary",
  "Treasurer",
  "Event Lead",
  "Design Lead",
  "Tech Lead",
  "Member",
];

export default function AdminStudents() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [promotePosition, setPromotePosition] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    branch: "",
    year: "",
    roll_number: "",
  });

  // Check admin access
  useEffect(() => {
    if (!user || (user.role !== "admin" && user.role !== "post_holder")) {
      navigate("/");
      return;
    }
  }, [user, navigate]);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/auth/students");
      setStudents(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const filterStudents = useCallback(
    (data = students) => {
      let filtered = data;

      if (searchTerm) {
        filtered = filtered.filter(
          (s) =>
            s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.roll_number?.includes(searchTerm)
        );
      }

      if (selectedBranch) {
        filtered = filtered.filter((s) => s.branch === selectedBranch);
      }

      if (selectedYear) {
        filtered = filtered.filter((s) => s.year === selectedYear);
      }

      setFilteredStudents(filtered);
    },
    [searchTerm, selectedBranch, selectedYear, students]
  );

  // Fetch students
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    filterStudents(students);
  }, [searchTerm, selectedBranch, selectedYear, students, filterStudents]);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/students", formData);
      setShowAddModal(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        branch: "",
        year: "",
        roll_number: "",
      });
      fetchStudents();
    } catch (err) {
      console.error("Error adding student:", err);
      alert("Failed to add student");
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (!confirm("Are you sure you want to delete this student?")) return;

    try {
      await api.delete(`/students/${studentId}`);
      fetchStudents();
    } catch (err) {
      console.error("Error deleting student:", err);
      alert("Failed to delete student");
    }
  };

  const handlePromoteStudent = async () => {
    if (!promotePosition) {
      alert("Please select a position");
      return;
    }

    try {
      await api.post("/admin/promote-member", {
        memberId: selectedStudent._id,
        newRole: "post_holder",
      });
      setShowPromoteModal(false);
      setSelectedStudent(null);
      setPromotePosition("");
      fetchStudents();
    } catch (err) {
      console.error("Error promoting student:", err);
      alert("Failed to promote student");
    }
  };

  const handleDemoteStudent = async (studentId) => {
    try {
      await api.post("/admin/promote-member", {
        memberId: studentId,
        newRole: "member",
      });
      fetchStudents();
    } catch (err) {
      console.error("Error demoting student:", err);
      alert("Failed to demote student");
    }
  };

  if (loading) {
    return (
      <div className="p-8 min-h-screen bg-[#0d0d0d]">
        <div className="text-white">Loading students...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0d0d0d] text-white">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 overflow-auto">
        <div className="p-8 min-h-screen" style={{ background: "#0d0d0d" }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1
                className="text-3xl font-bold text-white"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Student Management
              </h1>
              <p className="text-[#555] text-sm mt-1">
                Manage all students, branches, and roles
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-all"
            >
              <Plus size={20} />
              Add Student
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#555]"
              />
              <input
                type="text"
                placeholder="Search by name, email, or roll number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#111111] border border-[#1f1f1f] text-white placeholder-[#555] focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Branch Filter */}
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="px-4 py-2 rounded-lg bg-[#111111] border border-[#1f1f1f] text-white focus:outline-none focus:border-purple-500"
            >
              <option value="">All Branches</option>
              {BRANCHES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>

            {/* Year Filter */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 rounded-lg bg-[#111111] border border-[#1f1f1f] text-white focus:outline-none focus:border-purple-500"
            >
              <option value="">All Years</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Students Table */}
          <div
            className="rounded-xl border overflow-hidden"
            style={{ background: "#111111", borderColor: "#1f1f1f" }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid #1f1f1f" }}>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                      Branch
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                      Year
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                      Roll Number
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                      Role
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr
                      key={student._id}
                      style={{ borderBottom: "1px solid #1f1f1f" }}
                      className="hover:bg-[#0d0d0d] transition"
                    >
                      <td className="px-6 py-4 text-sm text-white font-medium">
                        {student.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#555]">
                        {student.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#555]">
                        {student.branch || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#555]">
                        {student.year || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#555]">
                        {student.roll_number || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {student.role === "post_holder" ? (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                            {student.post_position || "Post Holder"}
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                            Member
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {student.role === "post_holder" ? (
                            <button
                              onClick={() => handleDemoteStudent(student._id)}
                              className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 transition text-xs"
                              title="Demote"
                            >
                              Demote
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedStudent(student);
                                setShowPromoteModal(true);
                              }}
                              className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition"
                              title="Promote to Post Holder"
                            >
                              <Award size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#555]">No students found</p>
            </div>
          )}

          {/* Add Student Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div
                className="rounded-2xl border p-8 w-full max-w-md"
                style={{ background: "#111111", borderColor: "#1f1f1f" }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    Add New Student
                  </h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-[#555] hover:text-white"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleAddStudent} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-[#0d0d0d] border border-[#1f1f1f] text-white placeholder-[#555] focus:outline-none focus:border-purple-500"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-[#0d0d0d] border border-[#1f1f1f] text-white placeholder-[#555] focus:outline-none focus:border-purple-500"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-[#0d0d0d] border border-[#1f1f1f] text-white placeholder-[#555] focus:outline-none focus:border-purple-500"
                  />
                  <input
                    type="text"
                    placeholder="Roll Number"
                    value={formData.roll_number}
                    onChange={(e) =>
                      setFormData({ ...formData, roll_number: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-[#0d0d0d] border border-[#1f1f1f] text-white placeholder-[#555] focus:outline-none focus:border-purple-500"
                  />
                  <select
                    value={formData.branch}
                    onChange={(e) =>
                      setFormData({ ...formData, branch: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-[#0d0d0d] border border-[#1f1f1f] text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="">Select Branch</option>
                    {BRANCHES.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                  <select
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({ ...formData, year: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg bg-[#0d0d0d] border border-[#1f1f1f] text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="">Select Year</option>
                    {YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 px-4 py-2 rounded-lg bg-[#0d0d0d] border border-[#1f1f1f] text-white hover:border-[#2f2f2f] transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition font-medium"
                    >
                      Add Student
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Promote Modal */}
          {showPromoteModal && selectedStudent && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div
                className="rounded-2xl border p-8 w-full max-w-md"
                style={{ background: "#111111", borderColor: "#1f1f1f" }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    Promote Student
                  </h2>
                  <button
                    onClick={() => setShowPromoteModal(false)}
                    className="text-[#555] hover:text-white"
                  >
                    <X size={24} />
                  </button>
                </div>

                <p className="text-[#555] mb-4">
                  Promote {selectedStudent.name} to Post Holder
                </p>

                <select
                  value={promotePosition}
                  onChange={(e) => setPromotePosition(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-[#0d0d0d] border border-[#1f1f1f] text-white focus:outline-none focus:border-purple-500 mb-6"
                >
                  <option value="">Select Position</option>
                  {POSITIONS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowPromoteModal(false)}
                    className="flex-1 px-4 py-2 rounded-lg bg-[#0d0d0d] border border-[#1f1f1f] text-white hover:border-[#2f2f2f] transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePromoteStudent}
                    className="flex-1 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition font-medium"
                  >
                    Promote
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
