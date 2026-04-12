import React, { useState } from "react";
import { Mail, Lock, User, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    branch: "",
    year: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.email || !formData.password || !formData.name) {
      setError("Email, password, and name are required");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const result = await register(
        formData.email,
        formData.password,
        formData.name,
        formData.phone,
        formData.branch,
        formData.year
      );

      if (!result.success) {
        setError(result.error);
        setLoading(false);
        return;
      }

      setLoading(false);
      navigate("/profile");
    } catch (err) {
      setLoading(false);
      setError("An error occurred. Please try again.");
      console.error("Register error:", err);
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
            Create Account
          </h2>
          <p className="mt-1 text-sm text-[#555]">Join our community</p>
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

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-white mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User size={14} className="absolute left-3 top-3 text-[#555]" />
              <input
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2.5 bg-[#0d0d0d] border border-[#1f1f1f] rounded-lg text-white placeholder-[#555] text-sm focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="Your name"
              />
            </div>
          </div>

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

          {/* Phone (Optional) */}
          <div>
            <label className="block text-xs font-medium text-white mb-1.5">
              Phone (Optional)
            </label>
            <div className="relative">
              <Phone size={14} className="absolute left-3 top-3 text-[#555]" />
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2.5 bg-[#0d0d0d] border border-[#1f1f1f] rounded-lg text-white placeholder-[#555] text-sm focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="Your phone number"
              />
            </div>
          </div>

          {/* Branch (Optional) */}
          <div>
            <label className="block text-xs font-medium text-white mb-1.5">
              Branch (Optional)
            </label>
            <select
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              className="w-full px-3 py-2.5 bg-[#0d0d0d] border border-[#1f1f1f] rounded-lg text-white placeholder-[#555] text-sm focus:outline-none focus:border-purple-500 transition-colors appearance-none cursor-pointer"
            >
              <option value="">Select Branch</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="AIDS">AIDS</option>
              <option value="AIML">AIML</option>
              <option value="MnC">MnC</option>
              <option value="ME">ME</option>
              <option value="Civil">Civil</option>
              <option value="EE">EE</option>
              <option value="IT">IT</option>
              <option value="PIE">PIE</option>
              <option value="IIOT">IIOT</option>
              <option value="SET">SET</option>
              <option value="Robotics">Robotics</option>
              <option value="Others">Others</option>
            </select>
          </div>

          {/* Year (Optional) */}
          <div>
            <label className="block text-xs font-medium text-white mb-1.5">
              Year (Optional)
            </label>
            <input
              name="year"
              type="text"
              value={formData.year}
              onChange={handleChange}
              className="w-full px-3 py-2.5 bg-[#0d0d0d] border border-[#1f1f1f] rounded-lg text-white placeholder-[#555] text-sm focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="e.g., 2nd, 3rd"
            />
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
            {loading ? "Creating account..." : "Create Account"}
          </button>

          {/* Login Link */}
          <p className="text-center text-xs text-[#555]">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-purple-400 font-medium hover:text-purple-300 transition-colors"
            >
              Sign In
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
