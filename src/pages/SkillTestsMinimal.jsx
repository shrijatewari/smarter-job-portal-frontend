import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SkillTestsMinimal = () => {
  const navigate = useNavigate();
  const [debugInfo, setDebugInfo] = useState("Component loaded");

  const categories = [
    { id: "DSA", name: "Data Structures & Algorithms", icon: "🔧" },
    { id: "DBMS", name: "Database Management", icon: "🗄️" },
    { id: "OOPS", name: "Object-Oriented Programming", icon: "🏗️" }
  ];

  const handleClick = (category) => {
    console.log("CLICKED:", category);
    setDebugInfo(`Clicked: ${category.name}`);
    
    // Test API
    fetch(`http://localhost:4000/api/tests/questions?category=${category.id}&difficulty=Easy&limit=1`)
      .then(response => response.json())
      .then(data => {
        console.log("API Response:", data);
        if (data.success) {
          setDebugInfo(prev => prev + ` - API Success! Found ${data.data.questions.length} questions`);
          
          // Navigate to test
          navigate("/skill-tests/take", {
            state: {
              questions: data.data.questions,
              testId: data.data.testId,
              category: category,
              difficulty: { id: "Easy", name: "Easy" },
              totalQuestions: data.data.totalQuestions
            }
          });
        } else {
          setDebugInfo(prev => prev + ` - API Error: ${data.message}`);
        }
      })
      .catch(error => {
        console.error("Error:", error);
        setDebugInfo(prev => prev + ` - Network Error: ${error.message}`);
      });
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Minimal Skill Tests</h1>
      
      <div style={{ 
        background: "#f0f0f0", 
        padding: "10px", 
        margin: "10px 0", 
        borderRadius: "4px" 
      }}>
        <strong>Debug:</strong> {debugInfo}
      </div>

      <div style={{ display: "grid", gap: "10px", marginTop: "20px" }}>
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => handleClick(category)}
            style={{
              border: "2px solid #ccc",
              borderRadius: "8px",
              padding: "20px",
              cursor: "pointer",
              background: "white",
              transition: "all 0.3s"
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = "#3b82f6";
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = "#ccc";
              e.target.style.transform = "translateY(0)";
            }}
          >
            <h3>{category.icon} {category.name}</h3>
            <p>Click to test</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillTestsMinimal;
