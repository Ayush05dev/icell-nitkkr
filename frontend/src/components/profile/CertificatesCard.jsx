import { Award, CheckCircle } from "lucide-react";

export default function CertificatesCard({ certificates }) {
  return (
    <div
      className="rounded-lg border p-4"
      style={{ background: "#111111", borderColor: "#1f1f1f" }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <div className="p-1.5 rounded-lg" style={{ background: "#f59e0b18" }}>
            <Award size={14} style={{ color: "#f59e0b" }} />
          </div>
          Certificates
        </h3>
        <span
          className="text-xs px-2 py-1 rounded-md font-medium"
          style={{ background: "#f59e0b15", color: "#f59e0b" }}
        >
          {certificates.length}
        </span>
      </div>

      {certificates.length > 0 ? (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="rounded-md p-2"
              style={{ background: "#0d0d0d" }}
            >
              <div className="flex items-start gap-2 mb-1">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-xs text-white truncate">
                    {cert.title}
                  </h4>
                  <p className="text-[#555] text-xs truncate">{cert.event}</p>
                </div>
                {cert.pending ? (
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-sm whitespace-nowrap"
                    style={{ background: "#f59e0b18", color: "#f59e0b" }}
                  >
                    ⏳
                  </span>
                ) : (
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-sm whitespace-nowrap flex items-center gap-0.5"
                    style={{ background: "#10b98118", color: "#10b981" }}
                  >
                    <CheckCircle size={10} />✓
                  </span>
                )}
              </div>
              <p className="text-[#555] text-xs">{cert.date}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4">
          <Award size={20} className="mx-auto mb-2 text-[#555]" />
          <p className="text-[#555] text-xs">No certificates yet</p>
          <p className="text-[#444] text-xs">Keep attending events!</p>
        </div>
      )}
    </div>
  );
}
