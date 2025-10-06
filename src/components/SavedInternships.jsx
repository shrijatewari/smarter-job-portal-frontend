import React, { useState } from 'react';
import { 
  FaHeart, 
  FaMapMarkerAlt, 
  FaDollarSign, 
  FaBuilding, 
  FaExternalLinkAlt,
  FaCalendarAlt,
  FaSearch,
  FaFilter,
  FaTrash,
  FaBookmark
} from 'react-icons/fa';
import toast from 'react-hot-toast';

// Individual Saved Internship Card
const SavedInternshipCard = ({ internship, onRemove, onApply }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Recently saved';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Header with Heart Icon */}
      <div className="bg-gradient-to-r from-red-50 to-pink-50 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-red-500 text-white p-2 rounded-full">
              <FaHeart size={16} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800 leading-tight">
                {internship.title}
              </h3>
              <div className="flex items-center text-gray-600 mt-1">
                <FaBuilding className="mr-2" size={14} />
                <span className="font-medium">{internship.company}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => onRemove(internship._id)}
            className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
            title="Remove from saved"
          >
            <FaTrash size={14} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Location and Date */}
        <div className="flex items-center justify-between mb-4 text-sm">
          <div className="flex items-center text-gray-500">
            <FaMapMarkerAlt className="mr-2" size={12} />
            <span>{internship.location}</span>
          </div>
          <div className="flex items-center text-gray-400">
            <FaCalendarAlt className="mr-2" size={12} />
            <span>{formatDate(internship.savedAt)}</span>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {internship.skills?.slice(0, 4).map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium"
              >
                {skill}
              </span>
            ))}
            {internship.skills?.length > 4 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{internship.skills.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
            {internship.description}
          </p>
        </div>

        {/* Stipend and Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center text-green-600">
            <FaDollarSign className="mr-1" size={14} />
            <span className="font-semibold text-sm">{internship.stipend}</span>
          </div>
          
          <div className="flex gap-2">
            {internship.url && (
              <a
                href={internship.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                onClick={() => onApply(internship)}
              >
                <FaExternalLinkAlt size={12} />
                Apply
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main SavedInternships Component - Updated to work with props from Dashboard
const SavedInternships = ({ savedInternships = [], onRemove, onApply }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSkill, setFilterSkill] = useState('');

  // Convert savedInternships format from Dashboard to component format
  const formattedInternships = savedInternships.map(saved => {
    // Handle both saved internship format and direct internship format
    const internship = saved.internship || saved;
    return {
      _id: saved.internshipId || saved._id || saved.id,
      title: internship.title || saved.title,
      company: internship.company || saved.company,
      location: internship.location || saved.location || 'Remote',
      description: internship.description || saved.description || 'No description available',
      skills: internship.skills || internship.skillsRequired || [],
      stipend: internship.stipend || internship.salary || 'Not specified',
      savedAt: saved.savedAt || saved.dateApplied,
      url: internship.url || saved.url || '#'
    };
  });

  const handleRemove = async (internshipId) => {
    if (!window.confirm('Are you sure you want to remove this internship from your saved list?')) {
      return;
    }

    try {
      // Call parent's onRemove function which handles backend API call
      if (onRemove) {
        await onRemove(internshipId);
        toast.success('Internship removed from saved list');
      }
    } catch (err) {
      console.error('Failed to remove internship:', err);
      toast.error('Failed to remove internship');
    }
  };

  const handleApply = (internship) => {
    // Track application analytics
    console.log('📊 User applied to saved internship:', internship.title, 'at', internship.company);
    
    // Call parent's onApply function if provided
    if (onApply) {
      onApply(internship);
    }
    
    toast.success(`Opening application for ${internship.title} at ${internship.company}`);
  };

  // Filter and search functionality
  const filteredInternships = formattedInternships.filter(internship => {
    const matchesSearch = !searchTerm || 
      internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSkill = !filterSkill || 
      internship.skills?.some(skill => 
        skill.toLowerCase().includes(filterSkill.toLowerCase())
      );

    return matchesSearch && matchesSkill;
  });

  // Get unique skills for filter dropdown
  const allSkills = [...new Set(
    formattedInternships.flatMap(internship => internship.skills || [])
  )].sort();

  // No loading state needed since we get data from props

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <FaBookmark className="text-red-500" />
            Saved Internships
          </h2>
          <p className="text-gray-600">
            Your handpicked collection from Internship Roulette
          </p>
        </div>
        <div className="mt-4 md:mt-0 text-right">
          <div className="text-2xl font-bold text-blue-600">
            {formattedInternships.length}
          </div>
          <div className="text-sm text-gray-500">
            saved {formattedInternships.length === 1 ? 'internship' : 'internships'}
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      {formattedInternships.length > 0 && (
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, company, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterSkill}
              onChange={(e) => setFilterSkill(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="">All Skills</option>
              {allSkills.map(skill => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Internships Grid */}
      {filteredInternships.length === 0 ? (
        <div className="text-center py-16">
          <FaHeart className="mx-auto text-6xl text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {formattedInternships.length === 0 
              ? "No saved internships yet"
              : "No internships match your filters"
            }
          </h3>
          <p className="text-gray-500 mb-6">
            {formattedInternships.length === 0 
              ? "Start swiping on internships to build your collection!"
              : "Try adjusting your search or filter criteria"
            }
          </p>
          {formattedInternships.length === 0 && (
            <button
              onClick={() => window.location.href = '/'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Go to Internship Roulette
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInternships.map((internship) => (
              <SavedInternshipCard
                key={internship._id}
                internship={internship}
                onRemove={handleRemove}
                onApply={handleApply}
              />
            ))}
          </div>

          {/* Results Summary */}
          {filteredInternships.length !== formattedInternships.length && (
            <div className="mt-6 text-center text-sm text-gray-500">
              Showing {filteredInternships.length} of {formattedInternships.length} saved internships
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SavedInternships;