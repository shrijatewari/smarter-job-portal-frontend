import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SkillTestsDebug = () => {
  const navigate = useNavigate();
  const [debugInfo, setDebugInfo] = useState("");

  const categories = [
    { id: "DSA", name: "Data Structures & Algorithms", icon: "🔧" },
    { id: "DBMS", name: "Database Management", icon: "🗄️" },
    { id: "OOPS", name: "Object-Oriented Programming", icon: "🏗️" },
    { id: "CN", name: "Computer Networks", icon: "🌐" },
    { id: "OS", name: "Operating Systems", icon: "💻" },
    { id: "Web Development", name: "Web Development", icon: "🌍" }
  ];

  const handleCategoryClick = (category) => {
    console.log("Category clicked:", category);
    setDebugInfo(`Clicked: ${category.name} (${category.id})`);
    
    // Test API call
    testAPI(category.id);
  };

  const testAPI = async (category) => {
    try {
      setDebugInfo(prev => prev + "\n\nTesting API...");
      
      const response = await fetch(`http://localhost:4000/api/tests/questions?category=${category}&difficulty=Easy&limit=1`);
      const data = await response.json();
      
      console.log("API Response:", data);
      
      if (data.success) {
        setDebugInfo(prev => prev + `\n✅ API Success! Found ${data.data.questions.length} questions`);
        
        // Navigate to test page
        navigate("/skill-tests/take", {
          state: {
            questions: data.data.questions,
            testId: data.data.testId,
            category: { id: category, name: categories.find(c => c.id === category)?.name },
            difficulty: { id: "Easy", name: "Easy" },
            totalQuestions: data.data.totalQuestions
          }
        });
      } else {
        setDebugInfo(prev => prev + `\n❌ API Error: ${data.message}`);
      }
    } catch (error) {
      console.error("API Error:", error);
      setDebugInfo(prev => prev + `\n❌ Network Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Debug Skill Tests</h1>
        
        <div className="mb-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-bold mb-2">Debug Info:</h3>
          <pre className="text-sm whitespace-pre-wrap">{debugInfo || "Click a category to test..."}</pre>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-500"
              onClick={() => handleCategoryClick(category)}
            >
              <div className="text-center">
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                <p className="text-gray-600 text-sm">Click to test</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => setDebugInfo("")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Clear Debug Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillTestsDebug;
