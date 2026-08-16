import React, { useState } from "react";
import { FiBookOpen, FiPlus, FiTrash2, FiSearch, FiFileText } from "react-icons/fi";
import { useResources } from "../../context/ResourceContext";

function Resources() {
  const { resources, addResource, setResources } = useResources();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "React",
    size: "2.5 MB",
    type: "PDF",
  });

  const filtered = resources.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    addResource({
      ...formData,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    });
    setFormData({ name: "", category: "React", size: "2.5 MB", type: "PDF" });
    setShowModal(false);
  };

  const handleDelete = (id) => {
    setResources((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <div>
       
        <div className="flex items-center justify-between mt-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FiBookOpen className="text-blue-600" />
              Resource Library Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Upload and manage course slides, documents, and video lectures
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-xs shadow transition"
          >
            <FiPlus size={16} />
            Upload New Resource
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="relative max-w-md">
          <FiSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resources by title or category..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-5 px-5 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
          <span className="col-span-2">Resource Title</span>
          <span>Category</span>
          <span>Size & Format</span>
          <span className="text-right">Actions</span>
        </div>
        <div className="divide-y divide-gray-100">
          {filtered.map((item) => (
            <div key={item.id} className="grid grid-cols-5 px-5 py-4 items-center hover:bg-gray-50 text-sm">
              <div className="col-span-2 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <FiFileText size={16} />
                </div>
                <div>
                  <div className="font-bold text-gray-900">{item.name}</div>
                  <div className="text-xs text-gray-400">Added: {item.date}</div>
                </div>
              </div>
              <div>
                <span className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-xs font-semibold">
                  {item.category}
                </span>
              </div>
              <span className="text-xs text-gray-700 font-medium">{item.type} • {item.size}</span>
              <div className="flex items-center justify-end gap-3 text-gray-400">
                <button
                  onClick={() => handleDelete(item.id)}
                  className="hover:text-red-600 transition"
                  title="Delete"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="py-8 text-center text-sm text-gray-500">
              No learning resources found.
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Upload Learning Resource
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Resource Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. React Advanced Patterns.pdf"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
                >
                  <option value="React">React</option>
                  <option value="Node.js">Node.js</option>
                  <option value="Database">Database</option>
                  <option value="JavaScript">JavaScript</option>
                  <option value="Projects">Projects</option>
                  <option value="Academic">Academic</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Format Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
                >
                  <option value="PDF">PDF Document</option>
                  <option value="VID">Video Lecture (MP4)</option>
                  <option value="ZIP">Zip Archive</option>
                  <option value="DOC">Word Document</option>
                  <option value="PPT">Presentation Slides</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow"
                >
                  Upload File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Resources;
