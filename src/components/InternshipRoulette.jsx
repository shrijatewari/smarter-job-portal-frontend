import React, { useState, useEffect, useRef } from 'react';
import { 
  FaHeart, 
  FaTimes, 
  FaMapMarkerAlt, 
  FaDollarSign, 
  FaBuilding, 
  FaSync, 
  FaHandPaper,
  FaArrowLeft,
  FaArrowRight
} from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

// Custom Swipeable Card Component
const SwipeableCard = ({ internship, onSwipe, isTop, style }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragCurrent, setDragCurrent] = useState({ x: 0, y: 0 });
  const [transform, setTransform] = useState('');
  const cardRef = useRef(null);

  const handleMouseDown = (e) => {
    if (!isTop) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e) => {
    if (!isTop) return;
    setIsDragging(true);
    const touch = e.touches[0];
    setDragStart({ x: touch.clientX, y: touch.clientY });
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    setDragCurrent({ x: deltaX, y: deltaY });
    
    const rotation = deltaX * 0.1;
    setTransform(`translate(${deltaX}px, ${deltaY}px) rotate(${rotation}deg)`);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStart.x;
    const deltaY = touch.clientY - dragStart.y;
    setDragCurrent({ x: deltaX, y: deltaY });
    
    const rotation = deltaX * 0.1;
    setTransform(`translate(${deltaX}px, ${deltaY}px) rotate(${rotation}deg)`);
  };

  const handleMouseUp = () => {
    handleDragEnd();
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    const threshold = 100;
    
    if (Math.abs(dragCurrent.x) > threshold) {
      const direction = dragCurrent.x > 0 ? 'right' : 'left';
      onSwipe(internship, direction);
    }
    
    setTransform('');
    setDragCurrent({ x: 0, y: 0 });
  };

  const getCardOpacity = () => {
    if (!isDragging) return 1;
    const distance = Math.abs(dragCurrent.x);
    return Math.max(0.6, 1 - distance / 200);
  };

  const getSwipeIndicator = () => {
    if (!isDragging || Math.abs(dragCurrent.x) < 30) return null;
    
    if (dragCurrent.x > 0) {
      return (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-2 rounded-full flex items-center gap-2 font-bold shadow-lg">
          <FaHeart /> SAVE
        </div>
      );
    } else {
      return (
        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-2 rounded-full flex items-center gap-2 font-bold shadow-lg">
          <FaTimes /> PASS
        </div>
      );
    }
  };

  return (
    <div
      ref={cardRef}
      className={`absolute inset-0 bg-white rounded-2xl shadow-2xl cursor-grab active:cursor-grabbing transition-shadow duration-300 ${
        isTop ? 'z-10' : 'z-0'
      }`}
      style={{
        transform,
        opacity: getCardOpacity(),
        ...style
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {getSwipeIndicator()}
      
      {/* Card Content */}
      <div className="h-full p-6 flex flex-col">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 leading-tight">
            {internship.title}
          </h2>
          <div className="flex items-center text-gray-600 mb-1">
            <FaBuilding className="mr-2" />
            <span className="text-lg font-medium">{internship.company}</span>
          </div>
          <div className="flex items-center text-gray-500">
            <FaMapMarkerAlt className="mr-2" />
            <span>{internship.location}</span>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {internship.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="flex-1 mb-4">
          <p className="text-gray-600 leading-relaxed">
            {internship.description}
          </p>
        </div>

        {/* Stipend */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center text-green-600">
            <FaDollarSign className="mr-2" />
            <span className="font-medium">{internship.stipend}</span>
          </div>
          {internship.source && (
            <span className="text-xs text-gray-400 capitalize">
              via {internship.source}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => onSwipe(internship, 'left')}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            <FaTimes /> Pass
          </button>
          <button
            onClick={() => onSwipe(internship, 'right')}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            <FaHeart /> Save
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Internship Roulette Component
const InternshipRoulette = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [swipeCount, setSwipeCount] = useState(0);
  const [analytics, setAnalytics] = useState({ right: 0, left: 0 });

  // Load internships
  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('http://localhost:4000/api/internships/random', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setInternships(response.data.internships || []);
      
      console.log('🎲 Loaded internships for roulette:', response.data.internships?.length);
    } catch (err) {
      console.error('Failed to fetch internships:', err);
      setError('Failed to load internships. Please try again.');
      
      // Fallback data for demo
      setInternships([
        {
          _id: 'demo-1',
          title: 'Frontend Developer Intern',
          company: 'TechFlow',
          location: 'Remote',
          description: 'Join our frontend team to build modern web applications using React, TypeScript, and Tailwind CSS. You will work closely with experienced developers and learn industry best practices.',
          skills: ['React', 'TypeScript', 'Tailwind CSS'],
          stipend: '$2000/month'
        },
        {
          _id: 'demo-2',
          title: 'Full Stack Developer Intern',
          company: 'InnovateLab',
          location: 'San Francisco, CA',
          description: 'Work on both frontend and backend development using Node.js, React, and MongoDB. Great opportunity to learn full-stack development with mentorship.',
          skills: ['Node.js', 'React', 'MongoDB'],
          stipend: '$2500/month'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (internship, direction) => {
    try {
      console.log(`👆 Swiped ${direction} on:`, internship.title);
      
      // Update analytics
      setAnalytics(prev => ({
        ...prev,
        [direction]: prev[direction] + 1
      }));

      // Save preference to backend
      await axios.post('http://localhost:4000/api/preferences/save', {
        internshipId: internship._id,
        direction
      });

      // Show toast notification
      if (direction === 'right') {
        toast.success('💚 Internship saved! Check your dashboard to view it.', {
          duration: 3000,
          position: 'top-center'
        });
      } else {
        toast('👍 Thanks for your feedback!', {
          duration: 2000,
          position: 'top-center'
        });
      }

      // Remove the swiped card
      setInternships(prev => prev.filter(i => i._id !== internship._id));
      setSwipeCount(prev => prev + 1);

      // Load more internships if running low
      if (internships.length <= 2) {
        setTimeout(fetchInternships, 500);
      }

      // Simple analytics logging
      if (analytics.right + analytics.left > 0 && (analytics.right + analytics.left) % 5 === 0) {
        const rightPercentage = Math.round((analytics.right / (analytics.right + analytics.left)) * 100);
        console.log(`📊 Analytics: User has swiped right ${rightPercentage}% of the time (${analytics.right}/${analytics.right + analytics.left})`);
      }

    } catch (err) {
      console.error('Failed to save swipe:', err);
      toast.error('Failed to save preference. Please try again.');
    }
  };

  const handleRefresh = () => {
    fetchInternships();
    setSwipeCount(0);
    setAnalytics({ right: 0, left: 0 });
    toast.success('🔄 Fresh internships loaded!');
  };

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading internships...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 md:p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
          🎲 Internship Roulette
        </h2>
        <p className="text-gray-600 text-lg">
          Swipe to find your perfect match! ← Pass | Save →
        </p>
        {swipeCount > 0 && (
          <div className="mt-2 text-sm text-gray-500">
            Swiped: {swipeCount} | Saved: {analytics.right} | Passed: {analytics.left}
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 font-medium">{error}</p>
        </div>
      )}

      {/* Card Stack */}
      <div className="relative w-full max-w-md mx-auto">
        <div 
          className="relative w-full bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300"
          style={{ height: '600px' }}
        >
          {internships.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
              <FaHandPaper className="text-4xl mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No more internships!</p>
              <p className="text-sm mb-4">You've seen all available internships</p>
              <button
                onClick={handleRefresh}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <FaSync /> Load More
              </button>
            </div>
          ) : (
            <>
              {internships.slice(0, 3).map((internship, index) => (
                <SwipeableCard
                  key={internship._id}
                  internship={internship}
                  onSwipe={handleSwipe}
                  isTop={index === 0}
                  style={{
                    zIndex: internships.length - index,
                    transform: `scale(${1 - index * 0.05}) translateY(${index * 10}px)`,
                    opacity: 1 - index * 0.2
                  }}
                />
              ))}
            </>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 flex justify-center gap-8 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <FaArrowLeft className="text-red-500" />
          <span>Drag left to pass</span>
        </div>
        <div className="flex items-center gap-2">
          <FaArrowRight className="text-green-500" />
          <span>Drag right to save</span>
        </div>
      </div>
    </div>
  );
};

export default InternshipRoulette;