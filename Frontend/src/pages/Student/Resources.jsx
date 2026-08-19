import React, { useMemo, useState, useEffect } from "react";
import {
  FiSearch,
  FiDownload,
  FiFileText,
  FiVideo,
  FiBookOpen,
  FiExternalLink,
} from "react-icons/fi";
import { useResources } from "../../context/SystemContext";

function Resources() {
  const {
    resources = [],
    fetchResources,
    categories: apiCategories = [],
  } = useResources();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    if (fetchResources) fetchResources();
  }, [fetchResources]);

  const categories = useMemo(() => {
    const list = ["All"];
    if (apiCategories.length > 0) {
      apiCategories.forEach((c) => {
        const name = c.categoryName || c.name;
        if (name && !list.includes(name)) list.push(name);
      });
    } else {
      [
        "React",
        "Node.js",
        "Database",
        "JavaScript",
        "Projects",
        "Academic",
        "CSS",
        "Lectures",
      ].forEach((c) => {
        if (!list.includes(c)) list.push(c);
      });
    }
    return list;
  }, [apiCategories]);

  const filteredResources = useMemo(() => {
    const query = search.toLowerCase().trim();
    return (resources || []).filter((res) => {
      const name = (res.title || res.name || "").toLowerCase();
      const desc = (res.description || "").toLowerCase();
      const cat = (
        typeof res.category === "object"
          ? res.category?.categoryName || ""
          : res.category || ""
      ).toLowerCase();

      const matchQuery =
        !query ||
        name.includes(query) ||
        desc.includes(query) ||
        cat.includes(query);

      const actualCatName =
        typeof res.category === "object"
          ? res.category?.categoryName
          : res.category;

      const matchCat =
        category === "All" ||
        actualCatName === category ||
        res.category?._id === category;

      return matchQuery && matchCat;
    });
  }, [resources, search, category]);

  const handleDownload = (res) => {
    const fileUrl = res.file || res.url;
    if (fileUrl) {
      window.open(fileUrl, "_blank", "noopener,noreferrer");
    } else {
      alert("No file available for download.");
    }
  };

  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mt-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Resource Library
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Download course slides, PDF guides, and project reference
              materials
            </p>
          </div>
          <span className="text-xs bg-purple-50 text-purple-700 px-3 py-1 rounded-full border border-purple-200 font-medium">
            View & Download Only
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-60">
            <FiSearch
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search resources by title or category..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                  category === cat
                    ? "bg-blue-600 text-white shadow-xs"
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
        {filteredResources.map((res) => {
          const title = res.title || res.name || "Resource";
          const cat =
            typeof res.category === "object"
              ? res.category?.categoryName
              : res.category || "General";
          const type = res.fileType || res.type || "PDF";
          const size = res.fileSize || res.size || "PDF";
          const date = res.createdAt
            ? new Date(res.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : res.date || "Recently";

          return (
            <div
              key={res._id || res.id}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs hover:shadow-md transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100 font-bold text-xs">
                  {type === "VID" ? (
                    <FiVideo size={18} />
                  ) : (
                    <FiFileText size={18} />
                  )}
                </div>
                <div className="min-w-0">
                  <h3
                    className="text-xs font-bold text-gray-900 truncate group-hover:text-blue-600 transition"
                    title={title}
                  >
                    {title}
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {cat} • {size} • {date}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleDownload(res)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition shrink-0 ml-2 cursor-pointer"
                title="View / Download PDF"
              >
                <FiDownload size={18} />
              </button>
            </div>
          );
        })}

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
