import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  FaArrowUp, 
  FaArrowDown, 
  FaChartLine, 
  FaUsers, 
  FaAward, 
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaCode,
  FaLightbulb,
  FaInfoCircle,
  FaExclamationTriangle
} from 'react-icons/fa';
import axios from 'axios';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    totalApplications: 0,
    successRate: 0,
    applicationsOverTime: [],
    jobStatusDistribution: [],
    topSkills: [],
    monthlyTrend: 0,
    recentActivity: [],
    insights: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user-specific analytics data
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get('http://localhost:4000/api/analytics/dashboard', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setAnalyticsData(response.data);
        
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
        setError(err.response?.data?.message || 'Failed to load analytics');
        
        // Fallback to sample data on error
        const fallbackData = {
          totalApplications: 12,
          successRate: 45,
          monthlyTrend: 8,
          applicationsOverTime: [
            { month: 'Jan', applications: 2 },
            { month: 'Feb', applications: 3 },
            { month: 'Mar', applications: 5 },
            { month: 'Apr', applications: 4 },
            { month: 'May', applications: 6 },
            { month: 'Jun', applications: 8 },
            { month: 'Jul', applications: 7 },
            { month: 'Aug', applications: 9 },
            { month: 'Sep', applications: 11 },
            { month: 'Oct', applications: 10 },
            { month: 'Nov', applications: 12 },
            { month: 'Dec', applications: 12 }
          ],
          jobStatusDistribution: [
            { name: 'Applied', value: 8, color: '#FFD3FF' },
            { name: 'Interview', value: 3, color: '#A6C1EE' },
            { name: 'Offer', value: 1, color: '#4A4A4A' },
            { name: 'Rejected', value: 2, color: '#7A7A7A' }
          ],
          topSkills: [
            { skill: 'JavaScript', count: 8, percentage: 45 },
            { skill: 'React', count: 6, percentage: 35 },
            { skill: 'Python', count: 4, percentage: 28 },
            { skill: 'Node.js', count: 3, percentage: 20 }
          ],
          recentActivity: [
            { action: 'Applied to', company: 'TechCorp', status: 'Applied', time: '2 days ago', icon: 'FaCheckCircle', color: 'text-blue-500' },
            { action: 'Interview scheduled with', company: 'StartupX', status: 'Interview', time: '5 days ago', icon: 'FaClock', color: 'text-yellow-500' }
          ],
          insights: [
            { type: 'tip', title: 'Data Unavailable', message: 'Unable to load personalized analytics. Using sample data.' }
          ]
        };
        setAnalyticsData(fallbackData);
        
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalyticsData();
  }, []);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF3EB] via-[#FFFDF5] to-[#E8FFF4]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4 border-[#4A4A4A]"></div>
          <div className="text-lg text-[#7A7A7A]">Loading analytics...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF3EB] via-[#FFFDF5] to-[#E8FFF4] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#4A4A4A] mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-lg text-[#7A7A7A]">
            Track your internship application journey and get personalized insights 📊
          </p>
          {error && (
            <div className="mt-4 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
              <div className="flex items-center gap-2 text-yellow-800">
                <FaExclamationTriangle />
                <p className="font-medium">Note: {error}</p>
              </div>
              <p className="text-sm text-yellow-700 mt-1">Showing sample data to demonstrate features.</p>
            </div>
          )}
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Total Applications Card */}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-md p-8 hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-tr from-[#FFD3FF] to-[#A6C1EE]">
                <FaUsers className="text-2xl text-[#4A4A4A]" />
              </div>
              <div className="flex items-center gap-2">
                {analyticsData.monthlyTrend > 0 ? (
                  <FaArrowUp className="text-green-500" />
                ) : (
                  <FaArrowDown className="text-red-500" />
                )}
                <span className={`text-sm font-medium ${
                  analyticsData.monthlyTrend > 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {Math.abs(analyticsData.monthlyTrend)}%
                </span>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-[#4A4A4A] mb-2">
              {analyticsData.totalApplications}
            </h3>
            <p className="text-[#7A7A7A]">Total Applications</p>
          </div>

          {/* Success Rate Card */}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-md p-8 hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-tr from-[#FFD3FF] to-[#A6C1EE]">
                <FaAward className="text-2xl text-[#4A4A4A]" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="30"
                    stroke="#E5E7EB"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="30"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${analyticsData.successRate * 1.88} 188`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-[#4A4A4A]">
                    {analyticsData.successRate}%
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#4A4A4A]">
                  Success Rate
                </h3>
                <p className="text-[#7A7A7A]">Interview to Offer</p>
              </div>
            </div>
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFD3FF" />
                <stop offset="100%" stopColor="#A6C1EE" />
              </linearGradient>
            </defs>
          </div>

          {/* Most In-Demand Skills Card */}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-md p-8 hover:shadow-xl transition">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-gradient-to-tr from-[#FFD3FF] to-[#A6C1EE]">
                <FaCode className="text-2xl text-[#4A4A4A]" />
              </div>
              <h3 className="text-xl font-bold text-[#4A4A4A]">Top Skills</h3>
            </div>
            <div className="space-y-3">
              {analyticsData.topSkills.slice(0, 4).map((skill, index) => (
                <div key={skill.skill} className="flex items-center justify-between">
                  <span className="text-[#4A4A4A] font-medium">{skill.skill}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-gradient-to-r from-[#FFD3FF] to-[#A6C1EE]"
                        style={{ width: `${skill.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-[#7A7A7A] w-8 text-right">
                      {skill.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Applications Over Time - Large Card */}
          <div className="lg:col-span-2 bg-white/70 backdrop-blur-md rounded-2xl shadow-md p-8 hover:shadow-xl transition">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-gradient-to-tr from-[#FFD3FF] to-[#A6C1EE]">
                <FaChartLine className="text-2xl text-[#4A4A4A]" />
              </div>
              <h3 className="text-xl font-bold text-[#4A4A4A]">Applications Over Time</h3>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData.applicationsOverTime}>
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFD3FF" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#A6C1EE" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#7A7A7A"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#7A7A7A"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      color: '#4A4A4A'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="applications"
                    stroke="#4A4A4A"
                    strokeWidth={2}
                    fill="url(#areaGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Job Status Distribution */}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-md p-8 hover:shadow-xl transition">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-gradient-to-tr from-[#FFD3FF] to-[#A6C1EE]">
                <FaCalendarAlt className="text-2xl text-[#4A4A4A]" />
              </div>
              <h3 className="text-xl font-bold text-[#4A4A4A]">Status Distribution</h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData.jobStatusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {analyticsData.jobStatusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      color: '#4A4A4A'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {analyticsData.jobStatusDistribution.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-[#4A4A4A]">{item.name}</span>
                  </div>
                  <span className="text-[#7A7A7A] font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="lg:col-span-2 bg-white/70 backdrop-blur-md rounded-2xl shadow-md p-8 hover:shadow-xl transition">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-gradient-to-tr from-[#FFD3FF] to-[#A6C1EE]">
                <FaClock className="text-2xl text-[#4A4A4A]" />
              </div>
              <h3 className="text-xl font-bold text-[#4A4A4A]">Recent Activity</h3>
            </div>
            <div className="space-y-4">
              {analyticsData.recentActivity && analyticsData.recentActivity.length > 0 ? (
                analyticsData.recentActivity.map((activity, index) => {
                  const IconComponent = {
                    'FaCheckCircle': FaCheckCircle,
                    'FaClock': FaClock,
                    'FaAward': FaAward,
                    'FaTimesCircle': FaTimesCircle
                  }[activity.icon] || FaCheckCircle;
                  
                  return (
                    <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-white/50">
                      <IconComponent className={`text-xl ${activity.color}`} />
                      <div className="flex-1">
                        <p className="text-[#4A4A4A] font-medium">
                          {activity.action} <span className="font-semibold">{activity.company}</span>
                        </p>
                        <p className="text-sm text-[#7A7A7A]">{activity.time}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        activity.status === 'Applied' ? 'bg-blue-100 text-blue-800' :
                        activity.status === 'Interview' ? 'bg-yellow-100 text-yellow-800' :
                        activity.status === 'Offer' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {activity.status}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FaClock className="mx-auto text-3xl mb-2 opacity-50" />
                  <p>No recent activity found.</p>
                  <p className="text-sm">Start applying to internships to see your activity here!</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Recommendation Quality Card */}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-md p-8 hover:shadow-xl transition">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-gradient-to-tr from-[#FFD3FF] to-[#A6C1EE]">
                <FaAward className="text-2xl text-[#4A4A4A]" />
              </div>
              <h3 className="text-xl font-bold text-[#4A4A4A]">Recommendation Quality</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[#4A4A4A] font-medium">Average Match Score</span>
                <span className="text-2xl font-bold text-[#4A4A4A]">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="h-3 rounded-full bg-gradient-to-r from-[#FFD3FF] to-[#A6C1EE]"
                  style={{ width: '85%' }}
                ></div>
              </div>
              <p className="text-sm text-[#7A7A7A]">
                Your profile is well-optimized for matching with relevant internships. 
                Keep your skills updated to maintain high match scores.
              </p>
            </div>
          </div>

          {/* Insights Card */}
          {analyticsData.insights && analyticsData.insights.length > 0 && (
            <div className="col-span-full bg-white/70 backdrop-blur-md rounded-2xl shadow-md p-8 hover:shadow-xl transition">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-lg bg-gradient-to-tr from-[#FFD3FF] to-[#A6C1EE]">
                  <FaLightbulb className="text-2xl text-[#4A4A4A]" />
                </div>
                <h3 className="text-xl font-bold text-[#4A4A4A]">Personal Insights</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {analyticsData.insights.map((insight, index) => {
                  const IconComponent = {
                    'success': FaCheckCircle,
                    'info': FaInfoCircle,
                    'tip': FaLightbulb,
                    'warning': FaExclamationTriangle
                  }[insight.type] || FaInfoCircle;
                  
                  const colorClasses = {
                    'success': 'bg-green-50 border-green-200 text-green-800',
                    'info': 'bg-blue-50 border-blue-200 text-blue-800',
                    'tip': 'bg-yellow-50 border-yellow-200 text-yellow-800',
                    'warning': 'bg-red-50 border-red-200 text-red-800'
                  }[insight.type] || 'bg-gray-50 border-gray-200 text-gray-800';
                  
                  return (
                    <div key={index} className={`p-4 rounded-lg border ${colorClasses}`}>
                      <div className="flex items-start gap-3">
                        <IconComponent className="text-lg mt-0.5" />
                        <div>
                          <h4 className="font-semibold mb-1">{insight.title}</h4>
                          <p className="text-sm opacity-90">{insight.message}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
