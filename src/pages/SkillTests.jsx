import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import api from "../utils/api";
import toast from "react-hot-toast";

const SkillTests = () => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    {
      id: "DSA",
      name: "Data Structures & Algorithms",
      icon: "🔧",
      description: "Test your knowledge of data structures, algorithms, and problem-solving skills.",
      color: "from-blue-500 to-blue-600"
    },
    {
      id: "DBMS",
      name: "Database Management",
      icon: "🗄️",
      description: "Database design, SQL queries, normalization, and database concepts.",
      color: "from-green-500 to-green-600"
    },
    {
      id: "OOPS",
      name: "Object-Oriented Programming",
      icon: "🏗️",
      description: "Classes, objects, inheritance, polymorphism, and OOP principles.",
      color: "from-purple-500 to-purple-600"
    },
    {
      id: "CN",
      name: "Computer Networks",
      icon: "🌐",
      description: "Network protocols, OSI model, TCP/IP, and networking concepts.",
      color: "from-orange-500 to-orange-600"
    },
    {
      id: "OS",
      name: "Operating Systems",
      icon: "💻",
      description: "Process management, memory management, file systems, and OS concepts.",
      color: "from-red-500 to-red-600"
    },
    {
      id: "Web Development",
      name: "Web Development",
      icon: "🌍",
      description: "HTML, CSS, JavaScript, frameworks, and web technologies.",
      color: "from-indigo-500 to-indigo-600"
    }
  ];

  const difficulties = [
    { id: "Very Easy", name: "Very Easy", color: "bg-green-100 text-green-800", description: "Basic concepts" },
    { id: "Easy", name: "Easy", color: "bg-blue-100 text-blue-800", description: "Fundamental knowledge" },
    { id: "Medium", name: "Medium", color: "bg-yellow-100 text-yellow-800", description: "Intermediate level" },
    { id: "Hard", name: "Hard", color: "bg-orange-100 text-orange-800", description: "Advanced concepts" },
    { id: "Very Hard", name: "Very Hard", color: "bg-red-100 text-red-800", description: "Expert level" }
  ];

  const handleCategorySelect = (category) => {
    console.log("Category selected:", category);
    setSelectedCategory(category);
    setSelectedDifficulty(null);
  };

  const handleDifficultySelect = async (difficulty) => {
    console.log("Difficulty selected:", difficulty);
    console.log("Selected category:", selectedCategory);
    setSelectedDifficulty(difficulty);
    setLoading(true);

    try {
      console.log("Fetching questions for:", selectedCategory.id, difficulty.id);
      const response = await api.get(`http://localhost:4000/api/tests/questions`, {
        params: {
          category: selectedCategory.id,
          difficulty: difficulty.id,
          limit: 10
        }
      });

      console.log("API Response:", response.data);

      if (response.data.success) {
        // Navigate to test page with questions
        navigate("/skill-tests/take", {
          state: {
            questions: response.data.data.questions,
            testId: response.data.data.testId,
            category: selectedCategory,
            difficulty: difficulty,
            totalQuestions: response.data.data.totalQuestions
          }
        });
      } else {
        toast.error("Failed to load questions. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error("Failed to load questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (selectedDifficulty) {
      setSelectedDifficulty(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
    }
  };

  if (selectedCategory && !selectedDifficulty && !loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <span>←</span>
              Back to Categories
            </button>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Choose Difficulty Level</h1>
            <p className="text-lg text-gray-600">
              Select the difficulty for <strong>{selectedCategory.name}</strong>
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {difficulties.map((difficulty) => (
              <button
                key={difficulty.id}
                onClick={() => handleDifficultySelect(difficulty)}
                className="p-6 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all hover:shadow-lg text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficulty.color}`}>
                    {difficulty.name}
                  </span>
                </div>
                <p className="text-gray-600">{difficulty.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Skill Assessment Tests</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Test your technical knowledge across different domains. Choose a category and difficulty level to get started.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              onClick={() => {
                console.log("Card clicked:", category);
                handleCategorySelect(category);
              }}
            >
              <div className={`h-2 bg-gradient-to-r ${category.color} rounded-t-xl`}></div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{category.icon}</span>
                  <h3 className="text-xl font-bold text-gray-800">{category.name}</h3>
                </div>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Click to start test</span>
                  <span className="text-blue-600 font-medium">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">How it works</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-3">1️⃣</div>
              <h3 className="font-bold mb-2">Choose Category</h3>
              <p className="text-gray-600">Select from DSA, DBMS, OOPS, Networks, OS, or Web Development</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-3">2️⃣</div>
              <h3 className="font-bold mb-2">Select Difficulty</h3>
              <p className="text-gray-600">Pick your comfort level from Very Easy to Very Hard</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-3">3️⃣</div>
              <h3 className="font-bold mb-2">Take Test</h3>
              <p className="text-gray-600">Answer questions with timer and get detailed results</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillTests;