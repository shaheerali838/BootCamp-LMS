import React, { useState, useEffect, useMemo } from "react";
import { FiUpload, FiX, FiFileText, FiCheck, FiLoader, FiAlertCircle } from "react-icons/fi";
import { useResources } from "../../../context/SystemContext";

const DEFAULT_CATEGORIES = [
  "React",
  "Node.js",
  "Database",
  "JavaScript",
  "Projects",
  "Academic",
  "CSS",
  "Lectures",
];

function UploadResourceModal({ onClose, onUpload }) {
  const { categories = [], addResource } = useResources();

  const categoryOptions = useMemo(() => {
    if (categories.length > 0) {
      return categories.map((c) => ({
        id: c._id || c.id || c.categoryName,
        name: c.categoryName || c.name || "Category",
      }));
    }
    return DEFAULT_CATEGORIES.map((name) => ({
      id: name,
      name,
    }));
  }, [categories]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fileType, setFileType] = useState("PDF");
  const [category, setCategory] = useState(categoryOptions[0]?.id || "React");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!category && categoryOptions.length > 0) {
      setCategory(categoryOptions[0].id);
    }
  }, [categoryOptions, category]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (fileType === "PDF" && !selectedFile.name.toLowerCase().endsWith(".pdf") && selectedFile.type !== "application/pdf") {
        setError("Please select a valid PDF file.");
        return;
      }
      setFile(selectedFile);
      setError("");
      // If title is empty, prefill with file name without extension
      if (!title) {
        const cleanName = selectedFile.name.replace(/\.[^/.]+$/, "");
        setTitle(cleanName);
      }
    }
  };

  const handleSubmit = async (e) => {
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
    if (!category) {
      setError("Please select a valid category.");
      return;
    }
    if (!file) {
      setError("Please select a file (PDF) to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("category", category);
    formData.append("fileType", fileType);
    formData.append("file", file);

    setLoading(true);
    try {
      if (onUpload) {
        await onUpload(formData, { title, description, category, fileType, file });
      } else if (addResource) {
        await addResource(formData);
      }
      onClose();
    } catch (err) {
      console.error("Upload error:", err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to upload resource to Cloudinary. Please check your network or credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto border border-gray-100 animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              Upload Educational Resource
            </h2>
            <p className="text-xs text-gray-500">
              Upload PDF documents & learning materials to Cloudinary
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-700 transition cursor-pointer p-1 rounded-lg hover:bg-gray-100"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs flex items-center gap-2">
              <FiAlertCircle className="shrink-0 text-red-500" size={16} />
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
              disabled={loading}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Master Clean Architecture Guide"
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              required
              rows="3"
              disabled={loading}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the resource..."
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Category *
              </label>
              <select
                value={category}
                disabled={loading}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-blue-500 bg-white"
              >
                {categoryOptions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Resource Type *
              </label>
              <select
                value={fileType}
                disabled={loading}
                onChange={(e) => setFileType(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-blue-500 bg-white"
              >
                <option value="PDF">PDF Document</option>
                <option value="DOC">Word Document</option>
                <option value="PPT">Presentation (PPT)</option>
                <option value="ZIP">Archive (ZIP)</option>
                <option value="VID">Video Lecture</option>
              </select>
            </div>
          </div>

          {/* File input */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Select PDF Attachment *
            </label>

            {!file ? (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                  <FiUpload size={20} />
                </div>
                <span className="text-xs font-semibold text-gray-700">
                  Click to select or browse file
                </span>
                <span className="text-[11px] text-gray-400 mt-1">
                  Supports PDF up to 50MB
                </span>
                <input
                  type="file"
                  accept={fileType === "PDF" ? ".pdf,application/pdf" : "*"}
                  className="hidden"
                  disabled={loading}
                  onChange={handleFileChange}
                />
              </label>
            ) : (
              <div className="flex items-center justify-between p-3.5 border border-blue-200 bg-blue-50/40 rounded-xl">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                    <FiFileText size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      {formatFileSize(file.size)} • Ready to upload to Cloudinary
                    </p>
                  </div>
                </div>

                {!loading && (
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                    title="Remove file"
                  >
                    <FiX size={16} />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer transition disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || !file}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm shadow-blue-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <FiLoader size={14} className="animate-spin" />
                  <span>Uploading to Cloudinary...</span>
                </>
              ) : (
                <>
                  <FiUpload size={14} />
                  <span>Publish Resource</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UploadResourceModal;
