// src/components/Profile.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaDownload,
  FaEdit,
  FaExternalLinkAlt,
  FaMapMarkerAlt,
  FaBriefcase,
  FaGraduationCap,
  FaTimes,
  FaCheck,
} from "react-icons/fa";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
} from "recharts";

// Reusable Skill Progress (gradient bar)
function ProficiencyBar({ level = 70 }) {
  return (
    <div className="w-full bg-gray-200/50 rounded-full h-2">
      <div
        className="h-2 rounded-full transition-all"
        style={{
          width: `${Math.max(0, Math.min(100, level))}%`,
          background:
            "linear-gradient(90deg, rgba(255,211,255,1) 0%, rgba(166,193,238,1) 100%)",
        }}
      />
    </div>
  );
}

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", headline: "", bio: "" });
  const navigate = useNavigate();

  // Example mock content
  const [skills] = useState([
    { name: "React", level: 88 },
    { name: "Node.js", level: 80 },
    { name: "NLP / LLMs", level: 72 },
    { name: "MongoDB", level: 75 },
    { name: "CSS / Tailwind", level: 82 },
  ]);
  const [experience] = useState([
    {
      role: "Frontend Developer Intern",
      company: "Tech Corp",
      duration: "Jun 2024 — Aug 2024",
      bullets: ["Implemented responsive UI components", "Improved load time by 22%"],
    },
    {
      role: "Open Source Contributor",
      company: "DesignLib",
      duration: "Jan 2024 — Present",
      bullets: ["Built accessible components", "Wrote docs & tests"],
    },
  ]);
  const [education] = useState([
    { degree: "B.Tech Computer Science", school: "ABC University", year: "2021 — 2025" },
  ]);
  const [projects] = useState([
    {
      title: "Smarter Job Portal",
      description: "Full-stack AI job portal with tailored cover letters & JD summarization.",
      link: "#",
    },
    {
      title: "Resume Analyzer",
      description: "Extracts skills and ranks fit for job postings using embeddings.",
      link: "#",
    },
  ]);
  const [applications] = useState([
    { id: 1, title: "Frontend Developer Intern", company: "Tech Corp", date: "2025-09-10", status: "Interview" },
    { id: 2, title: "ML Research Intern", company: "DataWiz", date: "2025-09-05", status: "Applied" },
  ]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const res = await axios.get("/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setForm({
          name: res.data.name || "",
          headline: res.data.headline || "Aspiring frontend engineer",
          bio: res.data.bio || "",
        });
      } catch (err) {
        console.error(err.response?.data || err.message);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSave = () => {
    setUser((u) => ({ ...u, ...form }));
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg text-gray-600">Loading profile...</p>
      </div>
    );
  }
  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg text-red-500">User not found</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-12"
      style={{
        background: "linear-gradient(135deg, #FFDEE9 0%, #B5FFFC 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-pink-200 to-blue-200 flex items-center justify-center text-2xl font-bold text-gray-700 mb-4">
                  {user.name?.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-sm text-gray-500 mt-1">{user.headline}</p>

                <div className="flex items-center text-sm text-gray-500 gap-2 mt-3">
                  <FaMapMarkerAlt />
                  <span>{user.location || "City, Country"}</span>
                </div>

                <div className="flex gap-2 mt-5 w-full">
                  <button
                    onClick={() => setEditing(!editing)}
                    className="flex-1 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 flex items-center justify-center gap-2"
                  >
                    <FaEdit /> {editing ? "Cancel" : "Edit"}
                  </button>
                  <button
                    onClick={() => alert("Resume download placeholder")}
                    className="flex-1 py-2 rounded-lg bg-gradient-to-tr from-pink-200 to-blue-200 text-gray-700 font-medium flex items-center justify-center gap-2"
                  >
                    <FaDownload /> Resume
                  </button>
                </div>
              </div>

              {/* Stats + Radial chart */}
              <div className="mt-6 grid grid-cols-3 text-center">
                <div>
                  <p className="font-bold text-lg">24</p>
                  <p className="text-xs text-gray-500">Applied</p>
                </div>
                <div>
                  <p className="font-bold text-lg">5</p>
                  <p className="text-xs text-gray-500">Interviews</p>
                </div>
                <div className="h-24">
                  <ResponsiveContainer>
                    <RadialBarChart
                      cx="50%"
                      cy="50%"
                      innerRadius="70%"
                      outerRadius="100%"
                      barSize={10}
                      data={[{ name: "Match", value: 82, fill: "#A6C1EE" }]}
                    >
                      <RadialBar minAngle={15} background dataKey="value" cornerRadius={50} />
                      <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-gray-700 text-sm font-semibold"
                      >
                        82%
                      </text>
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <p className="text-xs text-gray-500 mt-1">Match</p>
                </div>
              </div>
            </div>

            {/* Skills Card */}
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <h3 className="font-semibold mb-4">Skills</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={skills}>
                  <XAxis dataKey="name" stroke="#888" />
                  <Tooltip />
                  <Bar dataKey="level" fill="#A6C1EE" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Education */}
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <h3 className="font-semibold mb-3">Education</h3>
              {education.map((ed, i) => (
                <div key={i} className="mb-3">
                  <p className="font-medium text-gray-700 flex items-center gap-2">
                    <FaGraduationCap /> {ed.degree}
                  </p>
                  <p className="text-sm text-gray-500">
                    {ed.school} · {ed.year}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Section */}
          <div className="lg:col-span-2 space-y-6">
            {editing && (
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <h3 className="font-semibold mb-3">Edit Profile</h3>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Full name"
                  className="w-full rounded-md border px-3 py-2 mb-3"
                />
                <input
                  value={form.headline}
                  onChange={(e) => setForm({ ...form, headline: e.target.value })}
                  placeholder="Headline"
                  className="w-full rounded-md border px-3 py-2 mb-3"
                />
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="Your bio"
                  className="w-full rounded-md border px-3 py-2 mb-3"
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 rounded-lg bg-gradient-to-tr from-pink-200 to-blue-200 font-medium"
                  >
                    <FaCheck className="inline mr-2" /> Save
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="px-4 py-2 rounded-lg bg-gray-100"
                  >
                    <FaTimes className="inline mr-2" /> Cancel
                  </button>
                </div>
              </div>
            )}

            {/* About */}
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <h3 className="font-semibold mb-2">About</h3>
              <p className="text-gray-700">
                {user.bio || "Add a short summary of who you are, your strengths, and what roles you're seeking."}
              </p>
            </div>

            {/* Experience */}
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <h3 className="font-semibold mb-4">Experience</h3>
              {experience.map((exp, i) => (
                <div key={i} className="mb-4">
                  <p className="font-medium text-gray-800 flex items-center gap-2">
                    <FaBriefcase /> {exp.role}
                  </p>
                  <p className="text-sm text-gray-500">{exp.company} · {exp.duration}</p>
                  <ul className="list-disc ml-6 mt-2 text-sm text-gray-600">
                    {exp.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Projects */}
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <h3 className="font-semibold mb-4">Projects</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {projects.map((p, i) => (
                  <div key={i} className="p-4 rounded-lg border hover:shadow-md transition">
                    <p className="font-medium">{p.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{p.description}</p>
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-block text-indigo-600 text-sm"
                    >
                      View Project <FaExternalLinkAlt className="inline text-xs" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Applications */}
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <h3 className="font-semibold mb-4">Applications</h3>
              {applications.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:shadow transition mb-2"
                >
                  <div>
                    <p className="font-medium">{a.title}</p>
                    <p className="text-sm text-gray-500">{a.company}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        a.status === "Offer"
                          ? "bg-green-100 text-green-700"
                          : a.status === "Interview"
                          ? "bg-yellow-100 text-yellow-700"
                          : a.status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {a.status}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">{a.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
