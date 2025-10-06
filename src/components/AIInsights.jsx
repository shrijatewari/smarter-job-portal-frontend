import React, { useState, useEffect } from "react";
import { aiService } from '../utils/api';

const AIInsights = ({ jobDescription }) => {
  const [keywords, setKeywords] = useState([]);
  const [summary, setSummary] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [fitScore, setFitScore] = useState(0);
  const [skills, setSkills] = useState([]);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [mlHealth, setMlHealth] = useState(null);
  const [error, setError] = useState(null);

  // Check ML service health on component mount
  useEffect(() => {
    checkMLServiceHealth();
  }, []);

  const checkMLServiceHealth = async () => {
    try {
      const health = await aiService.checkMLHealth();
      setMlHealth(health);
    } catch (error) {
      console.warn('ML service health check failed:', error);
      setMlHealth({ status: 'unhealthy' });
    }
  };

  // --- 1️⃣ Enhanced Job Summarization ---
  const handleSummarize = async () => {
    if (!jobDescription?.trim()) {
      setError('Job description is required for summarization');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Use enhanced job summarization
      const result = await aiService.summarizeJob(jobDescription);
      setSummary(result.summary || 'No summary generated');
      
      // Extract keywords from job description for skills display
      const words = jobDescription.split(/\W+/)
        .filter(word => word.length > 3)
        .slice(0, 10);
      setKeywords(words);
      
    } catch (error) {
      console.error('Summarization error:', error);
      setError(error.response?.data?.error || 'Job summarization failed');
    } finally {
      setLoading(false);
    }
  };

  // --- 2️⃣ Enhanced Cover Letter Generation ---
  const handleCoverLetter = async () => {
    if (!resumeFile && !resumeText?.trim()) {
      setError('Please upload a resume file or provide resume text');
      return;
    }
    
    if (!jobDescription?.trim()) {
      setError('Job description is required for cover letter generation');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Use enhanced cover letter generation
      const result = await aiService.generateCoverLetter(
        resumeText,
        jobDescription,
        resumeFile
      );
      
      setCoverLetter(result.cover_letter || 'No cover letter generated');
      
    } catch (error) {
      console.error('Cover letter generation error:', error);
      setError(error.response?.data?.error || 'Cover letter generation failed');
    } finally {
      setLoading(false);
    }
  };

  // --- 3️⃣ Enhanced Fit Score Prediction ---
  const handleFitScore = async () => {
    if (!resumeFile && !resumeText?.trim()) {
      setError('Please provide resume text or upload a resume file for fit score calculation');
      return;
    }
    
    if (!jobDescription?.trim()) {
      setError('Job description is required for fit score calculation');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Use enhanced fit score prediction
      const result = await aiService.predictFitScore(resumeText || 'Resume content', jobDescription);
      setFitScore(result.fit_score || 0);
      
    } catch (error) {
      console.error('Fit score calculation error:', error);
      setError(error.response?.data?.error || 'Fit score calculation failed');
    } finally {
      setLoading(false);
    }
  };

  // --- 4️⃣ Enhanced Skill Extraction ---
  const handleExtractSkills = async () => {
    if (!resumeFile && !resumeText?.trim()) {
      setError('Please provide resume text or upload a resume file for skill extraction');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Use enhanced resume skill extraction
      const result = await aiService.extractSkills(resumeText || 'Resume content');
      setSkills(result.skills || []);
      
    } catch (error) {
      console.error('Skill extraction error:', error);
      setError(error.response?.data?.error || 'Skill extraction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-cream rounded shadow-md mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-milkyCoffee">Enhanced AI Insights</h2>
        {mlHealth && (
          <div className={`text-xs px-2 py-1 rounded ${
            mlHealth.status === 'healthy' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            ML Service: {mlHealth.status === 'healthy' ? '🟢 Online' : '🟡 Fallback'}
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="flex flex-col space-y-3">
        {/* Job Summarization */}
        <button
          className="bg-roastedPeach text-white px-4 py-2 rounded hover:bg-milkyCoffee transition disabled:opacity-50"
          onClick={handleSummarize}
          disabled={loading || !jobDescription?.trim()}
        >
          {loading ? 'Processing...' : 'Summarize Job Description'}
        </button>

        {summary && (
          <div className="bg-white p-3 rounded border">
            <h3 className="font-semibold text-milkyCoffee mb-2">Job Summary:</h3>
            <p className="text-sm text-gray-700">{summary}</p>
          </div>
        )}

        {keywords.length > 0 && (
          <div className="bg-white p-3 rounded border">
            <h3 className="font-semibold text-eucalyptus mb-2">Key Terms Found:</h3>
            <div className="flex flex-wrap gap-2 mt-1">
              {keywords.map((kw, index) => (
                <span
                  key={index}
                  className="bg-eucalyptus text-white px-3 py-1 rounded text-sm"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Resume Upload Section */}
        <div className="bg-white p-3 rounded border">
          <h3 className="font-semibold text-milkyCoffee mb-2">Resume Input:</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload PDF Resume:</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setResumeFile(e.target.files[0])}
                className="border p-2 rounded w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Or paste resume text:</label>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume content here..."
                className="w-full border p-2 rounded"
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* Cover Letter Generation */}
        <button
          className="bg-eucalyptus text-white px-4 py-2 rounded hover:bg-roastedPeach transition disabled:opacity-50"
          onClick={handleCoverLetter}
          disabled={loading || (!resumeFile && !resumeText?.trim()) || !jobDescription?.trim()}
        >
          {loading ? 'Generating...' : 'Generate AI Cover Letter'}
        </button>

        {coverLetter && (
          <div className="bg-white p-3 rounded border">
            <h3 className="font-semibold text-eucalyptus mb-2">Generated Cover Letter:</h3>
            <textarea
              className="w-full border p-2 rounded"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={8}
              placeholder="Your AI-generated cover letter will appear here..."
            />
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => navigator.clipboard.writeText(coverLetter)}
                className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
              >
                Copy to Clipboard
              </button>
              <button
                onClick={() => setCoverLetter('')}
                className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Fit Score Calculation */}
        <button
          className="bg-milkyCoffee text-white px-4 py-2 rounded hover:bg-eucalyptus transition disabled:opacity-50"
          onClick={handleFitScore}
          disabled={loading || (!resumeFile && !resumeText?.trim()) || !jobDescription?.trim()}
        >
          {loading ? 'Calculating...' : 'Calculate Job Fit Score'}
        </button>

        {fitScore > 0 && (
          <div className="bg-white p-3 rounded border">
            <h3 className="font-semibold text-milkyCoffee mb-2">Job Fit Analysis:</h3>
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold text-eucalyptus">{fitScore}%</div>
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${
                      fitScore >= 80 ? 'bg-green-500' :
                      fitScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(fitScore, 100)}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {fitScore >= 80 ? 'Excellent match!' :
                   fitScore >= 60 ? 'Good match' : 'Consider improving skills alignment'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Skill Extraction */}
        <button
          className="bg-roastedPeach text-white px-4 py-2 rounded hover:bg-milkyCoffee transition disabled:opacity-50"
          onClick={handleExtractSkills}
          disabled={loading || (!resumeFile && !resumeText?.trim())}
        >
          {loading ? 'Extracting...' : 'Extract Skills from Resume'}
        </button>

        {skills.length > 0 && (
          <div className="bg-white p-3 rounded border">
            <h3 className="font-semibold text-roastedPeach mb-2">Extracted Skills:</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-roastedPeach text-white px-3 py-1 rounded text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eucalyptus"></div>
            <span className="ml-2 text-sm text-gray-600">Processing with AI...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInsights;
