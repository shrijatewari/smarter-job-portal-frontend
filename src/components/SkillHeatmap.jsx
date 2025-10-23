import React, { useEffect, useState } from "react";
import { FaFire, FaChartBar, FaFilter, FaTimes, FaInfoCircle, FaSync } from "react-icons/fa";
import axios from "axios";
import { BACKEND_URL } from "../config";

// Custom Heatmap Cell Component
const HeatmapCell = ({ value, skill, category, maxValue, onClick, onHover, onLeave }) => {
  const intensity = maxValue > 0 ? Math.min(value / maxValue, 1) : 0;
  const backgroundColor = value > 0 
    ? `rgba(59, 130, 246, ${Math.max(intensity * 0.8, 0.1)})` 
    : '#f8f9fa';
  const textColor = intensity > 0.5 ? '#ffffff' : '#1f2937';
  
  return (
    <div
      className="flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 border border-blue-200"
      style={{
        backgroundColor,
        color: textColor,
        minHeight: '40px',
        minWidth: '80px',
        fontSize: '11px',
        fontWeight: 'bold',
        borderRadius: '4px'
      }}
      onClick={() => onClick && onClick(skill, category, value)}
      onMouseEnter={() => onHover && onHover(skill, category, value)}
      onMouseLeave={() => onLeave && onLeave()}
      title={`${skill} • ${category}: ${value} mentions`}
    >
      {value || 0}
    </div>
  );
};

