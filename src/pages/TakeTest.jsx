import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../config";

const TakeTest = () => {
  // const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { questions, testId, category, difficulty, totalQuestions } = location.state || {};

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(60); // Default timer
  const [testStartTime, setTestStartTime] = useState(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = questions?.[currentQuestionIndex];

  const handleSubmitTest = useCallback(async () => {
    setIsSubmitting(true);
    
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        toast.error("Please log in to submit your test.");
        navigate("/login");
        return;
      }

      const answersArray = Object.values(answers);
      const totalTimeSpent = Math.floor((Date.now() - testStartTime) / 1000);

      const response = await api.post(`${BACKEND_URL}/api/tests/submit`, {
        userId,
        testId,
        category: category.id,
        difficulty: difficulty.id,
        answers: answersArray,
        timeSpent: totalTimeSpent
      });

      if (response.data.success) {
        navigate("/skill-tests/results", {
          state: {
            testResult: response.data.data,
            category,
            difficulty
          }
        });
      } else {
        toast.error("Failed to submit test. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting test:", error);
      toast.error("Failed to submit test. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [navigate, testId, category, difficulty, answers, testStartTime]);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeLeft(questions[currentQuestionIndex + 1]?.timer || 60);
    } else {
      handleSubmitTest();
    }
  }, [currentQuestionIndex, questions, handleSubmitTest]);

  useEffect(() => {
    if (!questions || questions.length === 0) {
      toast.error("No questions found. Please try again.");
      navigate("/skill-tests");
      return;
    }

    setTestStartTime(Date.now());
    setTimeLeft(currentQuestion?.timer || 60);
  }, [currentQuestion, navigate, questions]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNextQuestion();
          return currentQuestion?.timer || 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, currentQuestion?.timer, handleNextQuestion]);

  const handleAnswerSelect = (answer) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion._id]: {
        questionId: currentQuestion._id,
        userAnswer: answer,
        timeSpent: (currentQuestion?.timer || 60) - timeLeft
      }
    }));
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setTimeLeft(questions[currentQuestionIndex - 1]?.timer || 60);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = (timeLeft) => {
    if (timeLeft <= 10) return "text-red-600";
    if (timeLeft <= 30) return "text-yellow-600";
    return "text-green-600";
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Questions Found</h1>
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

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">{category.name}</h1>
              <p className="text-gray-600">Difficulty: {difficulty.name}</p>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${getTimeColor(timeLeft)}`}>
                {formatTime(timeLeft)}
              </div>
              <p className="text-sm text-gray-600">Time remaining</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </p>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-xl font-bold mb-6">{currentQuestion.questionText}</h2>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  answers[currentQuestion._id]?.userAnswer === option
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/skill-tests")}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Exit Test
            </button>
            
            {currentQuestionIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmitTest}
                disabled={isSubmitting}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? "Submitting..." : "Submit Test"}
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </div>

        {/* Question Navigation */}
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-4">Question Navigation</h3>
          <div className="grid grid-cols-10 gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentQuestionIndex(index);
                  setTimeLeft(questions[index]?.timer || 60);
                }}
                className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                  index === currentQuestionIndex
                    ? "bg-blue-600 text-white"
                    : answers[questions[index]._id]
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeTest;
