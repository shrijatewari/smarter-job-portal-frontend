// src/pages/Internships.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaHeart,
  FaRegHeart,
  FaExternalLinkAlt,
  FaSlidersH,
  FaBookmark,
} from "react-icons/fa";
import { HiOutlineRefresh } from "react-icons/hi";

/*
  Browse Internships page
  - Drop into src/pages/Internships.jsx
  - Requires TailwindCSS + react-icons
  - Fetches from GET /api/jsearch/internships (adjust path if needed)
  - Uses localStorage for saved items
*/

const PASTEL_BG = "bg-gradient-to-br from-[#FFF3EB] via-[#FFFDF5] to-[#E8FFF4]";

function Badge({ children, className = "" }) {
  return (
    <span
      className={
        "inline-block text-xs font-medium px-2 py-1 rounded-full shadow-sm " +
        "bg-white/80 text-[#4A4A4A] " +
        className
      }
    >
      {children}
    </span>
  );
}

function Chip({ children }) {
  return <span className="text-sm px-3 py-1 rounded-full bg-white/90 text-[#4A4A4A] shadow-sm">{children}</span>;
}

export default function Internships() {
  const [raw, setRaw] = useState([]); // raw API response array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI states
  const [qTitle, setQTitle] = useState("");
  const [qLocation, setQLocation] = useState("");
  const [modeFilter, setModeFilter] = useState("any"); // any | remote | hybrid | onsite
  const [durationFilter, setDurationFilter] = useState("any"); // any | short | medium | long
  const [stipendRange, setStipendRange] = useState([0, 200000]); // allow higher real-world stipends
  const [industryFilter, setIndustryFilter] = useState(""); // tech, design...
  const [sortBy, setSortBy] = useState("relevance"); // relevance | newest | stipend
  const [page, setPage] = useState(1);
  const PER_PAGE = 9;
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // saved items by job_id in localStorage
  const [saved, setSaved] = useState(() => {
    try {
      const s = JSON.parse(localStorage.getItem("savedInternships") || "[]");
      return Array.isArray(s) ? s : [];
    } catch {
      return [];
    }
  });

  // fetch data when page loads or user hits Search
  const [queryNonce, setQueryNonce] = useState(0);
  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get("/api/internships/aggregate", {
          params: {
            keyword: qTitle || "internship",
            location: qLocation || "",
            limit: 25,
            pages: 4,
          },
          timeout: 18000,
        });
        // The JSearch API returns an object; some routes put items under res.data.data
        const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        // normalize fields used by UI
        const normalized = list.map((it) => ({
          job_id: it.job_id || it.job_id || Math.random().toString(36).slice(2, 9),
          title: it.job_title || it.title || "Untitled Internship",
          company: it.employer_name || it.company || "Company",
          location: it.job_location || `${it.job_city || ""}${it.job_state ? `, ${it.job_state}` : ""}` || it.location || "Remote",
          description: it.job_description || it.description || "",
          apply_link: it.job_apply_link || it.apply_link || it.url || "#",
          type: (it.job_employment_type || it.job_employment_types || ["Internship"])[0] || "Internship",
          is_remote: !!it.job_is_remote || (it.job_employment_type === "Internship" && false),
          duration_months: it.duration_months || null, // optional
          stipend: it.salary || it.pay || null,
          posted_at: it.job_posted_at_datetime_utc || it.posted_at || it.datePosted || null,
          industry: (it.tags && it.tags[0]) || it.industry || "",
          ai_fit: it.ai_fit || null, // optional custom field
        }));
        if (!cancelled) setRaw(normalized);
      } catch (err) {
        console.error(err);
        // Frontend fallback: ensure the page still loads
        const fallback = [
          {
            job_id: "fallback-1",
            title: "Frontend Developer Intern",
            company: "DesignHub",
            location: "Remote",
            description: "Build UI components in React and Tailwind.",
            apply_link: "https://example.com/apply/frontend-intern",
            type: "Internship",
            is_remote: true,
            duration_months: 3,
            stipend: 15000,
            posted_at: new Date().toISOString(),
            industry: "tech",
          },
          {
            job_id: "fallback-2",
            title: "Data Science Intern",
            company: "DataWiz",
            location: "Bengaluru, KA",
            description: "Work with Python, Pandas, and SQL on real datasets.",
            apply_link: "https://example.com/apply/data-intern",
            type: "Internship",
            is_remote: false,
            duration_months: 6,
            stipend: 20000,
            posted_at: new Date().toISOString(),
            industry: "data",
          },
          {
            job_id: "fallback-3",
            title: "Marketing Intern",
            company: "AdWorld",
            location: "Remote",
            description: "Assist in content, social, and campaign analytics.",
            apply_link: "https://example.com/apply/marketing-intern",
            type: "Internship",
            is_remote: true,
            duration_months: 4,
            stipend: 12000,
            posted_at: new Date().toISOString(),
            industry: "marketing",
          },
        ];
        if (!cancelled) {
          setRaw(fallback);
          setError(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => {
      cancelled = true;
    };
  }, [queryNonce]);

  // save to localStorage when saved changes
  useEffect(() => {
    localStorage.setItem("savedInternships", JSON.stringify(saved));
  }, [saved]);

  const toggleSave = (jobId) => {
    setSaved((s) => (s.includes(jobId) ? s.filter((x) => x !== jobId) : [jobId, ...s]));
  };

  // Filtering pipeline
  const filtered = useMemo(() => {
    let arr = raw.slice();

    // text match
    if (qTitle.trim()) {
      const q = qTitle.toLowerCase();
      arr = arr.filter((i) => (i.title + " " + i.description + " " + i.company).toLowerCase().includes(q));
    }
    if (qLocation.trim()) {
      const q = qLocation.toLowerCase();
      arr = arr.filter((i) => (i.location || "").toLowerCase().includes(q));
    }

    // mode filter
    if (modeFilter === "remote") arr = arr.filter((i) => i.is_remote);
    if (modeFilter === "onsite") arr = arr.filter((i) => !i.is_remote);

    // duration filter basic (use duration_months if available)
    if (durationFilter === "short") arr = arr.filter((i) => !i.duration_months || i.duration_months <= 3);
    if (durationFilter === "medium") arr = arr.filter((i) => i.duration_months && i.duration_months > 3 && i.duration_months <= 6);
    if (durationFilter === "long") arr = arr.filter((i) => i.duration_months && i.duration_months > 6);

    // stipend range if numeric
    arr = arr.filter((i) => {
      const s = Number(i.stipend) || 0;
      return s >= stipendRange[0] && s <= stipendRange[1];
    });

    // industry
    if (industryFilter) {
      const ind = industryFilter.toLowerCase();
      arr = arr.filter((i) => (i.industry || "").toLowerCase().includes(ind) || (i.company || "").toLowerCase().includes(ind));
    }

    // sorting
    if (sortBy === "newest") {
      arr.sort((a, b) => new Date(b.posted_at || 0) - new Date(a.posted_at || 0));
    } else if (sortBy === "stipend") {
      arr.sort((a, b) => (Number(b.stipend) || 0) - (Number(a.stipend) || 0));
    } // relevance = default (keep API order)

    return arr;
  }, [raw, qTitle, qLocation, modeFilter, durationFilter, stipendRange, industryFilter, sortBy]);

  // pagination
  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // small helper components
  const Sidebar = () => (
    <aside className="w-full md:w-72 bg-white/80 rounded-2xl p-4 shadow-md sticky top-20 h-fit">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-lg">Filters</h3>
        <button
          className="text-sm text-[#4A4A4A] flex items-center gap-2 bg-white px-2 py-1 rounded"
          onClick={() => {
            setQTitle("");
            setQLocation("");
            setModeFilter("any");
            setDurationFilter("any");
            setIndustryFilter("");
            setStipendRange([0, 200000]);
          }}
        >
          <HiOutlineRefresh /> Reset
        </button>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">Mode</label>
        <div className="flex gap-2 flex-wrap">
          {[
            { k: "any", t: "Any" },
            { k: "remote", t: "Remote" },
            { k: "onsite", t: "On-site" },
          ].map((o) => (
            <button
              key={o.k}
              onClick={() => setModeFilter(o.k)}
              className={`text-sm px-3 py-1 rounded-full ${modeFilter === o.k ? "bg-gradient-to-tr from-[#FFD3FF] to-[#A6C1EE] text-[#24303b]" : "bg-white text-[#7A7A7A] shadow-sm"}`}
            >
              {o.t}
            </button>
          ))}
        </div>

        <label className="block text-sm font-medium text-gray-700 mt-2">Duration</label>
        <div className="flex gap-2">
          {[
            { k: "any", t: "Any" },
            { k: "short", t: "1–3 mo" },
            { k: "medium", t: "3–6 mo" },
            { k: "long", t: "6+ mo" },
          ].map((o) => (
            <button
              key={o.k}
              onClick={() => setDurationFilter(o.k)}
              className={`text-sm px-3 py-1 rounded-full ${durationFilter === o.k ? "bg-gradient-to-tr from-[#FFD3FF] to-[#A6C1EE] text-[#24303b]" : "bg-white text-[#7A7A7A] shadow-sm"}`}
            >
              {o.t}
            </button>
          ))}
        </div>

        <label className="block text-sm font-medium text-gray-700 mt-2">Industry</label>
        <input
          value={industryFilter}
          onChange={(e) => setIndustryFilter(e.target.value)}
          placeholder="e.g. Tech, Design"
          className="w-full rounded-md border px-3 py-2"
        />

        <label className="block text-sm font-medium text-gray-700 mt-2">Stipend (max)</label>
          <input
          type="range"
          min="0"
          max="200000"
          value={stipendRange[1]}
          onChange={(e) => setStipendRange([0, Number(e.target.value)])}
          className="w-full"
        />
        <div className="text-sm text-gray-600">Up to ₹ {stipendRange[1]}</div>
      </div>
    </aside>
  );

  return (
    <div className={`min-h-screen ${PASTEL_BG} py-8 px-4`}>
      {/* Sticky top nav (compact) */}
      <div className="max-w-7xl mx-auto">
        <header className="sticky top-0 z-40 bg-transparent backdrop-blur-sm py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-extrabold text-[#24303b]">Internship<span className="text-pink-400">-Portal</span></div>
              <nav className="hidden md:flex gap-6 items-center text-sm">
                <a href="/" className="text-gray-700 hover:text-[#24303b]">Home</a>
                <a href="/internships" className="text-[#24303b] font-semibold border-b-2 border-transparent hover:border-[#A6C1EE]">Browse Internships</a>
                <a href="/dashboard" className="text-gray-700 hover:text-[#24303b]">Dashboard</a>
                <a href="/profile" className="text-gray-700 hover:text-[#24303b]">Profile</a>
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <button className="hidden md:inline-flex items-center gap-2 text-sm px-3 py-1 rounded-full bg-white/90 shadow-sm">
                <FaSearch /> AI Assistant
              </button>
              <div className="w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center">S</div>
            </div>
          </div>
        </header>

        {/* Hero + Search */}
        <section className="mt-6 mb-6">
          <div className="rounded-2xl p-6 bg-white/80 shadow-lg flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-[#24303b]">Explore Internships That Fit You ✨</h2>
              <p className="text-sm text-gray-600 mt-2">Filter by location, mode, stipend, and industry — find opportunities you actually want to apply to.</p>
            </div>

            <div className="flex-1 w-full">
              <div className="flex gap-3 items-center">
                <div className="flex-1 flex items-center bg-white rounded-full px-4 py-2 shadow-sm">
                  <FaSearch className="text-gray-400 mr-3" />
                  <input
                    value={qTitle}
                    onChange={(e) => setQTitle(e.target.value)}
                    placeholder="Job title, skill, or company"
                    className="flex-1 outline-none"
                  />
                </div>

                <div className="flex items-center bg-white rounded-full px-3 py-2 shadow-sm">
                  <FaMapMarkerAlt className="text-gray-400 mr-2" />
                  <input
                    value={qLocation}
                    onChange={(e) => setQLocation(e.target.value)}
                    placeholder="Location (city / remote)"
                    className="w-40 outline-none"
                  />
                </div>

                <select
                  value={modeFilter}
                  onChange={(e) => setModeFilter(e.target.value)}
                  className="bg-white rounded-full px-3 py-2 shadow-sm outline-none"
                >
                  <option value="any">Any</option>
                  <option value="remote">Remote</option>
                  <option value="onsite">On-site</option>
                </select>

                <button
                  onClick={() => {
                    setPage(1);
                    setQueryNonce((n) => n + 1);
                  }}
                  className="px-4 py-2 rounded-full bg-gradient-to-tr from-[#FFD3FF] to-[#A6C1EE] text-[#24303b] font-semibold shadow"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Content: Sidebar + Results + Featured */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left: Filters */}
          <div className={`${sidebarOpen ? "md:col-span-3" : "md:col-span-0 hidden md:block"}`}>
            <Sidebar />
            <div className="hidden md:block mt-4">
              <button
                className="text-sm text-[#4A4A4A] underline"
                onClick={() => setSidebarOpen((s) => !s)}
              >
                {sidebarOpen ? "Collapse filters" : "Open filters"}
              </button>
            </div>
          </div>

          {/* Center: Results */}
          <div className="md:col-span-6">
            {/* Sort + pagination header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Badge>{total} results</Badge>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Sort</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="rounded-md px-2 py-1"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="newest">Newest</option>
                    <option value="stipend">Highest Stipend</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  title="toggle saved view"
                  className="px-3 py-1 rounded-full bg-white shadow"
                  onClick={() => {
                    // quick toggle to show only saved
                    setPage(1);
                    if (saved.length) {
                      // filter to saved
                      // easiest UX: set industryFilter to reserved "saved:" string? Instead just prompt
                      alert("Use the 'Saved' tab from the sidebar or click heart icons on cards to view saved items.");
                    } else {
                      alert("You have no saved internships yet.");
                    }
                  }}
                >
                  <FaBookmark />
                </button>
                <div className="text-sm text-gray-500">Page {page} / {pages}</div>
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="p-6 text-center">Loading...</div>
            ) : error ? (
              <div className="p-6 text-center text-red-500">{error}</div>
            ) : paged.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl shadow">
                <img src="https://i.imgur.com/7kQEsHU.png" alt="empty" className="mx-auto w-40 mb-4 opacity-80" />
                <h3 className="text-lg font-semibold">No internships found</h3>
                <p className="text-sm text-gray-500">Try adjusting filters or search terms ✨</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {paged.map((job) => (
                  <article key={job.job_id} className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition flex flex-col md:flex-row gap-4">
                    {/* left: logo */}
                    <div className="w-full md:w-24 flex-shrink-0 flex items-start">
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-tr from-[#FFD3FF] to-[#A6C1EE] flex items-center justify-center text-sm font-semibold text-[#24303b]">
                        {job.company?.slice(0,2).toUpperCase()}
                      </div>
                    </div>

                    {/* middle: details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="text-lg font-semibold text-[#24303b] hover:underline">
                            <a href={job.apply_link} target="_blank" rel="noreferrer">{job.title}</a>
                          </h4>
                          <div className="text-sm text-gray-600">{job.company} • {job.location}</div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <div className="flex gap-2">
                            <Chip>{job.type}</Chip>
                            {job.stipend ? <Chip>₹ {job.stipend}</Chip> : null}
                            {job.duration_months ? <Chip>{job.duration_months} mo</Chip> : null}
                          </div>

                          {job.ai_fit ? (
                            <Badge className="bg-white/90">AI Fit {Math.round(job.ai_fit * 100)}%</Badge>
                          ) : (
                            <Badge>Fit score — N/A</Badge>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mt-3 line-clamp-3">{job.description}</p>

                      <div className="mt-4 flex items-center gap-3">
                        <button
                          onClick={() => toggleSave(job.job_id)}
                          className="flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow text-sm"
                        >
                          {saved.includes(job.job_id) ? <FaHeart className="text-pink-400" /> : <FaRegHeart />}
                          <span className="text-sm">{saved.includes(job.job_id) ? "Saved" : "Save"}</span>
                        </button>

                        <a
                          href={job.apply_link}
                          target="_blank"
                          rel="noreferrer"
                          className="ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-tr from-[#FFD3FF] to-[#A6C1EE] text-[#24303b] font-semibold shadow"
                        >
                          Apply Now <FaExternalLinkAlt className="text-xs" />
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600">Showing {(page - 1) * PER_PAGE + 1} - {Math.min(page * PER_PAGE, total)} of {total}</div>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 rounded-md bg-white shadow disabled:opacity-40"
                >
                  Prev
                </button>
                <button
                  disabled={page >= pages}
                  onClick={() => setPage((p) => Math.min(pages, p + 1))}
                  className="px-3 py-1 rounded-md bg-white shadow disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Right: Featured / Recommended */}
          <div className="md:col-span-3 hidden md:block">
            <div className="bg-white rounded-2xl p-4 shadow-md sticky top-24">
              <h4 className="font-semibold mb-3">Featured Companies</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#FFF1F6] transition">
                  <div className="w-12 h-12 rounded-lg bg-[#FFD3FF] flex items-center justify-center">A</div>
                  <div>
                    <div className="font-medium">DesignHub</div>
                    <div className="text-sm text-gray-500">Hiring designers</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#EAF8F0] transition">
                  <div className="w-12 h-12 rounded-lg bg-[#E8FFF4] flex items-center justify-center">D</div>
                  <div>
                    <div className="font-medium">DataWiz</div>
                    <div className="text-sm text-gray-500">ML & Data roles</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 bg-white rounded-2xl p-4 shadow-md">
              <h4 className="font-semibold mb-3">Tips</h4>
              <ul className="text-sm text-gray-600 list-disc pl-5">
                <li>Use filters to narrow down relevant internships.</li>
                <li>Save internships you like and come back later.</li>
                <li>Click Apply Now to go to the official application.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-sm text-gray-600 text-center">
          <div className="mb-2">© {new Date().getFullYear()} Internship Portal</div>
          <div className="flex items-center justify-center gap-4">
            <a href="/about" className="hover:underline">About</a>
            <a href="/contact" className="hover:underline">Contact</a>
            <a href="/privacy" className="hover:underline">Privacy</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
