import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import {
  Users,
  BookOpen,
  Calendar,
  Image,
  Mail,
  TrendingUp,
  Activity,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Fetch dashboard stats from backend
    const fetchStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`http://localhost:5000/api/admin/stats`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch stats");
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, navigate]);

  const StatCard = ({ icon: Icon, title, value, color, bgColor }) => (
    <div
      className="p-6 rounded-xl border"
      style={{
        background: bgColor,
        borderColor: color,
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[#888] text-sm font-medium mb-2">{title}</p>
          <h3 className="text-3xl font-bold" style={{ color: color }}>
            {value || 0}
          </h3>
        </div>
        <Icon size={28} style={{ color }} strokeWidth={1.5} />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex h-screen bg-[#0d0d0d] text-white">
        <AdminSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <div className="flex-1 overflow-auto">
          <div className="flex items-center justify-center h-full">
            <p className="text-lg text-[#666]">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0d0d0d] text-white">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 overflow-auto">
        <div className="p-8 min-h-screen" style={{ background: "#0d0d0d" }}>
          {/* Header */}
          <div className="mb-8">
            <h1
              className="text-4xl font-bold text-white mb-2"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Dashboard
            </h1>
            <p className="text-[#555] text-sm">
              Welcome back, {user?.email || "Admin"}! Here's what's happening.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg border border-red-500 bg-red-500/10 text-red-400">
              <p>Error loading stats: {error}</p>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <StatCard
              icon={Users}
              title="Total Students"
              value={stats?.totalStudents}
              color="#10b981"
              bgColor="rgba(16, 185, 129, 0.08)"
            />
            <StatCard
              icon={BookOpen}
              title="Total Blogs"
              value={stats?.totalBlogs}
              color="#6366f1"
              bgColor="rgba(99, 102, 241, 0.08)"
            />
            <StatCard
              icon={Calendar}
              title="Total Events"
              value={stats?.totalEvents}
              color="#f59e0b"
              bgColor="rgba(245, 158, 11, 0.08)"
            />
            <StatCard
              icon={Image}
              title="Gallery Photos"
              value={stats?.totalPhotos}
              color="#ec4899"
              bgColor="rgba(236, 72, 153, 0.08)"
            />
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <StatCard
              icon={Mail}
              title="Total Newsletters"
              value={stats?.totalNewsletters}
              color="#a855f7"
              bgColor="rgba(168, 85, 247, 0.08)"
            />
            <StatCard
              icon={Activity}
              title="Active Members"
              value={stats?.activeMembers}
              color="#06b6d4"
              bgColor="rgba(6, 182, 212, 0.08)"
            />
          </div>

          {/* Quick Actions */}
          <div className="mt-12">
            <h2
              className="text-xl font-bold text-white mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => navigate("/admin/students")}
                className="p-4 rounded-lg border transition-all hover:border-green-500 hover:shadow-lg hover:shadow-green-500/20"
                style={{ borderColor: "#1f1f1f", background: "#0d0d0d" }}
              >
                <Users size={24} className="mb-2 text-green-500" />
                <h3 className="text-sm font-semibold text-white">
                  Manage Students
                </h3>
                <p className="text-xs text-[#666] mt-1">
                  View and edit student data
                </p>
              </button>

              <button
                onClick={() => navigate("/admin/events")}
                className="p-4 rounded-lg border transition-all hover:border-yellow-500 hover:shadow-lg hover:shadow-yellow-500/20"
                style={{ borderColor: "#1f1f1f", background: "#0d0d0d" }}
              >
                <Calendar size={24} className="mb-2 text-yellow-500" />
                <h3 className="text-sm font-semibold text-white">
                  Manage Events
                </h3>
                <p className="text-xs text-[#666] mt-1">
                  Create and update events
                </p>
              </button>

              <button
                onClick={() => navigate("/admin/blogs")}
                className="p-4 rounded-lg border transition-all hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20"
                style={{ borderColor: "#1f1f1f", background: "#0d0d0d" }}
              >
                <BookOpen size={24} className="mb-2 text-blue-500" />
                <h3 className="text-sm font-semibold text-white">
                  Manage Blogs
                </h3>
                <p className="text-xs text-[#666] mt-1">
                  Approve and manage blogs
                </p>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-12">
            <h2
              className="text-xl font-bold text-white mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              System Info
            </h2>
            <div
              className="p-6 rounded-lg border"
              style={{ background: "#111111", borderColor: "#1f1f1f" }}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[#888]">Admin Email:</span>
                  <span className="text-white">{user?.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#888]">User ID:</span>
                  <span className="text-white text-sm font-mono">
                    {user?.id}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#888]">Last Updated:</span>
                  <span className="text-white">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
