import { User, Mail, BookOpen, GraduationCap, BarChart3 } from "lucide-react";

export default function ProfileCard({ profile, user }) {
  return (
    <div
      className="rounded-lg border p-4"
      style={{ background: "#111111", borderColor: "#1f1f1f" }}
    >
      {/* Avatar & Name */}
      <div className="flex flex-col items-center text-center mb-4">
        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mb-3">
          <User size={32} className="text-white" />
        </div>
        <h2 className="text-base font-bold">{profile?.name || "User"}</h2>
        <p className="text-[#555] text-xs">ID: {user?.id.substring(0, 8)}...</p>
      </div>

      {/* Quick Info */}
      <div className="space-y-2 text-xs">
        {profile?.email && (
          <div className="flex items-center gap-2">
            <Mail size={12} className="text-purple-400" />
            <span className="text-[#999] truncate">{profile.email}</span>
          </div>
        )}
        {profile?.branch && (
          <div className="flex items-center gap-2">
            <BookOpen size={12} className="text-blue-400" />
            <span className="text-[#999]">{profile.branch}</span>
          </div>
        )}
        {profile?.year && (
          <div className="flex items-center gap-2">
            <GraduationCap size={12} className="text-green-400" />
            <span className="text-[#999]">Year {profile.year}</span>
          </div>
        )}
        {profile?.roll_number && (
          <div className="flex items-center gap-2">
            <BarChart3 size={12} className="text-orange-400" />
            <span className="text-[#999]">{profile.roll_number}</span>
          </div>
        )}
      </div>

      {/* Status Badge */}
      <div className="mt-3 pt-3 border-t" style={{ borderColor: "#1f1f1f" }}>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span className="text-xs text-[#999]">
            {profile?.is_member ? "Active" : "Inactive"}
          </span>
        </div>
        <p className="text-xs text-[#555] mt-1">
          Joined{" "}
          {new Date(profile?.created_at).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}
