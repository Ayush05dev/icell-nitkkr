import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import {
  Award,
  Plus,
  Search,
  Download,
  Trash2,
  Eye,
  Filter,
} from "lucide-react";

export default function AdminCertificates() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    student_id: "",
    title: "",
    event: "",
    issued_date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (!user || (user.role !== "admin" && user.role !== "post_holder")) {
      navigate("/");
      return;
    }

    const fetchCertificates = async () => {
      try {
        // Fetch certificates via API
        try {
          const response = await api.get("/certificates");
          setCertificates(response.data || []);
        } catch (err) {
          console.warn("Could not fetch certificates:", err);
          setCertificates([]);
        }
      } catch (err) {
        console.error("Error fetching certificates:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [user, navigate]);

  const handleAddCertificate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/certificates", {
        ...formData,
        issued_by: user.id,
      });

      // Refresh certificates
      const response = await api.get("/certificates");
      setCertificates(response.data || []);
      setShowModal(false);
      setFormData({
        student_id: "",
        title: "",
        event: "",
        issued_date: new Date().toISOString().split("T")[0],
      });
    } catch (err) {
      console.error("Error adding certificate:", err);
      alert("Failed to add certificate");
    }
  };

  const handleDeleteCertificate = async (id) => {
    if (!confirm("Are you sure you want to delete this certificate?")) return;

    try {
      await api.delete(`/certificates/${id}`);
      setCertificates(certificates.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error deleting certificate:", err);
      alert("Failed to delete certificate");
    }
  };

  const filteredCertificates = certificates.filter((cert) => {
    const matchesSearch =
      cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.student?.name.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedFilter === "pending") return matchesSearch && cert.is_pending;
    if (selectedFilter === "issued") return matchesSearch && !cert.is_pending;
    return matchesSearch;
  });

  return (
    <div
      className="flex h-screen bg-[#0d0d0d] text-white"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-1">Certificates</h1>
              <p className="text-[#555]">
                Manage student certificates & awards
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 md:mt-0 flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all"
              style={{
                background: "#a855f730",
                color: "#a855f7",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#a855f740";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#a855f730";
              }}
            >
              <Plus size={18} />
              New Certificate
            </button>
          </div>

          {/* Search & Filter */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-3 text-[#555]" />
              <input
                type="text"
                placeholder="Search by title, event, or student..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#111111] border border-[#1f1f1f] text-white placeholder-[#555] focus:outline-none focus:border-[#a855f7]"
              />
            </div>
            <button
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg border"
              style={{ borderColor: "#1f1f1f" }}
            >
              <Filter size={18} />
              <span className="hidden md:inline">Filter</span>
            </button>
          </div>

          {/* Certificates Table */}
          {loading ? (
            <div className="text-center py-12">
              <div className="text-[#555]">Loading certificates...</div>
            </div>
          ) : filteredCertificates.length > 0 ? (
            <div
              className="rounded-xl border overflow-hidden"
              style={{ borderColor: "#1f1f1f" }}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr
                      style={{
                        background: "#111111",
                        borderBottom: "1px solid #1f1f1f",
                      }}
                    >
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#555] uppercase">
                        Title
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#555] uppercase">
                        Student
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#555] uppercase">
                        Event
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#555] uppercase">
                        Date
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-[#555] uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCertificates.map((cert) => (
                      <tr
                        key={cert.id}
                        className="border-t hover:bg-[#111111] transition-colors"
                        style={{ borderColor: "#1f1f1f" }}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="p-2 rounded-lg"
                              style={{ background: "#f59e0b15" }}
                            >
                              <Award size={16} style={{ color: "#f59e0b" }} />
                            </div>
                            <div>
                              <p className="font-medium">{cert.title}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium">
                              {cert.student?.name || "N/A"}
                            </p>
                            <p className="text-[#555] text-sm">
                              {cert.student?.roll_number || ""}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[#999]">{cert.event}</td>
                        <td className="px-6 py-4 text-[#999]">
                          {new Date(cert.issued_date).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              className="p-2 rounded-lg hover:bg-[#1f1f1f] transition-colors"
                              title="View"
                            >
                              <Eye size={16} className="text-[#0ea5e9]" />
                            </button>
                            <button
                              onClick={() => handleDeleteCertificate(cert.id)}
                              className="p-2 rounded-lg hover:bg-[#1f1f1f] transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={16} className="text-[#ef4444]" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div
              className="rounded-xl border p-12 text-center"
              style={{ borderColor: "#1f1f1f" }}
            >
              <Award size={40} className="mx-auto mb-4 text-[#555]" />
              <p className="text-[#555]">No certificates found</p>
              <p className="text-[#444] text-sm mt-1">
                Create your first certificate by clicking "New Certificate"
                above
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div
            className="bg-[#111111] rounded-xl border p-6 max-w-md w-full"
            style={{ borderColor: "#1f1f1f" }}
          >
            <h2 className="text-xl font-bold mb-4">Add New Certificate</h2>

            <form onSubmit={handleAddCertificate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Student ID
                </label>
                <input
                  type="text"
                  required
                  value={formData.student_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      student_id: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg bg-[#0d0d0d] border border-[#1f1f1f] text-white focus:outline-none focus:border-[#a855f7]"
                  placeholder="Enter student ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Certificate Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg bg-[#0d0d0d] border border-[#1f1f1f] text-white focus:outline-none focus:border-[#a855f7]"
                  placeholder="e.g., Python Fundamentals"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Event</label>
                <input
                  type="text"
                  required
                  value={formData.event}
                  onChange={(e) =>
                    setFormData({ ...formData, event: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg bg-[#0d0d0d] border border-[#1f1f1f] text-white focus:outline-none focus:border-[#a855f7]"
                  placeholder="e.g., Tech Workshop"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <input
                  type="date"
                  required
                  value={formData.issued_date}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      issued_date: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg bg-[#0d0d0d] border border-[#1f1f1f] text-white focus:outline-none focus:border-[#a855f7]"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg border transition-colors"
                  style={{ borderColor: "#1f1f1f" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-lg font-medium transition-all"
                  style={{
                    background: "#a855f730",
                    color: "#a855f7",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#a855f740";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#a855f730";
                  }}
                >
                  Add Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
