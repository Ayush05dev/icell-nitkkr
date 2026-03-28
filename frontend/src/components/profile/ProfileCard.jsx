import { motion } from "framer-motion";
import { Linkedin, Instagram, GitBranch, Github } from "lucide-react";

export default function ProfileCard({ member }) {
  return (
    <div className="w-[280px] group cursor-pointer">
      <motion.div
        whileHover={{ y: -12 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative h-full"
      >
        <div className="relative p-6 rounded-3xl border border-white/10 group-hover:border-yellow-400/30 transition-all duration-500 h-full flex flex-col bg-black">
          
          {/* Avatar */}
          <div className="relative mx-auto w-40 h-40 mb-5 flex-shrink-0">
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-yellow-400/40">
              <img
                src={
                  member.image ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                    member.name ?? member.id
                  )}`
                }
                alt={member.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Name + Position */}
          <div className="text-center space-y-2 flex-grow mb-5">
            <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition">
              {member.name}
            </h3>
            <p className="text-yellow-400/80 text-sm uppercase">
              {member.position}
            </p>
          </div>

          {/* Social Links */}
          <div className="flex gap-2 mt-auto">
            <motion.a
              href={member.linkedin || "#"}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-yellow-400/10 border border-white/10 hover:border-yellow-400/30 text-white/60 hover:text-yellow-400 transition"
            >
              <Linkedin size={18} />
              {/* <span className="text-sm">LinkedIn</span> */}
            </motion.a>

            <motion.a
              href={member.instagram || "#"}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-pink-500/10 border border-white/10 hover:border-pink-500/30 text-white/60 hover:text-pink-400 transition"
            >
              <Instagram size={18} />
              {/* <span className="text-sm">Instagram</span> */}
            </motion.a>
{ member.github && 
            <motion.a
              href={member.github || "#"}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-pink-500/10 border border-white/10 hover:border-pink-500/30 text-white/60 hover:text-pink-400 transition"
            >
              <Github size={18} />
              {/* <span className="text-sm">Instagram</span> */}
            </motion.a>}
          </div>
        </div>
      </motion.div>
    </div>
  );
}