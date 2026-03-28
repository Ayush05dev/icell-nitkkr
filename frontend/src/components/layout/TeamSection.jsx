import { motion } from "framer-motion";
import { Linkedin, Instagram, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import teamData from "../../../src/data/team.json"; // Will update it 
import ProfileCard from "../profile/ProfileCard";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function TeamSection() {
  const [team, setTeam] = useState(teamData);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // useEffect(() => {
  //   const fetchTeam = async () => {
  //     try {
  //       const res = await fetch(`${API}/api/teams`);
  //       if (!res.ok) throw new Error(`Server error ${res.status}`);
  //       const data = await res.json();
  //       // ✅ Always guarantee an array
  //       setTeam(Array.isArray(data) ? data : []);
  //     } catch (err) {
  //       console.warn("Could not load team data:", err.message);
  //       setTeam([]);
  //     }
  //   };

  //   fetchTeam();
  // }, []);

  const safeTeam = Array.isArray(team) ? team : [];

  // Need at least 1 member to render the carousel.
  // Triple the array so the infinite scroll loop never shows a gap.
  const tripleTeam =
    safeTeam.length > 0 ? [...safeTeam, ...safeTeam, ...safeTeam] : [];

  // Width of one card + gap in px — must match the Tailwind classes below
  const CARD_W = 280; // w-[280px]
  const GAP = 40; // gap-10 = 2.5rem = 40px
  const loopPx = safeTeam.length * (CARD_W + GAP);

  return (
    <section className="relative overflow-hidden bg-black py-12 sm:py-16 md:py-20">
      {/* ── Section heading ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
        className="relative text-center mb-12 md:mb-16 px-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-yellow-400/10 border border-yellow-400/20 mb-4 sm:mb-6"
        >
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
          <span className="text-yellow-400 text-xs sm:text-sm font-medium">
            Our Team
          </span>
        </motion.div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-3 sm:mb-4">
          <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
            Meet Our
          </span>{" "}
          <span className="text-white">Leadership</span>
        </h2>

        <p className="mt-3 sm:mt-4 text-white/50 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed px-4">
          Visionaries driving innovation and excellence in everything we do
        </p>
      </motion.div>

      {/* ── Carousel ────────────────────────────────────────────────────────── */}
      {safeTeam.length === 0 ? (
        // Empty state — shown while loading or if DB is empty
        <div className="text-center py-16 text-white/30 text-sm">
          No team members yet.
        </div>
      ) : (
        <div className="relative w-full overflow-hidden">
          {/* Edge fade overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 lg:w-48 bg-gradient-to-r from-black via-black/90 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 lg:w-48 bg-gradient-to-l from-black via-black/90 to-transparent z-10 pointer-events-none" />

          <motion.div
            className="flex gap-10"
            animate={{ x: [0, -loopPx] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: Math.max(safeTeam.length * 4, 20), // speed scales with count
                ease: "linear",
              },
            }}
          >
            {tripleTeam.map((member, index) => (
              <ProfileCard key={index} member={member} />
            )
          )
            }
          </motion.div>
        </div>
      )}
    </section>
  );
}