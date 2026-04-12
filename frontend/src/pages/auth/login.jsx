import React, { useEffect, useState } from "react";
import { Mail, Lock } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const verified = searchParams.get("verified");
    if (verified === "1") {
      setInfo("Email verified successfully. You can now sign in.");
    } else if (verified === "0") {
      setInfo(
        "Verification link is invalid or expired. Please register again."
      );
    }
  }, [searchParams]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);

      if (!result.success) {
        setError(result.error);
        setLoading(false);
        return;
      }

      const loggedInUser = result.user;
      setLoading(false);

      // Redirect based on role
      if (loggedInUser?.role === "admin") {
        navigate("/admin");
      } else if (loggedInUser?.role === "post_holder") {
        navigate("/admin");
      } else if (loggedInUser?.role === "member") {
        navigate("/member-profile");
      } else if (loggedInUser?.role === "student") {
        navigate("/student-profile");
      } else {
        // Fallback to home if role is not recognized
        navigate("/");
      }
    } catch (err) {
      setLoading(false);
      setError("An error occurred. Please try again.");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] px-4 py-12">
      <div
        className="w-full max-w-md space-y-6 bg-[#111111] p-6 rounded-xl border"
        style={{ borderColor: "#1f1f1f" }}
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Sign In
          </h2>
          <p className="mt-1 text-sm text-[#555]">Access your account</p>
        </div>

        {error && (
          <div
            className="px-4 py-2 rounded-lg text-sm"
            style={{
              background: "#ef444415",
              borderColor: "#ef444430",
              color: "#ef4444",
              border: "1px solid #ef444430",
            }}
          >
            {error}
          </div>
        )}

        {info && (
          <div
            className="px-4 py-2 rounded-lg text-sm"
            style={{
              background: "#10b98115",
              borderColor: "#10b98130",
              color: "#10b981",
              border: "1px solid #10b98130",
            }}
          >
            {info}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-white mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-3 text-[#555]" />
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2.5 bg-[#0d0d0d] border border-[#1f1f1f] rounded-lg text-white placeholder-[#555] text-sm focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="your@email.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-white mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-3 text-[#555]" />
              <input
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2.5 bg-[#0d0d0d] border border-[#1f1f1f] rounded-lg text-white placeholder-[#555] text-sm focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 mt-6"
            style={{
              background: loading ? "#a855f730" : "#a855f740",
              color: "#a855f7",
              border: "1px solid #a855f730",
            }}
            onMouseEnter={(e) => {
              if (!loading) e.target.style.background = "#a855f750";
            }}
            onMouseLeave={(e) => {
              if (!loading) e.target.style.background = "#a855f740";
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {/* Register Link */}
          <p className="text-center text-xs text-[#555]">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-purple-400 font-medium hover:text-purple-300 transition-colors"
            >
              Register
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
