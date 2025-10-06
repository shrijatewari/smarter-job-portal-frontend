import React from "react";

const categories = [
  { title: "Software Development", icon: "💻" },
  { title: "Design", icon: "🎨" },
  { title: "Marketing", icon: "📈" },
  { title: "Data Science", icon: "📊" },
  { title: "Business", icon: "💼" },
];

const QuickCategories = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8 px-4">
      {categories.map((cat) => (
        <div
          key={cat.title}
          className="flex flex-col items-center p-4 bg-cream rounded-lg shadow hover:shadow-lg transition cursor-pointer"
        >
          <span className="text-3xl mb-2">{cat.icon}</span>
          <h3 className="text-milkyCoffee font-semibold">{cat.title}</h3>
        </div>
      ))}
    </div>
  );
};

export default QuickCategories;
