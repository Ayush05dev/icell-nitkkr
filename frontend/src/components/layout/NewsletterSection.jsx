import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Loader } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function NewsletterSection() {
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewsletters = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/newsletters`);
        const data = await res.json();
        setNewsletters(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching newsletters:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNewsletters();
  }, []);

  const handleOpenNewsletter = async (id, url) => {
    // Track the opening
    try {
      await fetch(`${API_BASE}/api/newsletters/${id}/download`, {
        method: "POST",
      });
    } catch (err) {
      console.error("Error tracking download:", err);
    }
    // Open the Google Drive link
    window.open(url, "_blank");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    hover: {
      y: -8,
      boxShadow: "0 20px 40px rgba(250, 204, 21, 0.15)",
      transition: { duration: 0.3 },
    },
  };

  return (
    <section className="relative min-h-screen bg-black px-4 sm:px-6 py-12 sm:py-20 md:py-24 overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          {/* Small badge above title */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-4 sm:mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            <span className="text-yellow-400/90 text-xs font-medium tracking-wider uppercase">
              Stay Updated
            </span>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl font-bold bg-yellow-500 bg-clip-text text-transparent tracking-tight"
          >
            Latest Newsletters
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-white/80 mt-4 sm:mt-6 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto"
          >
            Access our latest innovation updates, event announcements, and
            monthly digests. Stay connected with ICell community.
          </motion.p>
        </motion.div>

        {/* Newsletter Cards Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Loader size={40} className="text-yellow-400" />
            </motion.div>
          </div>
        ) : newsletters.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center py-16 px-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
          >
            <p className="text-white/60 text-lg">
              No newsletters available yet. Check back soon!
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {newsletters.map((newsletter) => (
              <motion.div
                key={newsletter._id}
                variants={cardVariants}
                whileHover="hover"
                className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-yellow-500/30"
              >
                {/* Background gradient on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-yellow-500/0 via-yellow-500/0 to-yellow-500/0 group-hover:from-yellow-500/5 group-hover:via-transparent group-hover:to-yellow-500/5"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />

                <div className="relative p-6 sm:p-8">
                  {/* Newsletter Number/Badge */}
                  <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                    <span className="w-2 h-2 rounded-full bg-yellow-400" />
                    <span className="text-yellow-400/90 text-xs font-medium">
                      Newsletter
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 line-clamp-2 group-hover:text-yellow-300 transition-colors">
                    {newsletter.title}
                  </h3>

                  {/* Date and Stats */}
                  <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-white/60 mb-6">
                    <span>
                      {new Date(newsletter.created_at).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      👁 {newsletter.downloads || 0} opens
                    </span>
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    onClick={() =>
                      handleOpenNewsletter(newsletter._id, newsletter.file_url)
                    }
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full group/btn relative px-4 py-3 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold text-sm sm:text-base overflow-hidden transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-yellow-500/50"
                  >
                    <span className="relative z-10">Open Newsletter</span>
                    <motion.div
                      className="relative z-10"
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ExternalLink size={16} />
                    </motion.div>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-yellow-700"
                      initial={{ x: "100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>

                  {/* Decorative corner accent */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-yellow-500/10 transition-colors duration-300" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
