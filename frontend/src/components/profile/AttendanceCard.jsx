import { Calendar } from "lucide-react";

export default function AttendanceCard({ attendance }) {
  if (!attendance) return null;

  return (
    <div
      className="rounded-lg border p-4"
      style={{ background: "#111111", borderColor: "#1f1f1f" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg" style={{ background: "#0ea5e918" }}>
          <Calendar size={14} style={{ color: "#0ea5e9" }} />
        </div>
        <h3 className="text-sm font-semibold">Attendance</h3>
      </div>

      <div className="space-y-2">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-[#555]">Rate</span>
            <span className="font-bold text-xs text-cyan-400">
              {attendance.percentage}%
            </span>
          </div>
          <div className="w-full h-1 bg-[#1f1f1f] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
              style={{
                width: `${Math.min(100, Math.max(0, attendance.percentage))}%`,
              }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-md p-2" style={{ background: "#0ea5e910" }}>
            <p className="text-xs text-[#555]">Total</p>
            <p className="text-sm font-bold text-white">{attendance.total}</p>
          </div>
          <div className="rounded-md p-2" style={{ background: "#10b98110" }}>
            <p className="text-xs text-[#555]">Attended</p>
            <p className="text-sm font-bold text-green-400">
              {attendance.present}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
