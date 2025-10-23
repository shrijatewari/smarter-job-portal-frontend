import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const TestResults = () => {
  // const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { testResult, category, difficulty } = location.state || {};

  const [showDetailedResults, setShowDetailedResults] = useState(false);

  if (!testResult) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Test Results Found</h1>
          <button
            onClick={() => navigate("/skill-tests")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Tests
          </button>
        </div>
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  const getPerformanceMessage = (score) => {
    if (score >= 90) return "Excellent! Outstanding performance!";
    if (score >= 80) return "Great job! Well done!";
    if (score >= 70) return "Good work! Keep it up!";
    if (score >= 60) return "Not bad! Room for improvement.";
    return "Keep practicing! You'll get better!";
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Test Results</h1>
          <div className="flex items-center justify-center gap-4 text-lg text-gray-600">
            <span className="flex items-center gap-2">
              <span className="text-2xl">{category.icon}</span>
              {category.name}
            </span>
            <span>•</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              difficulty.id === "Very Easy" ? "bg-green-100 text-green-800" :
              difficulty.id === "Easy" ? "bg-blue-100 text-blue-800" :
              difficulty.id === "Medium" ? "bg-yellow-100 text-yellow-800" :
              difficulty.id === "Hard" ? "bg-orange-100 text-orange-800" :
              "bg-red-100 text-red-800"
            }`}>
              {difficulty.name}
            </span>
          </div>
        </div>

        {/* Score Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full text-4xl font-bold ${getScoreBgColor(testResult.score)} ${getScoreColor(testResult.score)}`}>
              {testResult.score}%
            </div>
            <h2 className="text-2xl font-bold mt-4 mb-2">{getPerformanceMessage(testResult.score)}</h2>
            <p className="text-gray-600">
              You answered {testResult.correctAnswers} out of {testResult.totalQuestions} questions correctly
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{testResult.correctAnswers}</div>
            <div className="text-gray-600">Correct Answers</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">{testResult.totalQuestions - testResult.correctAnswers}</div>
            <div className="text-gray-600">Incorrect Answers</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{formatTime(testResult.timeSpent)}</div>
            <div className="text-gray-600">Time Taken</div>
          </div>
        </div>

        {/* Detailed Results Toggle */}
        <div className="text-center mb-6">
          <button
            onClick={() => setShowDetailedResults(!showDetailedResults)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showDetailedResults ? "Hide" : "Show"} Detailed Results
          </button>
        </div>

        {/* Detailed Results */}
        {showDetailedResults && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-center mb-6">Question-by-Question Review</h3>
            {testResult.results.map((result, index) => (
              <div
                key={result.questionId}
                className={`bg-white rounded-lg shadow p-6 ${
                  result.isCorrect ? "border-l-4 border-green-500" : "border-l-4 border-red-500"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <h4 className="text-lg font-bold">Question {index + 1}</h4>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    result.isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {result.isCorrect ? "Correct" : "Incorrect"}
                  </span>
                </div>
                
                <p className="text-gray-800 mb-4">{result.questionText}</p>
                
                <div className="space-y-2 mb-4">
                  {result.options.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className={`p-3 rounded-lg ${
                        option === result.correctAnswer
                          ? "bg-green-100 border-2 border-green-500"
                          : option === result.userAnswer && !result.isCorrect
                          ? "bg-red-100 border-2 border-red-500"
                          : "bg-gray-100"
                      }`}
                    >
                      <span className="font-medium mr-2">{String.fromCharCode(65 + optionIndex)}.</span>
                      {option}
                      {option === result.correctAnswer && (
                        <span className="ml-2 text-green-600 font-medium">✓ Correct Answer</span>
                      )}
                      {option === result.userAnswer && !result.isCorrect && (
                        <span className="ml-2 text-red-600 font-medium">✗ Your Answer</span>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-bold text-blue-800 mb-2">Explanation:</h5>
                  <p className="text-blue-700">{result.solutionExplanation}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => navigate("/skill-tests")}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Take Another Test
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestResults;
