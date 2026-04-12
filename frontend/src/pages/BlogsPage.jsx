import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BlogCard from "../components/blog/BlogCard";
import BlogFilter from "../components/blog/BlogFilter";
import Footer from "../components/layout/Footer";
import api from "../services/api";

// ── Slider ────────────────────────────────────────────────────────────────────
function BlogSlider({ blogs, onCardClick }) {
  const [startIdx, setStartIdx] = useState(0);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  // Determine visible items based on screen width
  const getVisibleCount = () => {
    if (windowWidth < 640) return 1; // mobile
    if (windowWidth < 1024) return 2; // tablet
    return 3; // desktop
  };

  const visible = getVisibleCount();
  const canPrev = startIdx > 0;
  const canNext = startIdx + visible < blogs.length;

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${visible}, 1fr)`,
          gap: "20px",
          overflow: "hidden",
        }}
      >
        {blogs.slice(startIdx, startIdx + visible).map((blog) => (
          <BlogCard key={blog.id} blog={blog} onClick={onCardClick} />
        ))}
        {Array.from({
          length: Math.max(
            0,
            visible - blogs.slice(startIdx, startIdx + visible).length
          ),
        }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
      </div>
      {blogs.length > visible && (
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginTop: "20px",
            flexWrap: "wrap",
          }}
        >
          {[
            {
              label: "← Prev",
              action: () => setStartIdx(Math.max(0, startIdx - 1)),
              enabled: canPrev,
            },
            {
              label: "Next →",
              action: () =>
                setStartIdx(Math.min(blogs.length - visible, startIdx + 1)),
              enabled: canNext,
            },
          ].map(({ label, action, enabled }) => (
            <button
              key={label}
              onClick={action}
              disabled={!enabled}
              style={{
                padding: "clamp(6px 16px, 2vw, 9px 22px)",
                borderRadius: "999px",
                border: enabled
                  ? "1.5px solid rgba(255,255,255,0.22)"
                  : "1.5px solid rgba(255,255,255,0.07)",
                background: enabled
                  ? "rgba(255,255,255,0.07)"
                  : "rgba(255,255,255,0.02)",
                color: enabled
                  ? "rgba(255,255,255,0.75)"
                  : "rgba(255,255,255,0.18)",
                cursor: enabled ? "pointer" : "not-allowed",
                fontSize: "clamp(11px, 2vw, 13px)",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
                transition: "all 0.22s ease",
                flex: "1 1 auto",
                minWidth: "100px",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SectionTitle({ title }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "clamp(8px, 3vw, 16px)",
        marginBottom: "clamp(12px, 3vw, 24px)",
        flexWrap: "wrap",
      }}
    >
      <h2
        style={{
          color: "#fff",
          fontFamily: "'DM Serif Display', Georgia, serif",
          fontSize: "clamp(18px, 5vw, 22px)",
          fontWeight: 400,
          margin: 0,
          letterSpacing: "-0.02em",
          whiteSpace: "nowrap",
        }}
      >
        {title}
      </h2>
      <div
        style={{
          flex: 1,
          height: "1px",
          minWidth: "50px",
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.15), transparent)",
        }}
      />
    </div>
  );
}

const SECTION_CATEGORIES = ["Finance", "Technology", "Startup", "Design"];

export default function BlogsPage() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await api.get("/blogs");
        setBlogs(response.data);
      } catch (err) {
        console.error("Failed to load blogs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const filteredBlogs =
    activeCategory === "All"
      ? blogs
      : blogs.filter((b) => b.category === activeCategory);

  const handleCardClick = (blog) => navigate(`/blog/${blog._id}`);
  const recentBlogs = [...blogs].slice(0, 6);
  const popularBlogs = [...blogs].slice(2, 8);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0d0d0d",
        color: "#fff",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      {/* Hero */}
      <section style={{ paddingTop: "clamp(60px, 8vw, 96px)" }}>
        <div
          style={{
            margin: "0 auto",
            maxWidth: "1200px",
            padding: "0 clamp(12px, 4vw, 24px)",
          }}
        >
          <div
            style={{
              borderRadius: "clamp(12px, 4vw, 24px)",
              overflow: "hidden",
              background:
                "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              flexDirection: window.innerWidth < 768 ? "column" : "row",
              alignItems: "center",
              justifyContent: "space-between",
              minHeight: window.innerWidth < 768 ? "auto" : "220px",
              position: "relative",
              gap: window.innerWidth < 768 ? "20px" : "0",
            }}
          >
            <div
              style={{
                position: "absolute",
                right: window.innerWidth < 768 ? "unset" : "10%",
                left: window.innerWidth < 768 ? "-20%" : "unset",
                top: "50%",
                transform: "translateY(-50%)",
                width: window.innerWidth < 768 ? "120px" : "180px",
                height: window.innerWidth < 768 ? "120px" : "180px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(102,126,234,0.2) 0%, transparent 70%)",
                opacity: window.innerWidth < 768 ? 0.5 : 1,
              }}
            />
            <div
              style={{
                padding: `clamp(20px, 5vw, 48px) clamp(16px, 4vw, 56px)`,
                position: "relative",
                zIndex: 1,
                flex: 1,
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  padding: "clamp(4px 10px, 2vw, 6px 16px)",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  fontSize: "clamp(9px, 2vw, 11px)",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.6)",
                  marginBottom: "clamp(8px, 2vw, 16px)",
                }}
              >
                Knowledge Hub
              </div>
              <h1
                style={{
                  fontFamily: "'DM Serif Display', Georgia, serif",
                  fontSize: "clamp(24px, 6vw, 48px)",
                  fontWeight: 400,
                  margin: 0,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.1,
                  color: "#fff",
                }}
              >
                Trends &amp; Blogs
              </h1>
              <p
                style={{
                  color: "rgba(255,255,255,0.45)",
                  fontSize: "clamp(12px, 3vw, 14px)",
                  marginTop: "clamp(8px, 2vw, 12px)",
                  maxWidth: "400px",
                  lineHeight: 1.6,
                }}
              >
                Stay informed with expert insights on finance, technology,
                startup and design.
              </p>
            </div>
            <div
              style={{
                padding: `clamp(20px, 5vw, 48px) clamp(16px, 4vw, 56px)`,
                position: "relative",
                zIndex: 1,
                width: window.innerWidth < 768 ? "100%" : "auto",
              }}
            >
              <button
                onClick={() => navigate("/write-blog")}
                className="relative overflow-hidden px-clamp(4, 1.5vw, 6) py-2 rounded-[15px] bg-[#e8e8e8] text-[#212121] font-extrabold text-clamp(13px, 2vw, 15px) shadow-[4px_8px_19px_-3px_rgba(0,0,0,0.27)] transition-all duration-300 group flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <span className="absolute inset-0 w-0 bg-[#212121] rounded-[15px] transition-all duration-300 group-hover:w-full z-0" />
                <span className="relative z-10 flex items-center gap-2 group-hover:text-[#e8e8e8] transition-colors duration-300">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M12 2L14 4L6 12H4V10L12 2Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 14H14"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  Create Blog
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Filter */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "clamp(24px, 5vw, 40px) clamp(12px, 4vw, 24px) 0",
        }}
      >
        <div
          style={{
            padding: "clamp(12px, 3vw, 20px) clamp(12px, 3vw, 24px)",
            borderRadius: "16px",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <BlogFilter
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>
      </section>

      {/* Loading state */}
      {loading && (
        <div
          style={{
            textAlign: "center",
            padding: "80px 0",
            color: "rgba(255,255,255,0.3)",
            fontSize: "14px",
          }}
        >
          Loading blogs...
        </div>
      )}

      {/* Category filtered view */}
      {!loading && activeCategory !== "All" && (
        <section
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "clamp(24px, 5vw, 40px) clamp(12px, 4vw, 24px)",
          }}
        >
          <SectionTitle title={activeCategory} />
          {filteredBlogs.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(clamp(250px, 80vw, 320px), 1fr))",
                gap: "clamp(12px, 3vw, 20px)",
              }}
            >
              {filteredBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} onClick={handleCardClick} />
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "clamp(40px, 10vw, 80px) 0",
                color: "rgba(255,255,255,0.3)",
                fontSize: "15px",
              }}
            >
              No blogs found in this category yet.
            </div>
          )}
        </section>
      )}

      {/* All sections */}
      {!loading && activeCategory === "All" && (
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "clamp(24px, 5vw, 40px) clamp(12px, 4vw, 24px)",
          }}
        >
          {recentBlogs.length > 0 && (
            <section style={{ marginBottom: "clamp(30px, 8vw, 56px)" }}>
              <SectionTitle title="Recent Blogs" />
              <BlogSlider blogs={recentBlogs} onCardClick={handleCardClick} />
            </section>
          )}
          {popularBlogs.length > 0 && (
            <section style={{ marginBottom: "clamp(30px, 8vw, 56px)" }}>
              <SectionTitle title="Most Popular" />
              <BlogSlider blogs={popularBlogs} onCardClick={handleCardClick} />
            </section>
          )}
          {SECTION_CATEGORIES.map((cat) => {
            const catBlogs = blogs.filter((b) => b.category === cat);
            if (catBlogs.length === 0) return null;
            return (
              <section
                key={cat}
                style={{ marginBottom: "clamp(30px, 8vw, 56px)" }}
              >
                <SectionTitle title={cat} />
                <BlogSlider blogs={catBlogs} onCardClick={handleCardClick} />
              </section>
            );
          })}
          {blogs.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "clamp(40px, 10vw, 80px) 0",
                color: "rgba(255,255,255,0.3)",
                fontSize: "15px",
              }}
            >
              No blogs published yet. Be the first to write one!
            </div>
          )}
        </div>
      )}

      <div style={{ height: "60px" }} />
    </div>
  );
}
