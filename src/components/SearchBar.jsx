import React from "react";

const SearchBar = () => {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center mt-6 px-4 space-y-2 md:space-y-0 md:space-x-4">
      <input
        type="text"
        placeholder="Job title or skills"
        className="p-2 rounded border border-wholeWheat w-full md:w-1/3"
      />
      <input
        type="text"
        placeholder="Location"
        className="p-2 rounded border border-wholeWheat w-full md:w-1/3"
      />
      <button className="bg-roastedPeach text-white px-6 py-2 rounded hover:bg-milkyCoffee transition">
        Search
      </button>
    </div>
  );
};

export default SearchBar;
