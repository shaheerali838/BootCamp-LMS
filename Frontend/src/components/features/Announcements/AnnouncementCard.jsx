import React, { useState } from "react";
import {FaEdit,FaTrash,FaChevronDown,FaChevronUp,} from "react-icons/fa";

const AnnouncementCard = ({
  announcement,
  onEdit,
  onDelete,
  showActions = true,
}) => {
  const [showDetails, setShowDetails] =
    useState(false);

  // Debug: Log announcement data to verify structure
  React.useEffect(() => {
    console.log("Announcement data:", announcement);
  }, [announcement]);

  const handleToggle = () => {
    setShowDetails((prev) => !prev);
  };

  return (
    <div className="bg-white border w-full  border-gray-200 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
      <div
        className="p-5 cursor-pointer"
        onClick={handleToggle}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800">
              {announcement.title}
            </h3>

            <p className="text-sm text-gray-400 mt-1">
              {announcement.createdAt}
            </p>
          </div>
          <div
            className="flex items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            {showActions && (
              <>
                <button
                  onClick={() =>
                    onEdit(announcement)
                  }
                  className="w-9 h-9 flex items-center justify-center rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 transition"
                  title="Edit announcement"
                >
                  <FaEdit size={15} />
                </button>

                <button
                  onClick={() =>
                    onDelete(announcement._id || announcement.id)
                  }
                  className="w-9 h-9 flex items-center justify-center rounded-lg text-red-600 bg-red-50 hover:bg-red-100 transition cursor-pointer"
                  title="Delete announcement"
                >
                  <FaTrash size={14} />
                </button>
              </>
            )}
            <button
              onClick={handleToggle}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
              title={
                showDetails
                  ? "Hide announcement"
                  : "Show announcement"
              }
            >
              {showDetails ? (
                <FaChevronUp size={14} />
              ) : (
                <FaChevronDown size={14} />
              )}
            </button>
          </div>
        </div>
      </div>
      {showDetails && (
        <div className="border-t border-gray-200 bg-white p-5">
          <div>
            <h4 className="text-sm font-semibold text-gray-600 mb-2">Description:</h4>
            <p className="text-gray-800 leading-7 whitespace-pre-wrap break-words">
              {announcement.description && announcement.description.trim()
                ? announcement.description
                : "No description provided for this announcement"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementCard;