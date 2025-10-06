import { Link } from "react-router-dom";
import SkillHeatmap from "../components/SkillHeatmap";
import InternshipRoulette from "../components/InternshipRoulette";

function Home() {
  return (
    <div className="min-h-screen py-16 px-6 bg-gradient-to-br from-[#FFF3EB] via-[#FFFDF5] to-[#E8FFF4]">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center py-16 px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#4A4A4A]">
            Find Your Dream Job or Internship 🚀
          </h1>
          <p className="mt-4 text-lg text-[#7A7A7A]">
            Explore thousands of opportunities and kickstart your career today.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/internships"
              className="px-6 py-3 rounded-lg font-semibold shadow-md hover:scale-105 transition bg-gradient-to-tr from-[#FFD3FF] to-[#A6C1EE] text-[#4A4A4A]"
            >
              Browse Jobs
            </Link>
            <Link
              to="/dashboard"
              className="px-6 py-3 rounded-lg font-semibold shadow-md hover:scale-105 transition bg-gradient-to-tr from-[#FFD3FF] to-[#A6C1EE] text-[#4A4A4A]"
            >
              Post a Job
            </Link>
          </div>
        </div>

        {/* Skill Heatmap Section */}
        <div className="px-6 pb-16">
          <SkillHeatmap />
        </div>

        {/* Internship Roulette Section */}
        <div className="px-6 pb-16">
          <InternshipRoulette />
        </div>

        {/* Categories Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-6 pb-16">
          {[
            { icon: "💻", title: "Software Development" },
            { icon: "🎨", title: "Design" },
            { icon: "📈", title: "Marketing" },
            { icon: "📊", title: "Data Science" },
          ].map((cat, idx) => (
            <div
              key={idx}
              className="rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition bg-white/70 backdrop-blur-md"
            >
              <span className="text-4xl mb-3">{cat.icon}</span>
              <h3 className="text-lg font-semibold text-[#4A4A4A]">{cat.title}</h3>
              <Link
                to="/internships"
                className="mt-4 text-sm hover:underline text-[#4A4A4A]"
              >
                Explore {cat.title}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
