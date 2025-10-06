import React, { useState, useEffect } from 'react';
import { aiService } from '../utils/api';
import { FaRobot, FaBrain, FaFileAlt, FaChartLine, FaLightbulb } from 'react-icons/fa';

const AICareerAssistant = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [mlHealth, setMlHealth] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    checkMLHealth();
    generateRecommendations();
  }, []);

  const checkMLHealth = async () => {
    try {
      const health = await aiService.checkMLHealth();
      setMlHealth(health);
    } catch (error) {
      console.warn('ML health check failed:', error);
      setMlHealth({ status: 'unhealthy' });
    }
  };

  const generateRecommendations = () => {
    // Generate dynamic career recommendations
    const tips = [
      {
        icon: <FaFileAlt className="text-blue-500" />,
        title: "Optimize Your Resume",
        description: "Use our AI to extract and highlight key skills from your resume that match job requirements.",
        action: "Extract Skills"
      },
      {
        icon: <FaChartLine className="text-green-500" />,
        title: "Calculate Job Fit",
        description: "Get an AI-powered fit score to see how well your background matches specific job opportunities.",
        action: "Check Fit Score"
      },
      {
        icon: <FaBrain className="text-purple-500" />,
        title: "Generate Cover Letters",
        description: "Create personalized, professional cover letters tailored to each job application using AI.",
        action: "Create Cover Letter"
      },
      {
        icon: <FaLightbulb className="text-yellow-500" />,
        title: "Summarize Job Descriptions",
        description: "Get concise summaries of lengthy job descriptions to quickly understand key requirements.",
        action: "Summarize Jobs"
      }
    ];
    setRecommendations(tips);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FaRobot /> },
    { id: 'features', label: 'AI Features', icon: <FaBrain /> },
    { id: 'tips', label: 'Career Tips', icon: <FaLightbulb /> }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-lg">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-full">
            <FaRobot className="text-white text-3xl" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">AI Career Assistant</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Leverage cutting-edge AI technology to enhance your job search, optimize your applications, 
          and make data-driven career decisions.
        </p>
        
        {/* ML Service Status */}
        {mlHealth && (
          <div className={`inline-flex items-center mt-4 px-4 py-2 rounded-full text-sm ${
            mlHealth.status === 'healthy' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${
              mlHealth.status === 'healthy' ? 'bg-green-500' : 'bg-yellow-500'
            }`}></div>
            AI Service: {mlHealth.status === 'healthy' ? 'Online & Ready' : 'Fallback Mode'}
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-lg p-1 shadow-md">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              {tab.icon}
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">How AI Powers Your Job Search</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-blue-800 mb-3">Machine Learning Models</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>BERT & T5 for text summarization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Named Entity Recognition for skill extraction</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Sentence transformers for similarity matching</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Large language models for content generation</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-purple-800 mb-3">Smart Analytics</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Cosine similarity for job matching</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>TF-IDF keyword extraction</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Feature engineering for predictions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Real-time fallback mechanisms</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-xl font-semibold text-green-800 mb-3">Getting Started</h3>
              <p className="text-gray-700 mb-4">
                Ready to supercharge your job search? Start by uploading your resume or pasting your resume text 
                into any of our AI tools. Then, find job descriptions you're interested in and let our AI provide 
                personalized insights and recommendations.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setActiveTab('features')}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                >
                  Explore Features
                </button>
                <button 
                  onClick={() => setActiveTab('tips')}
                  className="bg-white text-green-600 border border-green-300 px-4 py-2 rounded-lg hover:bg-green-50 transition"
                >
                  Get Tips
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">AI-Powered Features</h2>
            
            <div className="grid gap-6">
              {recommendations.map((rec, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      {rec.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{rec.title}</h3>
                      <p className="text-gray-600 mb-4">{rec.description}</p>
                      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition text-sm">
                        {rec.action}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tips' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">AI-Enhanced Career Tips</h2>
            
            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-400">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Optimize Resume Keywords</h3>
                <p className="text-gray-700 mb-3">
                  Use our skill extraction tool to identify which keywords from job descriptions 
                  are missing from your resume. This helps you pass Applicant Tracking Systems (ATS).
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Extract skills from target job descriptions</li>
                  <li>• Compare with your current resume skills</li>
                  <li>• Add relevant missing skills to your resume</li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-400">
                <h3 className="text-lg font-semibold text-green-800 mb-2">Use Fit Scores Strategically</h3>
                <p className="text-gray-700 mb-3">
                  Don't just apply to everything. Use our AI fit score to prioritize applications 
                  where you have the best chance of success.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Focus on jobs with 70%+ fit scores</li>
                  <li>• For lower scores, identify skill gaps first</li>
                  <li>• Use fit analysis to improve your profile</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-400">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">Customize Cover Letters</h3>
                <p className="text-gray-700 mb-3">
                  Our AI generates personalized cover letters, but always review and customize 
                  them further to add your unique voice and specific examples.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Use AI as a starting point, not the final version</li>
                  <li>• Add specific examples of your achievements</li>
                  <li>• Ensure the tone matches the company culture</li>
                </ul>
              </div>
              
              <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-400">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Leverage Job Summaries</h3>
                <p className="text-gray-700 mb-3">
                  Use our summarization feature to quickly understand job requirements and 
                  identify the most important qualifications to highlight.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Summarize long job descriptions for key points</li>
                  <li>• Identify must-have vs nice-to-have skills</li>
                  <li>• Focus your application on the summary highlights</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AICareerAssistant;
