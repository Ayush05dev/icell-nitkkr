import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { LogOut } from "lucide-react";
import ProfileCard from "../../components/profile/ProfileCard";
import AttendanceCard from "../../components/profile/AttendanceCard";
import AccountInfoCard from "../../components/profile/AccountInfoCard";
import CertificatesCard from "../../components/profile/CertificatesCard";

export default function MemberProfile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const profileResponse = await api.get("/auth/profile");
        setProfile(profileResponse.data);

        try {
          const attendanceResponse = await api.get("/attendance");
          const attendanceData = attendanceResponse.data || [];
          const total = attendanceData.length;
          const present = attendanceData.filter(
            (d) => d.status === "present"
          ).length;
          setAttendance({
            total,
            present,
            percentage: total > 0 ? ((present / total) * 100).toFixed(1) : 0,
          });
        } catch (err) {
          console.warn("Could not fetch attendance:", err);
          setAttendance({ total: 0, present: 0, percentage: 0 });
        }

        setCertificates([
          {
            id: 1,
            title: "Python Fundamentals",
            event: "Tech Workshop 2025",
            date: "Mar 10, 2025",
            pending: false,
          },
          {
            id: 2,
            title: "Web Development Bootcamp",
            event: "Web Dev Conference",
            date: "Mar 15, 2025",
            pending: true,
          },
        ]);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d]">
        <div className="text-white text-sm">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d]">
        <div className="text-red-400 text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pt-20 pb-10 bg-[#0d0d0d] text-white px-4"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-[#555] text-sm">Account & activity overview</p>
        </div>

        {/* Grid Layout - Compact */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Profile Card - Spans full height */}
          <div className="col-span-2 md:col-span-1 row-span-2">
            <ProfileCard profile={profile} user={user} />
          </div>

          {/* Account Info */}
          <div className="col-span-2 md:col-span-1">
            <AccountInfoCard profile={profile} />
          </div>

          {/* Attendance */}
          <div className="col-span-2 md:col-span-1">
            <AttendanceCard attendance={attendance} />
          </div>

          {/* Certificates - Spans 2 columns */}
          <div className="col-span-2 md:col-span-2">
            <CertificatesCard certificates={certificates} />
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-6">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg transition-all duration-300 font-medium border text-sm w-full md:w-auto"
            style={{
              background: "#ef444415",
              borderColor: "#ef444430",
              color: "#ef4444",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#ef444425";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#ef444415";
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
