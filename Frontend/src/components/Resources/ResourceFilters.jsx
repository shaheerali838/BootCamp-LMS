import React from "react";
import { FiSearch, FiUpload } from "react-icons/fi";

function ResourceFilters({
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  categories,
}) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

      {/* Search */}
      <div className="relative w-full lg:w-[410px]">
        <FiSearch
          size={17}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search resources..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg outline-none text-sm focus:border-blue-500"
        />
      </div>

      {/* Categories */}
      <div className="flex items-center gap-2 flex-wrap">

        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-2 rounded-full text-xs font-medium transition ${
              selectedCategory === category
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {category}
          </button>
        ))}

        {/* Upload */}
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
        >
          <FiUpload size={16} />
          Upload
        </button>

      </div>
    </div>
  );
}

export default ResourceFilters;