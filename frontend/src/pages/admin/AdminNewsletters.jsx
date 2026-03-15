import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Download, Plus } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";

const API = "http://localhost:5000/api/newsletters";

export default function AdminNewsletters() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [newsletters, setNewsletters] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [form, setForm] = useState({ title: "", file: null });
  const [loading, setLoading] = useState(true);
  const fileRef = useRef();

  const getToken = () => localStorage.getItem("access_token");

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

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setForm((f) => ({ ...f, file }));
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) setForm((f) => ({ ...f, file }));
  };

  const handleUpload = async () => {
    if (!form.title || !form.file) return;

    setUploading(true);
    try {
      // In production, upload to storage service (S3, Supabase Storage, etc.)
      // For now, we'll simulate with a data URL
      const fileSize = form.file.size;
      const fileSizeDisplay = `${(fileSize / 1024 / 1024).toFixed(1)} MB`;

      // TODO: Upload file to storage and get URL
      const file_url = "#"; // Replace with actual upload URL

      const res = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          title: form.title,
          file_url,
          file_size: fileSizeDisplay,
        }),
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setNewsletters((prev) => [data.newsletter, ...prev]);
      setForm({ title: "", file: null });
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload newsletter");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this newsletter?")) return;

    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (!res.ok) throw new Error("Delete failed");

      setNewsletters((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete newsletter");
    }
  };

  const handleDownload = async (id) => {
    try {
      await fetch(`${API}/${id}/download`, { method: "POST" });
      // TODO: Download the file
    } catch (err) {
      console.error("Download error:", err);
    }
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
        <div className="p-8 min-h-screen" style={{ background: "#0d0d0d" }}>
          <div className="mb-8">
            <h1
              className="text-3xl font-bold text-white"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Newsletter Management
            </h1>
            <p className="text-[#555] text-sm mt-1">
              Upload and manage society newsletters for members
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upload Panel */}
            <div className="lg:col-span-1">
              <div
                className="rounded-xl border p-6"
                style={{ background: "#111", borderColor: "#1f1f1f" }}
              >
                <h2
                  className="text-white font-semibold mb-5"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Upload Newsletter
                </h2>

                <div className="mb-4">
                  <label className="text-[#666] text-xs mb-1.5 block">
                    Newsletter Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Monthly Digest - March 2025"
                    value={form.title}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, title: e.target.value }))
                    }
                    className="w-full px-3 py-2.5 rounded-lg text-sm text-white outline-none border focus:border-purple-500 transition-colors"
                    style={{ background: "#0d0d0d", borderColor: "#2a2a2a" }}
                  />
                </div>

                <div
                  onDragOver={() => setDragOver(true)}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className="mb-4 p-4 rounded-lg border-2 border-dashed text-center cursor-pointer transition-colors"
                  style={{
                    borderColor: dragOver ? "#a855f7" : "#2a2a2a",
                    background: dragOver ? "#a855f710" : "#0d0d0d",
                  }}
                  onClick={() => fileRef.current?.click()}
                >
                  <Plus size={24} className="mx-auto mb-2 text-[#555]" />
                  <p className="text-[#555] text-xs">
                    {form.file ? form.file.name : "Drop PDF here or click"}
                  </p>
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </div>

                {uploadSuccess && (
                  <div className="mb-4 p-3 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 text-sm">
                    ✓ Newsletter uploaded successfully!
                  </div>
                )}

                <button
                  onClick={handleUpload}
                  disabled={uploading || !form.title || !form.file}
                  className="w-full px-4 py-2.5 rounded-lg font-semibold text-sm transition-all disabled:opacity-50"
                  style={{
                    background: "linear-gradient(135deg, #a855f7, #6366f1)",
                    color: "white",
                  }}
                >
                  {uploading ? "Uploading..." : "Upload Newsletter"}
                </button>
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
                Recent Newsletters ({newsletters.length})
              </h2>

              {newsletters.length === 0 ? (
                <p className="text-[#555] text-sm text-center py-8">
                  No newsletters yet
                </p>
              ) : (
                <div className="space-y-3">
                  {newsletters.map((newsletter) => (
                    <div
                      key={newsletter.id}
                      className="flex items-center justify-between p-4 rounded-lg hover:bg-[#0d0d0d] transition-colors border"
                      style={{ borderColor: "#1f1f1f" }}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">
                          {newsletter.title}
                        </p>
                        <p className="text-[#555] text-xs mt-1">
                          {new Date(newsletter.created_at).toLocaleDateString()}{" "}
                          · {newsletter.downloads || 0} downloads
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleDownload(newsletter.id)}
                          className="p-2 rounded-lg hover:bg-[#1f1f1f] transition-colors"
                        >
                          <Download size={18} className="text-[#666]" />
                        </button>
                        <button
                          onClick={() => handleDelete(newsletter.id)}
                          className="p-2 rounded-lg hover:bg-red-500/20 transition-colors"
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
