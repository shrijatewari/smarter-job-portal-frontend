import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { BACKEND_URL } from "../config";
// import toast from "react-hot-toast";

const TestHistory = ({ userId }) => {
  const [testHistory, setTestHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  const fetchTestHistory = useCallback(async () => {
    try {
      const response = await api.get(`${BACKEND_URL}/api/tests/history/${userId}`, {
        params: { limit: 5 }
      });
      
      if (response.data.success) {
        setTestHistory(response.data.data.tests);
      }
    } catch (error) {
      console.error("Error fetching test history:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchTestStats = useCallback(async () => {
    try {
      const response = await api.get(`${BACKEND_URL}/api/tests/stats/${userId}`);
      
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching test stats:", error);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchTestHistory();
      fetchTestStats();
    }
  }, [userId, fetchTestHistory, fetchTestStats]);

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  // const getScoreBgColor = (score) => {
  //   if (score >= 80) return "bg-green-100";
  //   if (score >= 60) return "bg-yellow-100";
  //   return "bg-red-100";
  // };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'DSA': '🔧',
      'DBMS': '🗄️',
      'OOPS': '🏗️',
      'CN': '🌐',
      'OS': '💻',
      'Web Development': '🌍'
    };
    return icons[category] || '📚';
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Very Easy': 'bg-green-100 text-green-800',
      'Easy': 'bg-blue-100 text-blue-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'Hard': 'bg-orange-100 text-orange-800',
      'Very Hard': 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="p-8 text-center rounded-2xl shadow-lg bg-white/70 backdrop-blur-md">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-[#7A7A7A]">Loading test history...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Test Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-white/70 backdrop-blur-md shadow-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.overall.totalTests}</div>
            <div className="text-sm text-[#7A7A7A]">Total Tests</div>
          </div>
          <div className="p-4 rounded-lg bg-white/70 backdrop-blur-md shadow-lg text-center">
            <div className="text-2xl font-bold text-green-600">{Math.round(stats.overall.averageScore || 0)}%</div>
            <div className="text-sm text-[#7A7A7A]">Average Score</div>
          </div>
          <div className="p-4 rounded-lg bg-white/70 backdrop-blur-md shadow-lg text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.overall.bestScore || 0}%</div>
            <div className="text-sm text-[#7A7A7A]">Best Score</div>
          </div>
          <div className="p-4 rounded-lg bg-white/70 backdrop-blur-md shadow-lg text-center">
            <div className="text-2xl font-bold text-orange-600">{Math.floor((stats.overall.totalTimeSpent || 0) / 60)}m</div>
            <div className="text-sm text-[#7A7A7A]">Time Spent</div>
          </div>
        </div>
      )}

      {/* Test History */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#4A4A4A]">Recent Test Results</h2>
          <button
            onClick={() => navigate("/skill-tests")}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Take New Test →
          </button>
        </div>

        {testHistory.length === 0 ? (
          <div className="p-8 text-center rounded-2xl shadow-lg bg-white/70 backdrop-blur-md">
            <div className="text-4xl mb-4">📚</div>
            <p className="text-[#7A7A7A] mb-4">No test history yet.</p>
            <button
              onClick={() => navigate("/skill-tests")}
              className="bg-gradient-to-tr from-[#FFD3FF] to-[#A6C1EE] text-[#4A4A4A] px-6 py-2 rounded-lg font-medium hover:shadow-md transition"
            >
              Take Your First Test
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {testHistory.map((test) => (
              <div
                key={test._id}
                className="p-6 rounded-2xl shadow-lg hover:shadow-xl transition bg-white/70 backdrop-blur-md"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getCategoryIcon(test.category)}</span>
                    <div>
                      <h3 className="font-semibold text-lg text-[#4A4A4A]">{test.category}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(test.difficulty)}`}>
                        {test.difficulty}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getScoreColor(test.score)}`}>
                      {test.score}%
                    </div>
                    <div className="text-sm text-[#7A7A7A]">
                      {test.correctAnswers}/{test.totalQuestions} correct
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-[#7A7A7A]">
                  <span>{formatDate(test.completedAt)}</span>
                  <span>{Math.floor(test.timeSpent / 60)}m {test.timeSpent % 60}s</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Category Performance */}
      {stats && stats.categoryStats && stats.categoryStats.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-[#4A4A4A] mb-4">Performance by Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.categoryStats.slice(0, 4).map((categoryStat) => (
              <div
                key={categoryStat._id}
                className="p-4 rounded-lg bg-white/70 backdrop-blur-md shadow-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{getCategoryIcon(categoryStat._id)}</span>
                    <span className="font-medium text-[#4A4A4A]">{categoryStat._id}</span>
                  </div>
                  <span className="text-sm text-[#7A7A7A]">{categoryStat.testsCount} tests</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-bold text-blue-600">{Math.round(categoryStat.averageScore)}%</div>
                    <div className="text-xs text-[#7A7A7A]">Average</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">{categoryStat.bestScore}%</div>
                    <div className="text-xs text-[#7A7A7A]">Best</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestHistory;
