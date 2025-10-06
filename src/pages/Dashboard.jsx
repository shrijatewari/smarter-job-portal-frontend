import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import api from "../utils/api";
import { FaUserCircle, FaBell, FaHeart, FaRegHeart, FaExternalLinkAlt, FaBookmark } from "react-icons/fa";
import AIInsights from "../components/AIInsights"; // ✅ Import AIInsights
import SavedInternships from "../components/SavedInternships"; // ✅ Import SavedInternships

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applicationData, setApplicationData] = useState([]);
  const [recommendedInternships, setRecommendedInternships] = useState([]);
  const [savedInternships, setSavedInternships] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No auth token found");
          setLoading(false);
          return;
        }

        console.log("Fetching profile with token:", token ? "Token present" : "No token");
        const res = await api.get("/api/auth/profile");
        console.log("Profile fetch successful:", res.data);
        setUser(res.data);
      } catch (err) {
        console.error("Profile fetch error:", err.response?.data || err.message);
        // Check if it's an authentication error
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        } else {
          alert("Failed to fetch user profile: " + (err.response?.data?.message || err.message));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Fetch dashboard data when user changes
  useEffect(() => {
    if (user) {
      const fetchDashboardData = async () => {
        // Load user's applications
        if (user?.appliedInternships) {
          setApplicationData(user.appliedInternships.map(app => ({
            id: app.internshipId,
            title: app.title,
            company: app.company,
            date: new Date(app.dateApplied).toLocaleDateString(),
            status: app.status
          })));
        }

        // Load saved internships
        if (user?.savedInternships) {
          setSavedInternships(user.savedInternships);
        }

        // Fetch personalized recommendations
        try {
          const res = await api.get("/api/recommendations/recommended");
          setRecommendedInternships(res.data || []);
          if (res.data && res.data.length > 0) {
            setMessage(""); // Clear any error messages
          }
        } catch (err) {
          console.error("Failed to load recommendations:", err);
          setMessage("Failed to load recommendations");
          // Set fallback recommendations on error
          setRecommendedInternships([
            {
              _id: 'error-fallback-1',
              title: 'Frontend Developer Intern',
              company: 'TechFlow',
              location: 'Remote',
              description: 'Build modern web applications using React and TypeScript.',
              score: 85,
              url: '#'
            },
            {
              _id: 'error-fallback-2',
              title: 'Backend Developer Intern', 
              company: 'DataCorp',
              location: 'San Francisco, CA',
              description: 'Work on server-side applications using Node.js and databases.',
              score: 82,
              url: '#'
            }
          ]);
        }
      };
      fetchDashboardData();
    }
  }, [user]);

  // Listen for profile updates and refresh data
  useEffect(() => {
    const handleProfileUpdate = (event) => {
      console.log('🔄 Profile updated, refreshing dashboard data...', event.detail);
      setMessage('Profile updated! Refreshing recommendations...');
      
      // Refresh user data and recommendations
      if (user) {
        setTimeout(() => {
          const fetchUpdatedData = async () => {
            try {
              // Refetch user profile
              const userRes = await api.get("/api/auth/profile");
              setUser(userRes.data);
              
              // Refetch recommendations with updated profile
              const recRes = await api.get("/api/recommendations/recommended");
              setRecommendedInternships(recRes.data || []);
              
              setMessage('Dashboard refreshed with updated recommendations!');
              setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
            } catch (err) {
              console.error('Failed to refresh dashboard data:', err);
              setMessage('Failed to refresh data. Please reload the page.');
            }
          };
          fetchUpdatedData();
        }, 1000); // Small delay to allow backend to process
      }
    };

    // Add event listener
    window.addEventListener('profileUpdated', handleProfileUpdate);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, [user]);

  // Helper functions for Save/Apply actions
  const handleSaveInternship = async (internship) => {
    try {
      await api.post("/api/profile/me/save", {
        internshipId: internship._id || internship.id,
        title: internship.title,
        company: internship.company,
        url: internship.url
      });
      setMessage("Internship saved!");
      // Refresh saved internships
      const res = await api.get("/api/profile/me");
      setSavedInternships(res.data.savedInternships || []);
    } catch (err) {
      console.error("Failed to save internship:", err);
      setMessage("Failed to save internship");
    }
  };

  const handleApplyInternship = async (internship) => {
    try {
      await api.post("/api/profile/me/apply", {
        internshipId: internship._id || internship.id,
        title: internship.title,
        company: internship.company
      });
      setMessage("Application recorded!");
      // Refresh applications
      const res = await api.get("/api/profile/me");
      setApplicationData(res.data.appliedInternships.map(app => ({
        id: app.internshipId,
        title: app.title,
        company: app.company,
        date: new Date(app.dateApplied).toLocaleDateString(),
        status: app.status
      })));
    } catch (err) {
      console.error("Failed to apply:", err);
      setMessage("Failed to record application");
    }
  };

  const isSaved = (internship) => {
    return savedInternships.some(saved => 
      saved.internshipId === (internship._id || internship.id)
    );
  };

  const isApplied = (internship) => {
    return applicationData.some(app => 
      app.id === (internship._id || internship.id)
    );
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#FFF3EB] via-[#FFFDF5] to-[#E8FFF4]">
        <p className="text-lg text-[#4A4A4A]">Loading dashboard...</p>
      </div>
    );

  if (!user)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#FFF3EB] via-[#FFFDF5] to-[#E8FFF4]">
        <p className="text-lg text-red-500">User not found.</p>
      </div>
    );

  return (
    <div
      className="min-h-screen flex font-[Inter] bg-gradient-to-br from-[#FFF3EB] via-[#FFFDF5] to-[#E8FFF4]"
    >
      {/* Sidebar */}
      <aside className="w-72 p-8 backdrop-blur-md shadow-xl flex flex-col bg-white/70">
        <h2 className="text-2xl font-extrabold mb-10 tracking-wide text-[#4A4A4A]">
          Internship Portal
        </h2>

        <nav className="flex flex-col gap-3">
          {[
            { label: "Dashboard", to: "/dashboard" },
            { label: "Browse Internships", to: "/internships" },
            { label: "Analytics", to: "/analytics" },
            { label: "Applied Internships", to: "/applied" },
            { label: "Saved Internships", to: "/saved" },
            { label: "Profile Settings", to: "/profile" },
            { label: "Help & Support", to: "/help" },
          ].map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `block w-full text-center py-3 px-4 rounded-lg transition-all duration-200 
                ${
                  isActive
                    ? "font-semibold shadow-md bg-gradient-to-tr from-[#FFD3FF] to-[#A6C1EE] text-[#4A4A4A]"
                    : "hover:shadow-md hover:bg-white/50 text-[#7A7A7A]"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 space-y-10 overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[#4A4A4A]">
            Welcome back, {user.name} 👋
          </h1>

          <div className="flex items-center space-x-6">
            <div className="relative cursor-pointer">
              <FaBell className="text-2xl text-[#7A7A7A]" />
              <span className="absolute top-0 right-0 inline-block w-2 h-2 rounded-full bg-[#4A4A4A]"></span>
            </div>
            <FaUserCircle className="text-4xl cursor-pointer text-[#7A7A7A]" />
          </div>
        </header>

        {/* Applications */}
        <section>
          <h2 className="text-xl font-bold mb-6 text-[#4A4A4A]">Your Applications</h2>
          {applicationData.length === 0 ? (
            <div className="p-8 text-center rounded-2xl shadow-lg bg-white/70 backdrop-blur-md">
              <p className="text-[#7A7A7A]">No applications yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {applicationData.map((app) => (
                <div
                  key={app.id}
                  className="p-6 rounded-2xl shadow-lg flex justify-between items-center hover:shadow-xl transition bg-white/70 backdrop-blur-md"
                >
                  <div>
                    <h3 className="font-semibold text-lg text-[#4A4A4A]">{app.title}</h3>
                    <p className="text-[#7A7A7A]">{app.company}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-[#4A4A4A]">{app.status}</p>
                    <p className="text-sm text-[#7A7A7A]">{app.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Message Display */}
        {message && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.includes("success") || message.includes("saved") || message.includes("recorded") 
              ? "bg-green-100 text-green-800" 
              : "bg-red-100 text-red-800"
          }`}>
            {message}
          </div>
        )}

        {/* Saved Internships */}
        <section>
          <SavedInternships 
            savedInternships={savedInternships}
            onRemove={async (internshipId) => {
              try {
                // Call backend to remove the internship
                await api.delete(`/api/users/${user._id}/saved-internships/${internshipId}`);
                
                // Remove from local state
                setSavedInternships(prev => prev.filter(saved => {
                  const savedId = saved.internshipId || saved._id || saved.id;
                  return savedId !== internshipId;
                }));
                setMessage("Internship removed from saved list!");
              } catch (error) {
                console.error('Failed to remove internship:', error);
                setMessage("Failed to remove internship");
              }
            }}
            onApply={handleApplyInternship}
          />
        </section>

        {/* Recommended Internships */}
        <section>
          <h2 className="text-xl font-bold mb-6 text-[#4A4A4A]">Recommended Internships</h2>
          {recommendedInternships.length === 0 ? (
            <div className="p-8 text-center rounded-2xl shadow-lg bg-white/70 backdrop-blur-md">
              <p className="text-[#7A7A7A]">No recommendations available. Update your profile and preferences to get personalized recommendations!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendedInternships.map((internship) => (
                <div
                  key={internship._id || internship.id}
                  className="p-6 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition space-y-4 bg-white/70 backdrop-blur-md"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-[#4A4A4A]">{internship.title}</h3>
                      <p className="text-[#7A7A7A]">{internship.company}</p>
                      <p className="text-sm text-[#7A7A7A]">{internship.location}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium px-3 py-1 rounded-full bg-gradient-to-tr from-[#FFD3FF] to-[#A6C1EE] text-[#4A4A4A]">
                        Match: {Math.round(internship.score || 0)}%
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm line-clamp-3 text-[#7A7A7A]">{internship.description}</p>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-3">
                    <button
                      onClick={() => handleSaveInternship(internship)}
                      disabled={isSaved(internship)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                        isSaved(internship) 
                          ? "cursor-not-allowed bg-[#7A7A7A] text-white" 
                          : "hover:shadow-md bg-gradient-to-tr from-[#FFD3FF] to-[#A6C1EE] text-[#4A4A4A]"
                      }`}
                    >
                      {isSaved(internship) ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                      {isSaved(internship) ? "Saved" : "Save"}
                    </button>
                    
                    <button
                      onClick={() => handleApplyInternship(internship)}
                      disabled={isApplied(internship)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                        isApplied(internship)
                          ? "cursor-not-allowed bg-[#7A7A7A] text-white"
                          : "hover:shadow-md bg-gradient-to-tr from-[#FFD3FF] to-[#A6C1EE] text-[#4A4A4A]"
                      }`}
                    >
                      <FaExternalLinkAlt />
                      {isApplied(internship) ? "Applied" : "Apply"}
                    </button>
                  </div>

                  {/* AI Insights Component */}
                  <div className="mt-4 p-4 rounded-lg bg-white/50">
                    <AIInsights jobDescription={internship.description} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
