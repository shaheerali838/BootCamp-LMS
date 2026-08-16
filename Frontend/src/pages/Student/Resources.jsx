import React, { useMemo, useState } from "react";
import { FiSearch, FiDownload, FiFileText, FiVideo, FiBookOpen } from "react-icons/fi";
import { useResources } from "../../context/SystemContext";

function Resources() {
  const { resources } = useResources();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = [
    "All",
    "React",
    "Node.js",
    "Database",
    "JavaScript",
    "Projects",
    "Academic",
    "CSS",
    "Lectures",
  ];

  const filteredResources = useMemo(() => {
    const query = search.toLowerCase();
    return resources.filter((res) => {
      const matchQuery =
        res.name.toLowerCase().includes(query) ||
        res.category.toLowerCase().includes(query);
      const matchCat = category === "All" || res.category === category;
      return matchQuery && matchCat;
    });
  }, [resources, search, category]);

  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <div>
        
        <div className="flex items-center justify-between mt-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Resource Library</h1>
            <p className="text-sm text-gray-500 mt-1">
              Download course slides, lectures, and project reference guides
            </p>
          </div>
          <span className="text-xs bg-purple-50 text-purple-700 px-3 py-1 rounded-full border border-purple-200 font-medium">
            View & Download Only
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <FiSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search resources by title or category..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                  category === cat
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((res) => (
          <div
            key={res.id}
            className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                {res.type === "VID" ? <FiVideo size={18} /> : <FiFileText size={18} />}
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-900 line-clamp-1">{res.name}</h3>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  {res.category} • {res.size} • {res.date}
                </p>
              </div>
            </div>

            <button
              onClick={() => alert(`Downloading ${res.name}...`)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
              title="Download file"
            >
              <FiDownload size={18} />
            </button>
          </div>
        ))}

        {filteredResources.length === 0 && (
          <div className="col-span-full bg-white border border-gray-200 rounded-xl p-12 text-center text-gray-500 text-sm">
            <FiBookOpen size={32} className="mx-auto text-gray-300 mb-2" />
            No learning materials found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}

export default Resources;
