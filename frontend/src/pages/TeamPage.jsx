import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { Users, Mail, Linkedin } from "lucide-react";

export default function TeamPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [postHolders, setPostHolders] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamsAndMembers = async () => {
      try {
        setLoading(true);

        // Fetch teams
        const teamsResponse = await api.get("/teams");
        const teamsData = teamsResponse.data || [];

        // Fetch all post holders for team leads
        const studentsResponse = await api.get("/students");
        const holdersData = (studentsResponse.data || []).filter(
          (s) => s.role === "post_holder"
        );

        setTeams(teamsData);
        setPostHolders(holdersData);

        if (teamsData && teamsData.length > 0) {
          setSelectedTeam(teamsData[0]);
        }
      } catch (err) {
        console.error("Error fetching teams:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamsAndMembers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] text-white pt-20">
        <div>Loading teams...</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pt-24 pb-10 bg-[#0d0d0d] text-white"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Our Teams</h1>
          <p className="text-[#555] text-lg">
            Meet the talented individuals driving innovation
          </p>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-12">
          {teams.map((team) => (
            <button
              key={team.id}
              onClick={() => setSelectedTeam(team)}
              className={`rounded-xl p-4 text-left transition-all duration-300 ${
                selectedTeam?.id === team.id
                  ? "border-2"
                  : "border border-white/10 hover:border-white/20"
              }`}
              style={{
                background:
                  selectedTeam?.id === team.id
                    ? `${team.color || "#6366f1"}18`
                    : "#111111",
                borderColor:
                  selectedTeam?.id === team.id
                    ? team.color || "#6366f1"
                    : "rgba(255, 255, 255, 0.1)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${team.color || "#6366f1"}33` }}
                >
                  <Users size={18} style={{ color: team.color || "#6366f1" }} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm truncate">
                    {team.name}
                  </h3>
                  <p className="text-[#555] text-xs">Team</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Selected Team Details */}
        {selectedTeam && (
          <div className="space-y-8">
            {/* Team Header */}
            <div
              className="rounded-2xl border p-8"
              style={{ background: "#111111", borderColor: "#1f1f1f" }}
            >
              <div className="flex items-start gap-6 mb-6">
                <div
                  className="w-20 h-20 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `${selectedTeam.color || "#6366f1"}18`,
                    borderColor: `${selectedTeam.color || "#6366f1"}33`,
                  }}
                >
                  <Users
                    size={32}
                    style={{ color: selectedTeam.color || "#6366f1" }}
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">
                    {selectedTeam.name}
                  </h2>
                  <p className="text-[#555]">
                    {selectedTeam.description ||
                      "A dynamic team driving excellence"}
                  </p>
                </div>
              </div>

              {/* Team Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div
                  className="rounded-lg p-4"
                  style={{ background: "#0d0d0d" }}
                >
                  <p className="text-[#555] text-sm mb-2">Members</p>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: selectedTeam.color || "#6366f1" }}
                  >
                    {selectedTeam.member_count || "TBD"}
                  </p>
                </div>
                <div
                  className="rounded-lg p-4"
                  style={{ background: "#0d0d0d" }}
                >
                  <p className="text-[#555] text-sm mb-2">Founded</p>
                  <p className="text-sm font-medium">
                    {new Date(selectedTeam.created_at).getFullYear()}
                  </p>
                </div>
              </div>
            </div>

            {/* Team Head / Lead Section */}
            {selectedTeam.team_head && (
              <div
                className="rounded-2xl border p-8"
                style={{ background: "#111111", borderColor: "#1f1f1f" }}
              >
                <h3 className="text-2xl font-bold mb-6">Team Lead</h3>
                <div
                  className="flex flex-col sm:flex-row items-start gap-6 p-6 rounded-xl"
                  style={{ background: "#0d0d0d" }}
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                    <Users size={32} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xl font-bold mb-1">
                      {selectedTeam.team_head}
                    </h4>
                    <p className="text-[#555] text-sm mb-4">
                      Team Lead - {selectedTeam.name}
                    </p>
                    <div className="flex items-center gap-3">
                      <Mail size={16} className="text-[#555]" />
                      <span className="text-sm text-[#555]">
                        Contact for leadership inquiries
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Team Description & Goals */}
            {selectedTeam.what_we_do && (
              <div
                className="rounded-2xl border p-8"
                style={{ background: "#111111", borderColor: "#1f1f1f" }}
              >
                <h3 className="text-2xl font-bold mb-6">What We Do</h3>
                <div className="prose prose-invert max-w-none">
                  <p className="text-[#aaa] leading-relaxed">
                    {selectedTeam.what_we_do}
                  </p>
                </div>
              </div>
            )}

            {/* Post Holders / Key Positions */}
            {postHolders.length > 0 && (
              <div
                className="rounded-2xl border p-8"
                style={{ background: "#111111", borderColor: "#1f1f1f" }}
              >
                <h3 className="text-2xl font-bold mb-6">Post Holders</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {postHolders.map((holder) => (
                    <div
                      key={holder.id}
                      className="rounded-lg p-4 flex items-start gap-4"
                      style={{ background: "#0d0d0d", borderColor: "#1f1f1f" }}
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                        <Users size={20} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold truncate">
                          {holder.name}
                        </h4>
                        <p className="text-[#555] text-sm">
                          {holder.post_position || "Post Holder"}
                        </p>
                        <a
                          href={`mailto:${holder.email}`}
                          className="text-purple-400 text-xs hover:text-purple-300 transition-colors flex items-center gap-1 mt-2"
                        >
                          <Mail size={12} />
                          Contact
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Call to Action for Members */}
            {!user && (
              <div
                className="rounded-2xl border p-8 text-center"
                style={{
                  background:
                    "linear-gradient(135deg, #a855f718 0%, #6366f118 100%)",
                  borderColor: "#1f1f1f",
                }}
              >
                <h3 className="text-2xl font-bold mb-4">
                  Interested in Joining?
                </h3>
                <p className="text-[#555] mb-6">
                  Sign up to become part of our team
                </p>
                <button
                  onClick={() => navigate("/register")}
                  className="px-8 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Join Us Today
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
