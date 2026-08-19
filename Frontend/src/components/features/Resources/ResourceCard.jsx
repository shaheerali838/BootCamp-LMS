import React, { useState } from "react";
import { FiDownload, FiTrash2, FiEdit2, FiExternalLink } from "react-icons/fi";
import { downloadResourceFile } from "../../../utils/downloadHelper";

function ResourceCard({ resource, onDelete, onEdit }) {
  const [downloading, setDownloading] = useState(false);
  const title = resource.title || resource.name || "Resource File";
  const type = (resource.fileType || resource.type || "PDF").toUpperCase();
  const size = resource.fileSize || resource.size || "PDF";
  const fileUrl = resource.file || resource.fileUrl || resource.url || resource.link;
  const fileName = resource.fileName || title;
  const categoryName =
    typeof resource.category === "object"
      ? resource.category?.categoryName
      : resource.category || "General";
  const date = resource.createdAt
    ? new Date(resource.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : resource.date || "Recently";

  const getTypeStyle = () => {
    switch (type) {
      case "PDF":
        return "bg-red-100 text-red-600 border border-red-200";

      case "VID":
        return "bg-purple-100 text-purple-600 border border-purple-200";

      case "ZIP":
        return "bg-amber-100 text-amber-600 border border-amber-200";

      case "DOC":
        return "bg-blue-100 text-blue-600 border border-blue-200";

      case "PPT":
        return "bg-emerald-100 text-emerald-600 border border-emerald-200";

      default:
        return "bg-gray-100 text-gray-600 border border-gray-200";
    }
  };

  const handleDownloadOrView = async () => {
    if (!fileUrl) {
      alert("This resource does not have an attached file.");
      return;
    }

    setDownloading(true);
    try {
      await downloadResourceFile(fileUrl, fileName, type);
    } catch (err) {
      console.error("Download error:", err);
    } finally {
      setDownloading(false);
    }
  };

  const resourceId = resource._id || resource.id;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between hover:shadow-md hover:border-gray-300 transition duration-150 group">
      {/* Left */}
      <div className="flex items-center gap-3.5 min-w-0">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${getTypeStyle()}`}
        >
          {type}
        </div>

        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition" title={title}>
            {title}
          </h3>

          <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
            <span>{size}</span>
            <span>•</span>
            <span>{date}</span>
            <span>•</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[11px] font-medium">
              {categoryName}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0 ml-3">
        {onEdit && (
          <button
            onClick={() => onEdit(resource)}
            title="Edit Resource"
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
          >
            <FiEdit2 size={16} />
          </button>
        )}

        <button
          onClick={handleDownloadOrView}
          disabled={downloading}
          title="Download Resource"
          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-50 rounded-lg transition flex items-center gap-1 cursor-pointer"
        >
          {downloading ? (
            <span className="text-[10px] font-bold text-blue-600 animate-pulse">...</span>
          ) : (
            <FiDownload size={16} />
          )}
        </button>

        {onDelete && (
          <button
            onClick={() => onDelete(resourceId)}
            title="Delete Resource"
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
          >
            <FiTrash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

export default ResourceCard;