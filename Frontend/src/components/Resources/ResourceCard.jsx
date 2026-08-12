import React from "react";
import {
  FiDownload,
  FiTrash2,
} from "react-icons/fi";

function ResourceCard({ resource, onDelete }) {
  const getTypeStyle = () => {
    switch (resource.type) {
      case "PDF":
        return "bg-red-100 text-red-500";

      case "VID":
        return "bg-purple-100 text-purple-600";

      case "ZIP":
        return "bg-yellow-100 text-yellow-600";

      case "DOC":
        return "bg-blue-100 text-blue-600";

      case "PPT":
        return "bg-green-100 text-green-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const handleDownload = () => {
    if (resource.file) {
      const url = URL.createObjectURL(resource.file);

      const link = document.createElement("a");
      link.href = url;
      link.download = resource.name;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } else {
      alert("This demo resource does not have a downloadable file.");
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between hover:shadow-sm transition">
      {/* Left */}
      <div className="flex items-center gap-4 min-w-0">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-xs font-semibold ${getTypeStyle()}`}
        >
          {resource.type}
        </div>

        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {resource.name}
          </h3>

          <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
            <span>{resource.size}</span>

            <span>•</span>

            <span>{resource.date}</span>

            <span
              className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600"
            >
              {resource.category}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 ml-4">
        <button
          onClick={handleDownload}
          title="Download"
          className="text-gray-400 hover:text-blue-600 transition"
        >
          <FiDownload size={18} />
        </button>

        <button
          onClick={() => onDelete(resource.id)}
          title="Delete"
          className="text-gray-400 hover:text-red-500 transition"
        >
          <FiTrash2 size={18} />
        </button>
      </div>
    </div>
  );
}

export default ResourceCard;