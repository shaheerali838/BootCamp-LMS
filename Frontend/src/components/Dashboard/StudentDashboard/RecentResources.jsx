import React from "react";
import { Link } from "react-router-dom";
import { FiFileText } from "react-icons/fi";
import { useResources } from "../../../context/ResourceContext";

function RecentResources() {
  const { resources } = useResources();

  const defaultResources = [
    {
      id: 1,
      name: "React Notes.pdf",
      subtitle: "PDF • 2.4 MB",
      iconColor: "text-red-500 bg-red-50 border-red-100",
    },
    {
      id: 2,
      name: "JS Cheat Sheet.pdf",
      subtitle: "PDF • 1.1 MB",
      iconColor: "text-red-500 bg-red-50 border-red-100",
    },
    {
      id: 3,
      name: "API Integration Guide.pdf",
      subtitle: "PDF • 3.2 MB",
      iconColor: "text-red-500 bg-red-50 border-red-100",
    },
    {
      id: 4,
      name: "Figma Design File.fig",
      subtitle: "FIG • 5.6 MB",
      iconColor: "text-amber-500 bg-amber-50 border-amber-100",
    },
  ];

  const list = resources.length >= 4 ? resources.slice(0, 4).map((r, i) => ({
    id: r.id,
    name: r.name,
    subtitle: `${r.type || "PDF"} • ${r.size}`,
    iconColor: i === 3 ? "text-amber-500 bg-amber-50 border-amber-100" : "text-red-500 bg-red-50 border-red-100",
  })) : defaultResources;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-gray-900">Recent Resources</h2>
        <Link
          to="/student/resources"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
        >
          View All
        </Link>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {list.map((item) => (
          <div
            key={item.id}
            className="border border-gray-100 rounded-xl p-3 bg-gray-50/40 hover:bg-white transition flex items-center gap-3"
          >
            <div
              className={`w-9 h-9 rounded-lg border ${item.iconColor} flex items-center justify-center shrink-0`}
            >
              <FiFileText size={18} />
            </div>
            <div className="overflow-hidden">
              <h3 className="text-xs font-bold text-gray-900 truncate">
                {item.name}
              </h3>
              <p className="text-[10px] font-medium text-gray-400 mt-0.5">
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentResources;