// Custom Heatmap Grid Component
const CustomHeatmap = ({ skills, categories, matrix, maxValue }) => {
  const [hoveredCell, setHoveredCell] = useState(null);
  
  const handleCellHover = (skill, category, value) => {
    setHoveredCell({ skill, category, value });
  };
  
  const handleCellLeave = () => {
    setHoveredCell(null);
  };
  
  return (
    <div className="relative">
      {/* Tooltip */}
      {hoveredCell && (
        <div className="absolute top-0 left-0 bg-black text-white px-2 py-1 rounded text-xs z-10 pointer-events-none">
          {hoveredCell.skill} • {hoveredCell.category}: {hoveredCell.value} mentions
        </div>
      )}
      
      {/* Heatmap Grid */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Headers */}
          <div className="grid gap-1 mb-2" style={{ gridTemplateColumns: `120px repeat(${skills.length}, 80px)` }}>
            <div className="text-xs font-medium text-gray-700 p-2"></div>
            {skills.map((skill, index) => (
              <div key={index} className="text-xs font-medium text-gray-700 p-2 text-center transform -rotate-12">
                {skill}
              </div>
            ))}
          </div>
          
          {/* Data Rows */}
          {categories.map((category, categoryIndex) => (
            <div 
              key={categoryIndex} 
              className="grid gap-1 mb-1" 
              style={{ gridTemplateColumns: `120px repeat(${skills.length}, 80px)` }}
            >
              <div className="text-xs font-medium text-gray-700 p-2 text-right">
                {category}
              </div>
              {skills.map((skill, skillIndex) => (
                <HeatmapCell
                  key={`${categoryIndex}-${skillIndex}`}
                  value={matrix[skillIndex] ? matrix[skillIndex][categoryIndex] : 0}
                  skill={skill}
                  category={category}
                  maxValue={maxValue}
                  onHover={handleCellHover}
                  onLeave={handleCellLeave}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SkillHeatmap = () => {
  const [heatmapData, setHeatmapData] = useState({
    skills: [],
    categories: [],
    matrix: [],
    metadata: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [filteredData, setFilteredData] = useState({
    skills: [],
    categories: [],
    matrix: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const [maxValue, setMaxValue] = useState(100);

  // Fetch heatmap data
  useEffect(() => {
    fetchHeatmapData();
  }, []);

  // Update filtered data when heatmap data or selected skills change
  useEffect(() => {
    if (selectedSkills.length === 0) {
      setFilteredData(heatmapData);
      setMaxValue(getMaxValue(heatmapData.matrix));
    } else {
      const filtered = filterDataBySkills(heatmapData, selectedSkills);
      setFilteredData(filtered);
      setMaxValue(getMaxValue(filtered.matrix));
    }
  }, [heatmapData, selectedSkills]);

  const fetchHeatmapData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${BACKEND_URL}/api/skills/heatmap`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = response.data;
      
      setHeatmapData(data);
      console.log("🔥 Heatmap data loaded:", data);
    } catch (err) {
      console.error("Failed to fetch heatmap data:", err);
      setError(err.response?.data?.message || "Failed to load skill demand data");
      
      // Set fallback data
      setHeatmapData({
        skills: ["JavaScript", "Python", "React", "SQL", "Node.js"],
        categories: ["Overall Demand", "Tech Companies", "Recent Postings"],
        matrix: [[45, 32, 18], [38, 28, 15], [42, 35, 21], [35, 25, 12], [31, 24, 14]],
        metadata: { data_source: "fallback", total_jobs: 0 }
      });
    } finally {
      setLoading(false);
    }
  };

  const filterDataBySkills = (data, skills) => {
    const skillIndices = skills.map(skill => data.skills.indexOf(skill)).filter(i => i !== -1);
    
    return {
      skills: skillIndices.map(i => data.skills[i]),
      categories: data.categories,
      matrix: skillIndices.map(i => data.matrix[i])
    };
  };

  const getMaxValue = (matrix) => {
    if (!matrix || matrix.length === 0) return 100;
    return Math.max(...matrix.flat());
  };

  const handleSkillToggle = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const clearFilters = () => {
    setSelectedSkills([]);
  };


  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading skill demand data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="mb-4 md:mb-0">
          <div className="flex items-center space-x-3 mb-2">
            <FaFire className="text-2xl text-orange-500" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Skill Demand Heatmap
            </h2>
          </div>
          <p className="text-gray-600 text-sm md:text-base">
            See which skills are blazing hot in the job market right now 🔥
          </p>
          {error && (
            <div className="mt-2 flex items-center space-x-2 text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
              <FaInfoCircle />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              showFilters
                ? "bg-blue-100 text-blue-700 border border-blue-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FaFilter />
            <span>Filters</span>
          </button>
          
          <button
            onClick={fetchHeatmapData}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <FaSync className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Skill Filter Pills */}
      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 rounded-xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-sm font-medium text-gray-700">Filter by skills:</span>
            {selectedSkills.length > 0 && (
              <button
                onClick={clearFilters}
                className="text-xs text-red-600 hover:text-red-800 underline"
              >
                Clear all
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {heatmapData.skills.map((skill) => (
              <button
                key={skill}
                onClick={() => handleSkillToggle(skill)}
                className={`px-3 py-1 text-sm rounded-full transition-all ${
                  selectedSkills.includes(skill)
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-blue-50"
                }`}
              >
                {skill}
                {selectedSkills.includes(skill) && (
                  <FaTimes className="ml-2 inline w-3 h-3" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Metadata Info */}
      {heatmapData.metadata && (
        <div className="mb-6 flex flex-wrap gap-4 text-xs text-gray-600">
          <div className="flex items-center space-x-1">
            <FaChartBar />
            <span>Jobs analyzed: {heatmapData.metadata.total_jobs || 0}</span>
          </div>
          <div className="flex items-center space-x-1">
            <FaInfoCircle />
            <span>Source: {heatmapData.metadata.data_source || 'unknown'}</span>
          </div>
          {heatmapData.metadata.last_updated && (
            <div>
              Updated: {new Date(heatmapData.metadata.last_updated).toLocaleDateString()}
            </div>
          )}
        </div>
      )}

      {/* Heatmap Visualization */}
      <div className="overflow-x-auto">
        {filteredData.skills && filteredData.skills.length > 0 ? (
          <CustomHeatmap
            skills={filteredData.skills}
            categories={filteredData.categories}
            matrix={filteredData.matrix}
            maxValue={maxValue}
          />
        ) : (
          <div className="text-center py-12 text-gray-500">
            <FaChartBar className="mx-auto text-4xl mb-4 opacity-50" />
            <p className="text-lg">No skill data available</p>
            <p className="text-sm">Try refreshing or check back later</p>
          </div>
        )}
      </div>

      {/* Legend */}
      {filteredData.skills.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-3 md:mb-0">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Color Intensity</h4>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded"></div>
                  <span className="text-xs text-gray-600">Low demand</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-400 rounded"></div>
                  <span className="text-xs text-gray-600">Medium demand</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-700 rounded"></div>
                  <span className="text-xs text-gray-600">High demand</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-xs text-gray-500">
                Showing {selectedSkills.length > 0 ? selectedSkills.length : filteredData.skills.length} skills
              </p>
              <p className="text-xs text-gray-500">
                Max value: {maxValue}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillHeatmap;