import React, { useState } from "react";
import { FiUpload, FiX } from "react-icons/fi";

function UploadResourceModal({ onClose, onUpload }) {
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("React");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file.");
      return;
    }

    onUpload(file, category);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Upload Resource
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Select a file to upload
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* File */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select File
            </label>

            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
              <FiUpload
                size={30}
                className="text-blue-600 mb-3"
              />

              <span className="text-sm text-gray-600 text-center">
                {file
                  ? file.name
                  : "Click to select a file"}
              </span>

              <input
                type="file"
                className="hidden"
                onChange={(e) =>
                  setFile(e.target.files[0])
                }
              />
            </label>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="React">React</option>
              <option value="Node.js">Node.js</option>
              <option value="Database">Database</option>
              <option value="JavaScript">JavaScript</option>
              <option value="Projects">Projects</option>
              <option value="Academic">Academic</option>
              <option value="CSS">CSS</option>
              <option value="Lectures">Lectures</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
            >
              <FiUpload size={17} />
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UploadResourceModal;