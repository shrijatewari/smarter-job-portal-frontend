// src/components/ProfileEditor.jsx
import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { FaPlus, FaTrash, FaSave, FaUser, FaGraduationCap, FaBriefcase, FaCode, FaUpload, FaCamera, FaFilePdf } from "react-icons/fa";

const ProfileEditor = ({ onProfileUpdate }) => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    headline: "",
    bio: "",
    location: "",
    resumeUrl: "",
    profilePicture: "",
    skills: [],
    education: [],
    experience: [],
    projects: [],
    preferences: {
      keywords: [],
      categories: [],
      locations: [],
      minStipend: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [profilePicFile, setProfilePicFile] = useState(null);

  // Load current profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log("Fetching profile for ProfileEditor...");
        const res = await api.get("/api/user/profile");
        console.log("Profile loaded:", res.data);
        setProfile({
          name: res.data.name || "",
          email: res.data.email || "",
          headline: res.data.headline || "",
          bio: res.data.bio || "",
          location: res.data.location || "",
          resumeUrl: res.data.resumeUrl || "",
          profilePicture: res.data.avatar || "",
          skills: res.data.skills || [],
          education: res.data.education || [],
          experience: res.data.experience || [],
          projects: res.data.projects || [],
          preferences: {
            keywords: res.data.preferences?.keywords || [],
            categories: res.data.preferences?.categories || [],
            locations: res.data.preferences?.locations || [],
            minStipend: res.data.preferences?.minStipend || 0
          }
        });
      } catch (err) {
        console.error("Failed to load profile:", err.response?.data || err.message);
        if (err.response?.status === 401) {
          setMessage("Authentication failed. Please log in again.");
          // Redirect to login
          window.location.href = "/login";
        } else {
          setMessage("Failed to load profile: " + (err.response?.data?.message || err.message));
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Handle file uploads
  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setResumeFile(file);
      setMessage("Resume file selected. Click Save to upload.");
    } else {
      setMessage("Please select a PDF file for resume.");
    }
  };

  const handleProfilePicUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setProfilePicFile(file);
      setMessage("Profile picture selected. Click Save to upload.");
    } else {
      setMessage("Please select an image file for profile picture.");
    }
  };

  // Save profile
  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      console.log("Saving profile:", profile);
      
      // Prepare the profile data for backend
      const profileData = {
        name: profile.name,
        headline: profile.headline,
        bio: profile.bio,
        location: profile.location,
        resumeUrl: profile.resumeUrl,
        skills: profile.skills.filter(skill => skill.trim() !== ""),
        education: profile.education.filter(edu => edu.trim() !== ""),
        experience: profile.experience,
        projects: profile.projects,
        preferences: profile.preferences
      };
      
      // Use the user profile endpoint for updates
      const res = await api.put("/api/user/profile", profileData);
      console.log("Profile saved successfully:", res.data);
      
      setMessage("Profile saved successfully! Your dashboard recommendations will be refreshed.");
      if (onProfileUpdate) onProfileUpdate();
      
      // Trigger dashboard refresh by dispatching a custom event
      window.dispatchEvent(new CustomEvent('profileUpdated', { 
        detail: { profile: res.data, timestamp: Date.now() } 
      }));
      
      // Update local state with response data
      if (res.data) {
        setProfile(prev => ({
          ...prev,
          ...res.data
        }));
      }
    } catch (err) {
      console.error("Failed to save profile:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        setMessage("Authentication failed. Please log in again.");
        window.location.href = "/login";
      } else {
        setMessage("Failed to save profile: " + (err.response?.data?.message || err.message));
      }
    } finally {
      setSaving(false);
    }
  };

  // Helper functions for dynamic arrays
  const addSkill = () => {
    setProfile(prev => ({ ...prev, skills: [...prev.skills, ""] }));
  };

  const updateSkill = (index, value) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.map((s, i) => i === index ? value : s)
    }));
  };

  const removeSkill = (index) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addEducation = () => {
    setProfile(prev => ({ ...prev, education: [...prev.education, ""] }));
  };

  const updateEducation = (index, value) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.map((e, i) => i === index ? value : e)
    }));
  };

  const removeEducation = (index) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addExperience = () => {
    setProfile(prev => ({
      ...prev,
      experience: [...prev.experience, {
        title: "",
        company: "",
        startDate: "",
        endDate: "",
        description: ""
      }]
    }));
  };

  const updateExperience = (index, field, value) => {
    setProfile(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (index) => {
    setProfile(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const addProject = () => {
    setProfile(prev => ({
      ...prev,
      projects: [...prev.projects, {
        name: "",
        description: "",
        url: "",
        tags: []
      }]
    }));
  };

  const updateProject = (index, field, value) => {
    setProfile(prev => ({
      ...prev,
      projects: prev.projects.map((proj, i) => 
        i === index ? { ...proj, [field]: value } : proj
      )
    }));
  };

  const removeProject = (index) => {
    setProfile(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const updatePreferences = (field, value) => {
    setProfile(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [field]: value }
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg" style={{ color: "var(--muted)" }}>Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF3EB] via-[#FFFDF5] to-[#E8FFF4]">
      {/* Hero Section with proper spacing */}
      <div className="text-center px-6" style={{ paddingTop: "6rem", paddingBottom: "4rem" }}>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#4A4A4A]">
          Build Your Professional Profile 🚀
        </h1>
        <p className="text-lg text-[#7A7A7A]">
          Create a comprehensive profile to get personalized internship recommendations
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6" style={{ paddingBottom: "6rem" }}>

        {message && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.includes("success") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}>
            {message}
          </div>
        )}

        <div className="space-y-8">
          {/* Profile Picture & Resume Upload */}
          <section className="p-6 rounded-xl shadow bg-white/70 backdrop-blur-md">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#4A4A4A]">
              <FaCamera /> Profile Media
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Picture */}
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-[#4A4A4A]">
                  {profilePicFile ? (
                    <img 
                      src={URL.createObjectURL(profilePicFile)} 
                      alt="Profile Preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : profile.profilePicture ? (
                    <img 
                      src={profile.profilePicture} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#7A7A7A]">
                      <FaUser className="text-4xl text-white" />
                    </div>
                  )}
                </div>
                <label className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition hover:shadow-md bg-gradient-to-tr from-[#FFD3FF] to-[#A6C1EE] text-[#4A4A4A]">
                  <FaUpload />
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Resume Upload */}
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-lg flex items-center justify-center border-4 border-[#4A4A4A] bg-[#7A7A7A]">
                  <FaFilePdf className="text-4xl text-white" />
                </div>
                <label className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition hover:shadow-md bg-gradient-to-tr from-[#FFD3FF] to-[#A6C1EE] text-[#4A4A4A]">
                  <FaUpload />
                  Upload Resume
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleResumeUpload}
                    className="hidden"
                  />
                </label>
                {resumeFile && (
                  <p className="text-sm mt-2 text-[#7A7A7A]">
                    Selected: {resumeFile.name}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Basic Info */}
          <section className="p-6 rounded-xl shadow bg-white/70 backdrop-blur-md">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#4A4A4A]">
              <FaUser /> Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-[#4A4A4A]">Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 rounded-lg border transition hover:shadow-md focus:ring-2 focus:ring-opacity-50 bg-white/90 border-[#7A7A7A] text-[#4A4A4A] focus:ring-[#4A4A4A]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-[#4A4A4A]">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full p-3 rounded-lg border opacity-50 bg-white/90 border-[#7A7A7A] text-[#4A4A4A]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-[#4A4A4A]">Headline</label>
                <input
                  type="text"
                  value={profile.headline}
                  onChange={(e) => setProfile(prev => ({ ...prev, headline: e.target.value }))}
                  placeholder="e.g., Computer Science Student"
                  className="w-full p-3 rounded-lg border transition hover:shadow-md focus:ring-2 focus:ring-opacity-50 bg-white/90 border-[#7A7A7A] text-[#4A4A4A] focus:ring-[#4A4A4A]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-[#4A4A4A]">Location</label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., Bengaluru, India"
                  className="w-full p-3 rounded-lg border transition hover:shadow-md focus:ring-2 focus:ring-opacity-50 bg-white/90 border-[#7A7A7A] text-[#4A4A4A] focus:ring-[#4A4A4A]"
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium mb-2 text-[#4A4A4A]">Bio</label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell us about yourself, your interests, and career goals..."
                rows={4}
                className="w-full p-3 rounded-lg border transition hover:shadow-md focus:ring-2 focus:ring-opacity-50 bg-white/90 border-[#7A7A7A] text-[#4A4A4A] focus:ring-[#4A4A4A]"
              />
            </div>
        </section>

          {/* Skills */}
          <section className="p-6 rounded-xl shadow bg-white/70 backdrop-blur-md">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#4A4A4A]">
              <FaCode /> Skills
            </h2>
            <div className="space-y-4">
              {profile.skills.map((skill, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => updateSkill(index, e.target.value)}
                    placeholder="e.g., React, Python, SQL"
                    className="flex-1 p-3 rounded-lg border transition hover:shadow-md focus:ring-2 focus:ring-opacity-50"
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.9)', 
                      borderColor: '#7A7A7A', 
                      color: '#4A4A4A',
                      focusRingColor: '#4A4A4A'
                    }}
                  />
                  <button
                    onClick={() => removeSkill(index)}
                    className="p-3 rounded-lg text-red-600 hover:bg-red-50 transition hover:shadow-md"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              <button
                onClick={addSkill}
                className="flex items-center gap-2 p-4 rounded-lg border-2 border-dashed transition hover:shadow-md"
                style={{ borderColor: '#4A4A4A', color: '#4A4A4A' }}
              >
                <FaPlus /> Add Skill
              </button>
            </div>
        </section>

          {/* Education */}
          <section className="p-6 rounded-xl shadow bg-white/70 backdrop-blur-md">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#4A4A4A]">
              <FaGraduationCap /> Education
            </h2>
            <div className="space-y-4">
              {profile.education.map((edu, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    value={edu}
                    onChange={(e) => updateEducation(index, e.target.value)}
                    placeholder="e.g., B.Tech Computer Science - IIT Delhi (2021-2025)"
                    className="flex-1 p-3 rounded-lg border transition hover:shadow-md focus:ring-2 focus:ring-opacity-50"
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.9)', 
                      borderColor: '#7A7A7A', 
                      color: '#4A4A4A',
                      focusRingColor: '#4A4A4A'
                    }}
                  />
                  <button
                    onClick={() => removeEducation(index)}
                    className="p-3 rounded-lg text-red-600 hover:bg-red-50 transition hover:shadow-md"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              <button
                onClick={addEducation}
                className="flex items-center gap-2 p-4 rounded-lg border-2 border-dashed transition hover:shadow-md"
                style={{ borderColor: '#4A4A4A', color: '#4A4A4A' }}
              >
                <FaPlus /> Add Education
              </button>
            </div>
          </section>

          {/* Experience */}
          <section className="p-6 rounded-xl shadow bg-white/70 backdrop-blur-md">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#4A4A4A]">
              <FaBriefcase /> Experience
            </h2>
            <div className="space-y-6">
              {profile.experience.map((exp, index) => (
                <div key={index} className="p-6 rounded-lg border border-[#7A7A7A] bg-white/50">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-medium text-lg text-[#4A4A4A]">Experience #{index + 1}</h3>
                    <button
                      onClick={() => removeExperience(index)}
                      className="text-red-600 hover:bg-red-50 p-2 rounded transition"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) => updateExperience(index, "title", e.target.value)}
                      placeholder="Job Title"
                      className="p-3 rounded-lg border transition hover:shadow-md focus:ring-2 focus:ring-opacity-50"
                      style={{ 
                        background: 'var(--card)', 
                        borderColor: 'var(--border)', 
                        color: 'var(--text-primary)',
                        focusRingColor: 'var(--primary)'
                      }}
                    />
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateExperience(index, "company", e.target.value)}
                      placeholder="Company"
                      className="p-3 rounded-lg border transition hover:shadow-md focus:ring-2 focus:ring-opacity-50"
                      style={{ 
                        background: 'var(--card)', 
                        borderColor: 'var(--border)', 
                        color: 'var(--text-primary)',
                        focusRingColor: 'var(--primary)'
                      }}
                    />
                    <input
                      type="date"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(index, "startDate", e.target.value)}
                      placeholder="Start Date"
                      className="p-3 rounded-lg border transition hover:shadow-md focus:ring-2 focus:ring-opacity-50"
                      style={{ 
                        background: 'var(--card)', 
                        borderColor: 'var(--border)', 
                        color: 'var(--text-primary)',
                        focusRingColor: 'var(--primary)'
                      }}
                    />
                    <input
                      type="date"
                      value={exp.endDate}
                      onChange={(e) => updateExperience(index, "endDate", e.target.value)}
                      placeholder="End Date"
                      className="p-3 rounded-lg border transition hover:shadow-md focus:ring-2 focus:ring-opacity-50"
                      style={{ 
                        background: 'var(--card)', 
                        borderColor: 'var(--border)', 
                        color: 'var(--text-primary)',
                        focusRingColor: 'var(--primary)'
                      }}
                    />
                  </div>
                  <textarea
                    value={exp.description}
                    onChange={(e) => updateExperience(index, "description", e.target.value)}
                    placeholder="Describe your role and achievements..."
                    rows={3}
                    className="w-full mt-4 p-3 rounded-lg border transition hover:shadow-md focus:ring-2 focus:ring-opacity-50"
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.9)', 
                      borderColor: '#7A7A7A', 
                      color: '#4A4A4A',
                      focusRingColor: '#4A4A4A'
                    }}
                  />
                </div>
              ))}
              <button
                onClick={addExperience}
                className="flex items-center gap-2 p-4 rounded-lg border-2 border-dashed transition hover:shadow-md"
                style={{ borderColor: '#4A4A4A', color: '#4A4A4A' }}
              >
                <FaPlus /> Add Experience
              </button>
            </div>
        </section>

          {/* Projects */}
          <section className="p-6 rounded-xl shadow bg-white/70 backdrop-blur-md">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#4A4A4A]">
              <FaCode /> Projects
            </h2>
            <div className="space-y-6">
              {profile.projects.map((proj, index) => (
                <div key={index} className="p-6 rounded-lg border border-[#7A7A7A] bg-white/50">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-medium text-lg text-[#4A4A4A]">Project #{index + 1}</h3>
                    <button
                      onClick={() => removeProject(index)}
                      className="text-red-600 hover:bg-red-50 p-2 rounded transition"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={proj.name}
                      onChange={(e) => updateProject(index, "name", e.target.value)}
                      placeholder="Project Name"
                      className="w-full p-3 rounded-lg border transition hover:shadow-md focus:ring-2 focus:ring-opacity-50"
                      style={{ 
                        background: 'var(--card)', 
                        borderColor: 'var(--border)', 
                        color: 'var(--text-primary)',
                        focusRingColor: 'var(--primary)'
                      }}
                    />
                    <textarea
                      value={proj.description}
                      onChange={(e) => updateProject(index, "description", e.target.value)}
                      placeholder="Project description..."
                      rows={3}
                      className="w-full p-3 rounded-lg border transition hover:shadow-md focus:ring-2 focus:ring-opacity-50"
                      style={{ 
                        background: 'var(--card)', 
                        borderColor: 'var(--border)', 
                        color: 'var(--text-primary)',
                        focusRingColor: 'var(--primary)'
                      }}
                    />
                    <input
                      type="url"
                      value={proj.url}
                      onChange={(e) => updateProject(index, "url", e.target.value)}
                      placeholder="Project URL (GitHub, Live Demo, etc.)"
                      className="w-full p-3 rounded-lg border transition hover:shadow-md focus:ring-2 focus:ring-opacity-50"
                      style={{ 
                        background: 'var(--card)', 
                        borderColor: 'var(--border)', 
                        color: 'var(--text-primary)',
                        focusRingColor: 'var(--primary)'
                      }}
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={addProject}
                className="flex items-center gap-2 p-4 rounded-lg border-2 border-dashed transition hover:shadow-md"
                style={{ borderColor: '#4A4A4A', color: '#4A4A4A' }}
              >
                <FaPlus /> Add Project
              </button>
            </div>
        </section>

          {/* Preferences */}
          <section className="p-6 rounded-xl shadow bg-white/70 backdrop-blur-md">
            <h2 className="text-xl font-bold mb-6 text-[#4A4A4A]">
              Job Preferences
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-[#4A4A4A]">
                  Preferred Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  value={profile.preferences.keywords.join(", ")}
                  onChange={(e) => updatePreferences("keywords", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                  placeholder="e.g., React, Python, Machine Learning"
                  className="w-full p-3 rounded-lg border transition hover:shadow-md focus:ring-2 focus:ring-opacity-50"
                  style={{ 
                    background: 'var(--card)', 
                    borderColor: 'var(--border)', 
                    color: 'var(--text-primary)',
                    focusRingColor: 'var(--primary)'
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-[#4A4A4A]">
                  Preferred Locations (comma-separated)
                </label>
                <input
                  type="text"
                  value={profile.preferences.locations.join(", ")}
                  onChange={(e) => updatePreferences("locations", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                  placeholder="e.g., Remote, Bengaluru, Mumbai"
                  className="w-full p-3 rounded-lg border transition hover:shadow-md focus:ring-2 focus:ring-opacity-50"
                  style={{ 
                    background: 'var(--card)', 
                    borderColor: 'var(--border)', 
                    color: 'var(--text-primary)',
                    focusRingColor: 'var(--primary)'
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-[#4A4A4A]">
                  Minimum Stipend (₹)
                </label>
                <input
                  type="number"
                  value={profile.preferences.minStipend}
                  onChange={(e) => updatePreferences("minStipend", parseInt(e.target.value) || 0)}
                  placeholder="10000"
                  className="w-full p-3 rounded-lg border transition hover:shadow-md focus:ring-2 focus:ring-opacity-50"
                  style={{ 
                    background: 'var(--card)', 
                    borderColor: 'var(--border)', 
                    color: 'var(--text-primary)',
                    focusRingColor: 'var(--primary)'
                  }}
                />
              </div>
            </div>
          </section>

          {/* Save Button */}
          <div className="flex justify-center pt-8">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-3 px-8 py-4 rounded-lg font-semibold transition hover:scale-105 hover:shadow-md bg-gradient-to-tr from-[#FFD3FF] to-[#A6C1EE] text-[#4A4A4A]"
              style={{ 
                fontSize: '1.1rem'
              }}
            >
              <FaSave />
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditor;
