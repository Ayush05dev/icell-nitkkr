import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const API = `${API_BASE}/api/gallery`;
const PHOTOS_PER_VIEW = 3;

export default function GallerySection() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch gallery photos
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(API);

        if (!res.ok) {
          throw new Error("Failed to fetch gallery photos");
        }

        const data = await res.json();
        const photosArray = Array.isArray(data) ? data : [];

        if (photosArray.length === 0) {
          setError("No photos in gallery yet");
          setPhotos([]);
        } else {
          setPhotos(photosArray);
        }
      } catch (err) {
        console.error("Gallery fetch error:", err);
        setError("Failed to load gallery photos");
        setPhotos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  // Get visible photos based on current index
  const visiblePhotos = photos.slice(
    currentIndex,
    currentIndex + PHOTOS_PER_VIEW
  );

  // Check if can navigate
  const canGoNext = currentIndex + PHOTOS_PER_VIEW < photos.length;
  const canGoPrev = currentIndex > 0;

  // Handle next button
  const handleNext = () => {
    if (canGoNext) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Handle previous button
  const handlePrev = () => {
    if (canGoPrev) {
      setCurrentIndex((prev) => Math.max(0, prev - 1));
    }
  };

  // Transform Cloudinary URL to optimize for gallery display
  // Adds responsive sizing based on screen size
  const getOptimizedImageUrl = (imageUrl, size = "large") => {
    if (!imageUrl || typeof imageUrl !== "string") {
      return imageUrl;
    }

    // Check if URL is from Cloudinary
    if (!imageUrl.includes("cloudinary.com")) {
      return imageUrl; // Return as-is if not Cloudinary
    }

    // Check if already has transformations
    if (imageUrl.includes("/upload/") && /w_\d+/.test(imageUrl)) {
      return imageUrl; // Already transformed
    }

    // Cloudinary transformation parameters
    // Different sizes for different viewports
    const transformations = {
      small: "w_250,h_188,c_fill,q_auto,f_auto", // Mobile
      medium: "w_380,h_285,c_fill,q_auto,f_auto", // Tablet
      large: "w_480,h_360,c_fill,q_auto,f_auto", // Desktop
    };

    const transformation = transformations[size] || transformations.large;

    try {
      // Insert transformation after /upload/
      const optimizedUrl = imageUrl.replace(
        "/upload/",
        `/upload/${transformation}/`
      );
      return optimizedUrl;
    } catch (err) {
      console.error("Error transforming image URL:", err);
      return imageUrl; // Return original if transformation fails
    }
  };

  // Open photo in full screen or new tab (with original URL)
  const handlePhotoClick = (photoUrl) => {
    if (!photoUrl) return;
    // Open original full-resolution image
    window.open(photoUrl, "_blank");
  };

  // Animation variants
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

  const photoVariants = {
    enter: { opacity: 0, x: 100 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  };

  if (loading) {
    return (
      <section className="relative min-h-screen bg-black px-4 sm:px-6 py-12 sm:py-20 md:py-24">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader className="w-12 h-12 text-yellow-400 animate-spin mx-auto mb-4" />
            <p className="text-white/60">Loading gallery...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative min-h-screen bg-black px-4 sm:px-6 py-12 sm:py-20 md:py-24">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-white/60">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (photos.length === 0) {
    return null; // Don't show section if no photos
  }

  return (
    <section className="relative min-h-screen bg-black px-4 sm:px-6 py-12 sm:py-20 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-12 sm:mb-16 md:mb-20"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-4 sm:mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            <span className="text-yellow-400/90 text-xs font-medium tracking-wider uppercase">
              Photo Gallery
            </span>
          </motion.div>

          {/* Title */}
          <motion.h2
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl font-bold bg-yellow-500 bg-clip-text text-transparent tracking-tight"
          >
            Event Moments
          </motion.h2>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-white/90 mt-4 sm:mt-6 text-base sm:text-lg leading-relaxed max-w-3xl"
          >
            Explore the vibrant moments from our Innovation Cell events. From
            hackathons to workshops, celebrate the creativity and innovation
            that defines our community.
          </motion.p>
        </motion.div>

        {/* Gallery Carousel */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true, margin: "-100px" }}
          className="relative"
        >
          {/* Photos Grid Container */}
          <div className="relative overflow-hidden">
            {/* Carousel Grid - 3 columns on large screens, responsive on mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 justify-items-center">
              <AnimatePresence mode="popLayout">
                {visiblePhotos.map((photo, index) => (
                  <motion.div
                    key={`${photo._id}-${currentIndex + index}`}
                    variants={photoVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="group cursor-pointer h-full"
                  >
                    <div className="relative h-full rounded-xl overflow-hidden bg-gradient-to-br from-yellow-500/20 to-transparent border border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300 aspect-video max-w-[480px]">
                      {/* Photo Image - Optimized with Cloudinary transformations */}
                      <motion.img
                        src={getOptimizedImageUrl(photo.imageUrl, "large")}
                        alt={photo.title}
                        onClick={() => handlePhotoClick(photo.imageUrl)}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        viewport={{ once: true }}
                        loading="lazy"
                      />

                      {/* Overlay - appears on hover */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4 sm:p-5 md:p-6"
                      >
                        {/* Photo Title */}
                        <motion.h3
                          initial={{ y: 10, opacity: 0 }}
                          whileHover={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                          className="text-white font-semibold text-sm sm:text-base truncate"
                        >
                          {photo.title}
                        </motion.h3>

                        {/* Photo Event/Category */}
                        {photo.event && (
                          <motion.p
                            initial={{ y: 10, opacity: 0 }}
                            whileHover={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.15 }}
                            className="text-yellow-400/90 text-xs sm:text-sm mt-1 sm:mt-2"
                          >
                            {photo.event}
                          </motion.p>
                        )}

                        {/* Click to View */}
                        <motion.p
                          initial={{ y: 10, opacity: 0 }}
                          whileHover={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                          className="text-white/60 text-xs sm:text-sm mt-2 sm:mt-3"
                        >
                          Click to view fullscreen
                        </motion.p>
                      </motion.div>

                      {/* Corner accent gradient */}
                      <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-yellow-500/20 transition-colors duration-300" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation Controls - only show if more photos exist */}
          {photos.length > 1 && (
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center gap-4 sm:gap-6 mt-8 sm:mt-10 md:mt-12"
            >
              {/* Photo Counter */}
              <div className="text-white/60 text-xs sm:text-sm font-medium">
                {currentIndex + 1} -{" "}
                {Math.min(currentIndex + PHOTOS_PER_VIEW, photos.length)}
                <span className="text-white/40"> of {photos.length}</span>
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-2 sm:gap-3">
                {/* Previous Button */}
                <motion.button
                  onClick={handlePrev}
                  disabled={!canGoPrev}
                  whileHover={canGoPrev ? { scale: 1.1 } : {}}
                  whileTap={canGoPrev ? { scale: 0.95 } : {}}
                  className={`p-2 sm:p-3 rounded-full border transition-all duration-300 flex items-center justify-center ${
                    canGoPrev
                      ? "bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20 hover:border-yellow-400/50 text-yellow-400 cursor-pointer"
                      : "bg-white/5 border-white/10 text-white/30 cursor-not-allowed"
                  }`}
                >
                  <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
                </motion.button>

                {/* Next Button */}
                <motion.button
                  onClick={handleNext}
                  disabled={!canGoNext}
                  whileHover={canGoNext ? { scale: 1.1 } : {}}
                  whileTap={canGoNext ? { scale: 0.95 } : {}}
                  className={`p-2 sm:p-3 rounded-full border transition-all duration-300 flex items-center justify-center ${
                    canGoNext
                      ? "bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20 hover:border-yellow-400/50 text-yellow-400 cursor-pointer"
                      : "bg-white/5 border-white/10 text-white/30 cursor-not-allowed"
                  }`}
                >
                  <ChevronRight size={20} className="sm:w-6 sm:h-6" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Scroll Progress Indicator */}
          {photos.length > PHOTOS_PER_VIEW && (
            <motion.div
              variants={itemVariants}
              className="mt-6 sm:mt-8 h-1 bg-white/10 rounded-full overflow-hidden max-w-xs"
            >
              <motion.div
                className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500"
                initial={{
                  width: `${
                    (currentIndex / (photos.length - PHOTOS_PER_VIEW)) * 100
                  }%`,
                }}
                animate={{
                  width: `${
                    (currentIndex / (photos.length - PHOTOS_PER_VIEW)) * 100
                  }%`,
                }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Background gradient accent */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl -z-10" />
    </section>
  );
}
