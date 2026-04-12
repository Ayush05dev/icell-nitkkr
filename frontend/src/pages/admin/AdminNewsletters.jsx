import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, ExternalLink, Edit2 } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const API = `${BASE_URL}/api/newsletters`;

export default function AdminNewsletters() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [newsletters, setNewsletters] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [form, setForm] = useState({ title: "", link: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const getToken = () => localStorage.getItem("accessToken");

  // Fetch newsletters
  useEffect(() => {
    const fetchNewsletters = async () => {
      try {
        const res = await fetch(API);
        const data = await res.json();
        setNewsletters(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching newsletters:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNewsletters();
  }, []);

  // Validate Google Drive URL
  const isValidGoogleDriveLink = (url) => {
    if (!url || typeof url !== "string") return false;
    const trimmedUrl = url.trim();
    return (
      trimmedUrl.includes("drive.google.com") ||
      trimmedUrl.includes("docs.google.com")
    );
  };

  const handleUpload = async () => {
    if (!form.title || !form.link) {
      setUploadError("Please fill in all fields");
      return;
    }

    if (!isValidGoogleDriveLink(form.link)) {
      setUploadError(
        "Invalid Google Drive link. Please use a drive.google.com or docs.google.com link"
      );
      return;
    }

    setUploading(true);
    setUploadError("");

    try {
      const method = editingId ? "PATCH" : "POST";
      const endpoint = editingId ? `${API}/${editingId}` : API;

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          title: form.title,
          link: form.link,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save newsletter");
      }

      const data = await res.json();

      if (editingId) {
        setNewsletters((prev) =>
          prev.map((n) => (n._id === editingId ? data.newsletter : n))
        );
        setEditingId(null);
      } else {
        setNewsletters((prev) => [data.newsletter, ...prev]);
      }

      setForm({ title: "", link: "" });
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err) {
      console.error("Error:", err);
      setUploadError(err.message || "Failed to save newsletter");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (newsletter) => {
    setEditingId(newsletter._id);
    setForm({ title: newsletter.title, link: newsletter.file_url });
    setUploadError("");
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ title: "", link: "" });
    setUploadError("");
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this newsletter?")) return;

    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (!res.ok) throw new Error("Delete failed");

      setNewsletters((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete newsletter");
    }
  };

  const handleOpenLink = (url) => {
    window.open(url, "_blank");
  };

  if (loading) {
    return (
      <div className="p-8 min-h-screen" style={{ background: "#0d0d0d" }}>
        <p className="text-white text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0d0d0d] text-white">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 overflow-auto">
        <div
          className="p-8 min-h-screen max-md:pt-20"
          style={{ background: "#0d0d0d" }}
        >
          <div className="mb-8">
            <h1
              className="text-3xl font-bold text-white"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Newsletter Management
            </h1>
            <p className="text-[#555] text-sm mt-1">
              Create and manage society newsletters with Google Drive links
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Add/Edit Panel */}
            <div className="lg:col-span-1">
              <div
                className="rounded-xl border p-6 sticky top-6"
                style={{ background: "#111", borderColor: "#1f1f1f" }}
              >
                <h2
                  className="text-white font-semibold mb-5"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {editingId ? "Edit Newsletter" : "Add Newsletter"}
                </h2>

                <div className="mb-4">
                  <label className="text-[#666] text-xs mb-1.5 block font-medium">
                    Newsletter Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Monthly Digest - March 2026"
                    value={form.title}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, title: e.target.value }))
                    }
                    className="w-full px-3 py-2.5 rounded-lg text-sm text-white outline-none border transition-colors"
                    style={{
                      background: "#0d0d0d",
                      borderColor: form.title ? "#a855f7" : "#2a2a2a",
                    }}
                  />
                </div>

                <div className="mb-4">
                  <label className="text-[#666] text-xs mb-1.5 block font-medium">
                    Google Drive Link *
                  </label>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/file/d/..."
                    value={form.link}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, link: e.target.value }))
                    }
                    className="w-full px-3 py-2.5 rounded-lg text-sm text-white outline-none border transition-colors"
                    style={{
                      background: "#0d0d0d",
                      borderColor: form.link ? "#a855f7" : "#2a2a2a",
                    }}
                  />
                  <p className="text-[#555] text-xs mt-2 leading-relaxed">
                    📌 Get shareable link from Google Drive: Right-click file →
                    Share → Copy link
                  </p>
                </div>

                {uploadError && (
                  <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
                    ⚠ {uploadError}
                  </div>
                )}

                {uploadSuccess && (
                  <div className="mb-4 p-3 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 text-sm">
                    ✓ Newsletter saved successfully!
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={handleUpload}
                    disabled={uploading || !form.title || !form.link}
                    className="flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: "linear-gradient(135deg, #a855f7, #6366f1)",
                      color: "white",
                    }}
                  >
                    {uploading ? "Saving..." : editingId ? "Update" : "Add"}
                  </button>
                  {editingId && (
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2.5 rounded-lg font-semibold text-sm border transition-all hover:bg-[#1f1f1f]"
                      style={{ borderColor: "#2a2a2a", color: "#666" }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Newsletter List */}
            <div
              className="lg:col-span-2 rounded-xl border p-6"
              style={{ background: "#111", borderColor: "#1f1f1f" }}
            >
              <h2
                className="text-white font-semibold mb-5"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Newsletters ({newsletters.length})
              </h2>

              {newsletters.length === 0 ? (
                <div
                  className="p-12 text-center rounded-lg"
                  style={{ background: "#0d0d0d" }}
                >
                  <p className="text-[#555] text-sm">
                    No newsletters yet. Create one to get started!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {newsletters.map((newsletter) => (
                    <div
                      key={newsletter._id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-lg transition-all border"
                      style={{
                        borderColor: "#1f1f1f",
                        background:
                          editingId === newsletter._id
                            ? "#1a1a1a"
                            : "transparent",
                      }}
                    >
                      <div className="flex-1 min-w-0 mb-3 sm:mb-0">
                        <p className="text-white font-medium truncate">
                          {newsletter.title}
                        </p>
                        <p className="text-[#555] text-xs mt-1">
                          {new Date(newsletter.created_at).toLocaleDateString()}{" "}
                          · {newsletter.downloads || 0} opens
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenLink(newsletter.file_url)}
                          className="p-2 rounded-lg hover:bg-blue-500/20 transition-colors"
                          title="Open in Google Drive"
                        >
                          <ExternalLink size={18} className="text-blue-400" />
                        </button>
                        <button
                          onClick={() => handleEdit(newsletter)}
                          className="p-2 rounded-lg hover:bg-yellow-500/20 transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} className="text-yellow-400" />
                        </button>
                        <button
                          onClick={() => handleDelete(newsletter._id)}
                          className="p-2 rounded-lg hover:bg-red-500/20 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} className="text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
