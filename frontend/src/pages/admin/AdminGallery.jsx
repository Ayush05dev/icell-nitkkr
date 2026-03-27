import { useState, useEffect, useRef } from "react";
import { Trash2, Plus, AlertCircle } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const API = `${BASE_URL}/api/gallery`;
const CLOUDINARY_CLOUD_NAME = "dpgkl1wq4";
const CLOUDINARY_UPLOAD_PRESET = "icell-webite-gallery-upload";

export default function AdminGallery() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [photos, setPhotos] = useState([]);
  const [tags, setTags] = useState([]);
  const [filter, setFilter] = useState("All");
  const [showUpload, setShowUpload] = useState(false);
  const [form, setForm] = useState({
    title: "",
    event: "",
    imageUrl: "", // preview only
    file: null,
  });
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef();

  const getToken = () => localStorage.getItem("accessToken");

  // Fetch photos and tags
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [photosRes, tagsRes] = await Promise.all([
          fetch(API),
          fetch(`${API}/tags`),
        ]);

        const photosData = await photosRes.json();
        const tagsData = await tagsRes.json();

        setPhotos(Array.isArray(photosData) ? photosData : []);
        setTags(["All", ...(Array.isArray(tagsData) ? tagsData : [])]);
      } catch (err) {
        console.error("Error fetching gallery:", err);
        setError("Failed to load gallery");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filtered =
    filter === "All" ? photos : photos.filter((p) => p.event === filter);

  const handleFileSelect = (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    setError("");
    const reader = new FileReader();
    reader.onload = (e) =>
      setForm((f) => ({ ...f, file, imageUrl: e.target.result }));
    reader.readAsDataURL(file);
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Cloudinary upload failed");
      }

      const data = await response.json();
      return {
        url: data.secure_url,
        public_id: data.public_id,
      };
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      throw new Error("Failed to upload to cloud storage");
    }
  };

  const handleUpload = async () => {
    if (!form.title || !form.file) {
      setError("Title and image are required");
      return;
    }

    setUploading(true);
    setError("");

    try {
      // Step 1: Upload to Cloudinary
      const cloudinaryData = await uploadToCloudinary(form.file);

      // Step 2: Send metadata + Cloudinary URL to backend
      const res = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          title: form.title,
          event: form.event || "Other",
          cloudinary_url: cloudinaryData.url,
          cloudinary_public_id: cloudinaryData.public_id,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await res.json();

      // Add new photo to gallery
      setPhotos((prev) => [data.photo, ...prev]);

      // Reset form
      setForm({ title: "", event: "", imageUrl: "", file: null });
      setShowUpload(false);
      setError("");

      // Update tags if new event added
      if (form.event && !tags.includes(form.event) && form.event !== "Other") {
        setTags((prev) => [...prev.slice(0, 1), form.event, ...prev.slice(1)]);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };

  const deletePhoto = async (id) => {
    if (!confirm("Delete this photo?")) return;

    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      // Remove from local state using _id
      setPhotos((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete photo");
    }
  };

  const exportJSON = () => {
    const data = photos.map(({ _id, title, event, imageUrl }) => ({
      id: _id,
      title,
      event,
      image_url: imageUrl,
    }));
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gallery.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="p-8 min-h-screen" style={{ background: "#0d0d0d" }}>
        <p className="text-white text-lg">Loading gallery...</p>
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
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files[0])}
          />

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1
                className="text-3xl font-bold text-white"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Gallery Management
              </h1>
              <p className="text-[#555] text-sm mt-1">
                Manage event photos for the gallery page (powered by Cloudinary)
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={exportJSON}
                className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                style={{
                  background: "#1a1a1a",
                  color: "#888",
                  border: "1px solid #2a2a2a",
                }}
              >
                ↓ Export JSON
              </button>
              <button
                onClick={() => setShowUpload(true)}
                className="px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #a855f7, #6366f1)",
                  color: "white",
                }}
              >
                + Upload Photo
              </button>
            </div>
          </div>

          {/* Upload Modal */}
          {showUpload && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-[#111] rounded-xl border border-[#1f1f1f] p-6 max-w-md w-full">
                <h2 className="text-white font-bold mb-4">
                  Upload Photo to Cloudinary
                </h2>

                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex gap-2">
                    <AlertCircle
                      size={18}
                      className="text-red-500 flex-shrink-0 mt-0.5"
                    />
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <input
                  type="text"
                  placeholder="Photo title"
                  value={form.title}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, title: e.target.value }));
                    setError("");
                  }}
                  className="w-full px-3 py-2 rounded-lg mb-3 text-sm text-white"
                  style={{
                    background: "#0d0d0d",
                    borderColor: "#2a2a2a",
                    border: "1px solid #2a2a2a",
                  }}
                />

                <select
                  value={form.event}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, event: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg mb-3 text-sm text-white"
                  style={{
                    background: "#0d0d0d",
                    borderColor: "#2a2a2a",
                    border: "1px solid #2a2a2a",
                  }}
                >
                  <option value="">Select event tag</option>
                  {tags
                    .filter((t) => t !== "All")
                    .map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  <option value="Other">Other</option>
                </select>

                <div
                  onDragOver={() => setDragOver(true)}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    handleFileSelect(e.dataTransfer.files[0]);
                  }}
                  className="mb-4 p-4 rounded-lg border-2 border-dashed text-center cursor-pointer"
                  style={{
                    borderColor: dragOver ? "#a855f7" : "#2a2a2a",
                    background: dragOver ? "#a855f710" : "#0d0d0d",
                  }}
                  onClick={() => fileRef.current?.click()}
                >
                  <Plus size={24} className="mx-auto mb-2 text-[#555]" />
                  <p className="text-[#555] text-xs">
                    {form.file ? form.file.name : "Drop image here or click"}
                  </p>
                  <p className="text-[#333] text-xs mt-1">Max 5MB</p>
                </div>

                {form.imageUrl && (
                  <div className="mb-4 rounded-lg overflow-hidden border border-[#2a2a2a] h-32">
                    <img
                      src={form.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowUpload(false);
                      setError("");
                      setForm({
                        title: "",
                        event: "",
                        imageUrl: "",
                        file: null,
                      });
                    }}
                    className="flex-1 px-4 py-2 rounded-lg text-sm font-medium"
                    style={{ background: "#1a1a1a", color: "#888" }}
                    disabled={uploading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={uploading || !form.title || !form.file}
                    className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
                    style={{
                      background: "linear-gradient(135deg, #a855f7, #6366f1)",
                      color: "white",
                    }}
                  >
                    {uploading ? "Uploading..." : "Upload"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Filter Tags */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setFilter(tag)}
                className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
                style={{
                  background: filter === tag ? "#a855f7" : "#1a1a1a",
                  color: filter === tag ? "white" : "#888",
                  border: filter === tag ? "none" : "1px solid #2a2a2a",
                }}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-[#555]">
              <p>No photos yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((photo) => (
                <div
                  key={photo._id}
                  className="rounded-lg overflow-hidden border border-[#1f1f1f] hover:border-[#a855f7] transition-colors group"
                >
                  <div className="relative h-48 overflow-hidden bg-[#1a1a1a]">
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => deletePhoto(photo._id)}
                        className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30"
                      >
                        <Trash2 size={18} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-white font-medium text-sm truncate">
                      {photo.title}
                    </p>
                    <p className="text-[#555] text-xs mt-1">{photo.event}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
