import React, { useState, useEffect, useCallback } from 'react';
import { BACKEND_URL } from '../config';

const AIAssistant = ({ jobDescription, userProfile, onClose }) => {
  const [activeTab, setActiveTab] = useState('analysis');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [resumeOptimization, setResumeOptimization] = useState(null);
  const [coverLetter, setCoverLetter] = useState(null);
  const [interviewPrep, setInterviewPrep] = useState(null);
  const [careerPath, setCareerPath] = useState(null);
  const [marketIntelligence, setMarketIntelligence] = useState(null);
  const [learningPlan, setLearningPlan] = useState(null);
  const [networking, setNetworking] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  const tabs = [
    { id: 'analysis', name: 'Job Match', icon: '🎯', color: 'from-blue-500 to-purple-600' },
    { id: 'resume', name: 'Resume', icon: '📄', color: 'from-green-500 to-teal-600' },
    { id: 'coverletter', name: 'Cover Letter', icon: '✍️', color: 'from-pink-500 to-rose-600' },
    { id: 'interview', name: 'Interview', icon: '🎤', color: 'from-orange-500 to-red-600' },
    { id: 'career', name: 'Career Path', icon: '🚀', color: 'from-indigo-500 to-purple-600' },
    { id: 'market', name: 'Market Intel', icon: '📊', color: 'from-cyan-500 to-blue-600' },
    { id: 'learning', name: 'Learning', icon: '🧠', color: 'from-emerald-500 to-green-600' },
    { id: 'networking', name: 'Networking', icon: '🤝', color: 'from-violet-500 to-purple-600' },
    { id: 'analytics', name: 'Analytics', icon: '📈', color: 'from-amber-500 to-orange-600' }
  ];

  const loadAnalysis = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/ai/analyze-job-match`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ jobDescription, userProfile })
      });
      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error('Failed to load analysis:', error);
    } finally {
      setLoading(false);
    }
  }, [jobDescription, userProfile]);

  useEffect(() => {
    if (jobDescription && userProfile) {
      loadAnalysis();
    }
  }, [jobDescription, userProfile, loadAnalysis]);


  const loadResumeOptimization = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/ai/optimize-resume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ resumeData: userProfile, jobDescription })
      });
      const data = await response.json();
      setResumeOptimization(data);
    } catch (error) {
      console.error('Failed to load resume optimization:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCoverLetter = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/ai/generate-cover-letter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ jobDescription, userProfile, style: 'professional' })
      });
      const data = await response.json();
      setCoverLetter(data);
    } catch (error) {
      console.error('Failed to load cover letter:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadInterviewPrep = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/ai/prepare-interview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ jobDescription, userProfile })
      });
      const data = await response.json();
      setInterviewPrep(data);
    } catch (error) {
      console.error('Failed to load interview prep:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCareerPath = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/ai/analyze-career-path`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userProfile, currentJob: jobDescription })
      });
      const data = await response.json();
      setCareerPath(data);
    } catch (error) {
      console.error('Failed to load career path:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMarketIntelligence = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/ai/market-intelligence`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ jobDescription, userProfile })
      });
      const data = await response.json();
      setMarketIntelligence(data);
    } catch (error) {
      console.error('Failed to load market intelligence:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLearningPlan = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/ai/create-learning-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userProfile, targetJobs: [jobDescription] })
      });
      const data = await response.json();
      setLearningPlan(data);
    } catch (error) {
      console.error('Failed to load learning plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadNetworking = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/ai/networking-insights`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userProfile, targetJobs: [jobDescription] })
      });
      const data = await response.json();
      setNetworking(data);
    } catch (error) {
      console.error('Failed to load networking insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/ai/analyze-application-performance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userProfile, applications: [] })
      });
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    
    // Load data for the selected tab
    switch (tabId) {
      case 'resume':
        if (!resumeOptimization) loadResumeOptimization();
        break;
      case 'coverletter':
        if (!coverLetter) loadCoverLetter();
        break;
      case 'interview':
        if (!interviewPrep) loadInterviewPrep();
        break;
      case 'career':
        if (!careerPath) loadCareerPath();
        break;
      case 'market':
        if (!marketIntelligence) loadMarketIntelligence();
        break;
      case 'learning':
        if (!learningPlan) loadLearningPlan();
        break;
      case 'networking':
        if (!networking) loadNetworking();
        break;
      case 'analytics':
        if (!analytics) loadAnalytics();
        break;
      default:
        break;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const renderAnalysis = () => {
    if (!analysis) return <div className="text-center py-8">Loading analysis...</div>;
    
    return (
      <div className="space-y-6">
        {/* Compatibility Score */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Compatibility Score</h3>
            <div className={`text-3xl font-bold ${getScoreColor(analysis.compatibilityScore)}`}>
              {analysis.compatibilityScore}%
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div 
              className={`h-3 rounded-full ${getScoreBg(analysis.compatibilityScore)}`}
              style={{ width: `${analysis.compatibilityScore}%` }}
            ></div>
          </div>
        </div>

        {/* Success Probability */}
        <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Success Probability</h3>
            <div className={`text-3xl font-bold ${getScoreColor(analysis.successProbability)}`}>
              {analysis.successProbability}%
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div 
              className={`h-3 rounded-full ${getScoreBg(analysis.successProbability)}`}
              style={{ width: `${analysis.successProbability}%` }}
            ></div>
          </div>
        </div>

        {/* Skill Gaps */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Skill Gaps</h3>
          <div className="space-y-2">
            {analysis.skillGaps.map((skill, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <span className="text-red-700 font-medium">{skill}</span>
                <span className="text-sm text-red-600">Missing</span>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Your Strengths</h3>
          <div className="space-y-2">
            {analysis.strengths.map((strength, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-green-700 font-medium">{strength}</span>
                <span className="text-sm text-green-600">✓ Match</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-800">AI Recommendations</h3>
          <div className="space-y-3">
            {analysis.recommendations.map((rec, index) => (
              <div key={index} className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-blue-800">{rec.skill}</span>
                  <span className="text-sm text-blue-600 bg-blue-200 px-2 py-1 rounded-full">
                    {rec.priority} priority
                  </span>
                </div>
                <p className="text-sm text-blue-700 mb-2">Timeline: {rec.timeline}</p>
                <div className="text-sm text-blue-600">
                  Resources: {rec.resources.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderResumeOptimization = () => {
    if (!resumeOptimization) return <div className="text-center py-8">Loading resume optimization...</div>;
    
    return (
      <div className="space-y-6">
        {/* ATS Score */}
        <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">ATS Score</h3>
            <div className={`text-3xl font-bold ${getScoreColor(resumeOptimization.atsScore)}`}>
              {resumeOptimization.atsScore}%
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div 
              className={`h-3 rounded-full ${getScoreBg(resumeOptimization.atsScore)}`}
              style={{ width: `${resumeOptimization.atsScore}%` }}
            ></div>
          </div>
        </div>

        {/* Keyword Density */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Keyword Density</h3>
          <div className="space-y-3">
            {resumeOptimization.keywordDensity.map((keyword, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">{keyword.keyword}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{keyword.count} times</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${Math.min(keyword.density * 10, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Improvements */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Suggested Improvements</h3>
          <div className="space-y-2">
            {resumeOptimization.improvements.map((improvement, index) => (
              <div key={index} className="flex items-center p-3 bg-yellow-50 rounded-lg">
                <span className="text-yellow-600 mr-2">💡</span>
                <span className="text-yellow-800">{improvement}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderCoverLetter = () => {
    if (!coverLetter) return <div className="text-center py-8">Loading cover letter...</div>;
    
    return (
      <div className="space-y-6">
        {/* Cover Letter Content */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Generated Cover Letter</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <pre className="whitespace-pre-wrap text-sm text-gray-700">{coverLetter.content}</pre>
          </div>
        </div>

        {/* Variations */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Style Variations</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-bold text-blue-800 mb-2">Professional</h4>
              <p className="text-sm text-blue-700">Formal, traditional approach</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-bold text-green-800 mb-2">Casual</h4>
              <p className="text-sm text-green-700">Friendly, approachable tone</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-bold text-purple-800 mb-2">Creative</h4>
              <p className="text-sm text-purple-700">Innovative, eye-catching</p>
            </div>
          </div>
        </div>

        {/* Keywords */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Key Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {coverLetter.keywords.map((keyword, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderInterviewPrep = () => {
    if (!interviewPrep) return <div className="text-center py-8">Loading interview preparation...</div>;
    
    return (
      <div className="space-y-6">
        {/* Mock Questions */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Mock Interview Questions</h3>
          <div className="space-y-4">
            {interviewPrep.mockQuestions.map((q, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-800">{q.question}</span>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    q.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                    q.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {q.difficulty}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">Category: {q.category}</p>
                <p className="text-sm text-blue-600">💡 {q.tips}</p>
              </div>
            ))}
          </div>
        </div>

        {/* STAR Examples */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-800">STAR Method Examples</h3>
          <div className="space-y-4">
            {interviewPrep.starExamples.map((example, index) => (
              <div key={index} className="p-4 bg-blue-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold text-blue-800 mb-1">Situation</h4>
                    <p className="text-sm text-blue-700">{example.situation}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-800 mb-1">Task</h4>
                    <p className="text-sm text-blue-700">{example.task}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-800 mb-1">Action</h4>
                    <p className="text-sm text-blue-700">{example.action}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-800 mb-1">Result</h4>
                    <p className="text-sm text-blue-700">{example.result}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Company Research */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Company Research</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">Company: {interviewPrep.companyResearch.companyName}</h4>
              <p className="text-sm text-gray-600">Industry: {interviewPrep.companyResearch.industry}</p>
              <p className="text-sm text-gray-600">Culture: {interviewPrep.companyResearch.culture}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">Values</h4>
              <p className="text-sm text-gray-600">{interviewPrep.companyResearch.values.join(', ')}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'analysis':
        return renderAnalysis();
      case 'resume':
        return renderResumeOptimization();
      case 'coverletter':
        return renderCoverLetter();
      case 'interview':
        return renderInterviewPrep();
      default:
        return <div className="text-center py-8">Feature coming soon...</div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">🤖</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">AI Career Assistant</h2>
              <p className="text-gray-600">Your intelligent job search companion - v2.0</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto border-b bg-gray-50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? `bg-gradient-to-r ${tab.color} text-white`
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="font-medium">{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            renderContent()
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
