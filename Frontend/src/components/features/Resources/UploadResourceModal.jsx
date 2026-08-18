import React, { useState } from "react";
import { FiUpload, FiX } from "react-icons/fi";
import { useResources } from "../../../context/SystemContext";

function UploadResourceModal({ onClose, onUpload }) {
  const { categories = [] } = useResources();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fileType, setFileType] = useState("PDF");
  const [category, setCategory] = useState(categories[0]?._id || "React");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Resource Title is required.");
      return;
    }
    if (!description.trim()) {
      setError("Resource Description is required.");
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      category,
      fileType,
      file: file ? file.name : "document.pdf",
    };

    try {
      if (onUpload) {
        onUpload(payload);
      }
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to upload resource.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              Upload Educational Resource
            </h2>
            <p className="text-xs text-gray-500">
              Publish learning materials, documentation, or starter templates
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition cursor-pointer text-xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Resource Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Master Clean Architecture Guide"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              required
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the resource..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500"
              >
                {categories.length > 0 ? (
                  categories.map((c) => (
                    <option key={c._id || c.id} value={c._id || c.id}>
                      {c.name || c.categoryName || "Category"}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="React">React</option>
                    <option value="Node.js">Node.js</option>
                    <option value="Database">Database</option>
                    <option value="Projects">Projects</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Resource Type *
              </label>
              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500"
              >
                <option value="PDF">PDF Document</option>
                <option value="VIDEO">Video Lecture</option>
                <option value="DOCUMENT">Article / Doc</option>
                <option value="IMAGE">Diagram / Image</option>
                <option value="LINK">External Link</option>
              </select>
            </div>
          </div>

          {/* File input */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Select Attachment / File
            </label>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-5 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
              <FiUpload size={24} className="text-blue-600 mb-1" />
              <span className="text-xs text-gray-600 text-center">
                {file ? file.name : "Click to select a file"}
              </span>
              <input
                type="file"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              <FiUpload size={14} />
              Publish Resource
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UploadResourceModal;