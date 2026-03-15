import { User } from "lucide-react";

export default function AccountInfoCard({ profile }) {
  return (
    <div
      className="rounded-lg border p-4"
      style={{ background: "#111111", borderColor: "#1f1f1f" }}
    >
      <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
        <div className="p-1.5 rounded-lg" style={{ background: "#a855f718" }}>
          <User size={14} style={{ color: "#a855f7" }} />
        </div>
        Account
      </h3>

      <div className="space-y-2 text-xs">
        <div>
          <p className="text-[#555] mb-0.5">Full Name</p>
          <p className="text-white">{profile?.name || "N/A"}</p>
        </div>

        <div className="border-t" style={{ borderColor: "#1f1f1f" }}>
          <p className="text-[#555] mb-0.5 mt-2">Email</p>
          <p className="text-white break-all text-xs">
            {profile?.email || "N/A"}
          </p>
        </div>

        {profile?.phone && (
          <div className="border-t" style={{ borderColor: "#1f1f1f" }}>
            <p className="text-[#555] mb-0.5 mt-2">Phone</p>
            <p className="text-white">{profile.phone}</p>
          </div>
        )}

        <div className="border-t" style={{ borderColor: "#1f1f1f" }}>
          <p className="text-[#555] mb-0.5 mt-2">Role</p>
          <p className="text-white capitalize">
            {profile?.role === "post_holder"
              ? "Post Holder"
              : profile?.role || "Member"}
          </p>
          {profile?.post_position && (
            <p className="text-[#999] text-xs mt-0.5">
              ({profile.post_position})
            </p>
          )}
        </div>

        <div className="border-t" style={{ borderColor: "#1f1f1f" }}>
          <p className="text-[#555] mb-0.5 mt-2">Academic</p>
          <div className="flex flex-wrap gap-1">
            {profile?.branch && (
              <span
                className="px-2 py-0.5 rounded-sm text-xs"
                style={{ background: "#0ea5e915" }}
              >
                {profile.branch}
              </span>
            )}
            {profile?.year && (
              <span
                className="px-2 py-0.5 rounded-sm text-xs"
                style={{ background: "#f59e0b15" }}
              >
                Y{profile.year}
              </span>
            )}
            {profile?.roll_number && (
              <span
                className="px-2 py-0.5 rounded-sm text-xs"
                style={{ background: "#10b98115" }}
              >
                {profile.roll_number}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
