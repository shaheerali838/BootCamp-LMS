import React, { useMemo, useState } from "react";
import { FiSearch, FiUpload, FiX, FiEdit2 } from "react-icons/fi";

import ResourceCard from "../components/features/Resources/ResourceCard";
import UploadResourceModal from "../components/features/Resources/UploadResourceModal";
import { useResources } from "../context/ResourceContext";

function Resources() {
  const { resources, setResources, addResource, updateResource } = useResources();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Edit state
  const [editingResource, setEditingResource] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    category: "React",
    type: "PDF",
  });

  const categories = [
    "All",
    "React",
    "Node.js",
    "Database",
    "JavaScript",
    "Projects",
    "Academic",
    "CSS",
    "Lectures",
  ];

  const filteredResources = useMemo(() => {
    const value = search.toLowerCase();

    return resources.filter((resource) => {
      const matchesSearch =
        resource.name.toLowerCase().includes(value) ||
        resource.category.toLowerCase().includes(value);

      const matchesCategory =
        category === "All" || resource.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [resources, search, category]);

  const handleUpload = (file, selectedCategory) => {
    const extension = file.name.split(".").pop()?.toUpperCase() || "FILE";
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);

    const newResource = {
      name: file.name,
      size: `${sizeInMB} MB`,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      category: selectedCategory,
      type: extension,
    };

    addResource(newResource);
  };

  const handleDelete = (id) => {
    setResources((previous) =>
      previous.filter((resource) => resource.id !== id)
    );
  };

  const handleOpenEdit = (resource) => {
    setEditingResource(resource);
    setEditFormData({
      name: resource.name,
      category: resource.category,
      type: resource.type,
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (editingResource && updateResource) {
      updateResource(editingResource.id, editFormData);
    }
    setEditingResource(null);
  };

  return (
    <div className="p-5 space-y-5">
      {/* Header */}
      <div>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400">Home</span>
          <span className="text-gray-300">›</span>
          <span className="font-semibold text-gray-800">Resource Library</span>
        </div>

        {/* Title */}
        <div className="flex items-center justify-between mt-3">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Resource Library
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Access and manage learning resources
            </p>
          </div>

          {/* Upload Button */}
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition shadow-sm"
          >
            <FiUpload size={18} />
            Upload File
          </button>
        </div>
      </div>

      {/* Search + Categories */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <FiSearch
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search resources..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg outline-none text-sm focus:border-blue-500"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition ${
                  category === item
                    ? "bg-blue-600 text-white"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {filteredResources.map((resource) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            onDelete={handleDelete}
            onEdit={handleOpenEdit}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredResources.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl py-12 text-center">
          <FiSearch size={30} className="mx-auto text-gray-300" />
          <p className="text-sm text-gray-500 mt-3">No resources found.</p>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadResourceModal
          onClose={() => setShowUploadModal(false)}
          onUpload={handleUpload}
        />
      )}

      {/* Edit Resource Modal */}
      {editingResource && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <FiEdit2 className="text-blue-600" /> Edit Learning Resource
              </h2>
              <button
                onClick={() => setEditingResource(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Resource Name *
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={editFormData.category}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
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

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Format Type
                </label>
                <select
                  value={editFormData.type}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, type: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
                >
                  <option value="PDF">PDF</option>
                  <option value="VID">VID (Video)</option>
                  <option value="ZIP">ZIP</option>
                  <option value="DOC">DOC</option>
                  <option value="PPT">PPT</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setEditingResource(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow"
                >
                  Save Changes
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