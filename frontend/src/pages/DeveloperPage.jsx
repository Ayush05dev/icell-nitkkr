import ProfileCard from "../components/profile/ProfileCard";
import developers from "../data/developer.json";

function DeveloperPage() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 mt-12">
      
      {/* 🔥 Heading Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold">
          <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
            Meet Our Developers
          </span>
        </h1>
        <p className="text-white/50 mt-4 max-w-xl mx-auto">
          The minds behind the product — building, scaling, and innovating.
        </p>
      </div>

      {/* 🧩 Cards Grid */}
      <div className="flex flex-wrap justify-center gap-8">
        {developers.map((dev) => (
          <ProfileCard key={dev.id} member={dev} />
        ))}
      </div>

    </div>
  );
}

export default DeveloperPage;