import React from "react";
import { FiUpload } from "react-icons/fi";

function ResourceHeader() {
  return (
    <div className="flex items-start justify-between">

      <div>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400">
            Home
          </span>

          <span className="text-gray-300">
            ›
          </span>

          <span className="font-semibold text-gray-800">
            Resource Library
          </span>
        </div>

        {/* Date */}
        <p className="text-xs text-gray-400 mt-1">
          Saturday, August 8, 2026
        </p>
      </div>

      {/* Top Upload */}
      <button
        className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-gray-600 rounded-full text-sm hover:bg-gray-50 transition"
      >
        <FiUpload size={15} />
        Upload File
      </button>

    </div>
  );
}

export default ResourceHeader;