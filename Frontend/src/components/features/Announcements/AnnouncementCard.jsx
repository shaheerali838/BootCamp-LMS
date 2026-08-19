import React, { useState } from "react";
import { FaEdit, FaTrash, FaChevronDown, FaChevronUp, FaUser } from "react-icons/fa";

const AnnouncementCard = ({
  announcement,
  onEdit,
  onDelete,
  showActions = true,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleToggle = () => {
    setShowDetails((prev) => !prev);
  };

  // Format date nicely
  const formatDate = (dateVal) => {
    if (!dateVal) return "Recently";
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return dateVal;
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateVal;
    }
  };

  const authorName =
    announcement.createdBy && typeof announcement.createdBy === "object"
      ? `${announcement.createdBy.firstName || ""} ${announcement.createdBy.lastName || ""}`.trim() ||
        announcement.createdBy.email
      : null;

  return (
    <div className="bg-white border w-full border-gray-200 rounded-xl shadow-xs hover:shadow-md transition overflow-hidden">
      <div
        className="p-5 cursor-pointer select-none"
        onClick={handleToggle}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 break-words">
              {announcement.title}
            </h3>

            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-1.5">
              <span>{formatDate(announcement.createdAt)}</span>
              {authorName && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-gray-600">
                    <FaUser size={10} className="text-gray-400" />
                    {authorName}
                  </span>
                </>
              )}
            </div>
          </div>

          <div
            className="flex items-center gap-2 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            {showActions && (
              <>
                <button
                  type="button"
                  onClick={() => onEdit(announcement)}
                  className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 transition cursor-pointer"
                  title="Edit announcement"
                >
                  <FaEdit size={14} />
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(announcement._id || announcement.id)}
                  className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg text-red-600 bg-red-50 hover:bg-red-100 transition cursor-pointer"
                  title="Delete announcement"
                >
                  <FaTrash size={13} />
                </button>
              </>
            )}

            <button
              type="button"
              onClick={handleToggle}
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 transition cursor-pointer"
              title={showDetails ? "Hide description" : "Show description"}
            >
              {showDetails ? (
                <FaChevronUp size={13} />
              ) : (
                <FaChevronDown size={13} />
              )}
            </button>
          </div>
        </div>
      </div>

      {showDetails && (
        <div className="border-t border-gray-100 bg-gray-50/50 p-5">
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Announcement Details
            </h4>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap break-words">
              {announcement.description && announcement.description.trim()
                ? announcement.description
                : "No description provided for this announcement."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementCard;