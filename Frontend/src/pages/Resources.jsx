import React, { useMemo, useState, useEffect } from "react";
import { FiSearch, FiUpload, FiX, FiEdit2, FiBookOpen } from "react-icons/fi";

import ResourceCard from "../components/features/Resources/ResourceCard";
import UploadResourceModal from "../components/features/Resources/UploadResourceModal";
import { useResources } from "../context/SystemContext";

function Resources() {
  const {
    resources = [],
    categories: apiCategories = [],
    fetchResources,
    addResource,
    updateResource,
    deleteResource,
  } = useResources();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    if (fetchResources) fetchResources();
  }, [fetchResources]);

  // Edit state
  const [editingResource, setEditingResource] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    category: "",
    fileType: "PDF",
  });

  const categoriesList = useMemo(() => {
    const list = ["All"];
    if (apiCategories.length > 0) {
      apiCategories.forEach((c) => {
        const name = c.categoryName || c.name;
        if (name && !list.includes(name)) list.push(name);
      });
    } else {
      ["React", "Node.js", "Database", "JavaScript", "Projects", "Academic", "CSS", "Lectures"].forEach((c) => {
        if (!list.includes(c)) list.push(c);
      });
    }
    return list;
  }, [apiCategories]);

  const filteredResources = useMemo(() => {
    const value = search.toLowerCase().trim();

    return (resources || []).filter((resource) => {
      const name = (resource.title || resource.name || "").toLowerCase();
      const desc = (resource.description || "").toLowerCase();
      const cat = (
        typeof resource.category === "object"
          ? resource.category?.categoryName || ""
          : resource.category || ""
      ).toLowerCase();

      const matchesSearch =
        !value || name.includes(value) || desc.includes(value) || cat.includes(value);

      const actualCatName =
        typeof resource.category === "object"
          ? resource.category?.categoryName
          : resource.category;

      const matchesCategory =
        selectedCategory === "All" ||
        actualCatName === selectedCategory ||
        resource.category?._id === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [resources, search, selectedCategory]);

  const handleUpload = async (formData) => {
    await addResource(formData);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      try {
        await deleteResource(id);
      } catch (err) {
        alert(err?.response?.data?.message || "Failed to delete resource");
      }
    }
  };

  const handleOpenEdit = (resource) => {
    setEditingResource(resource);
    setEditFormData({
      title: resource.title || resource.name || "",
      category: resource.category?._id || resource.category || "",
      fileType: resource.fileType || resource.type || "PDF",
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (editingResource && updateResource) {
      try {
        const id = editingResource._id || editingResource.id;
        await updateResource(id, editFormData);
        setEditingResource(null);
      } catch (err) {
        alert(err?.response?.data?.message || "Failed to update resource");
      }
    }
  };

  return (
    <div className="p-5 space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mt-3">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
              <FiBookOpen className="text-blue-600" />
              Resource Library
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Upload, preview, and access educational materials powered by Cloudinary
            </p>
          </div>

          {/* Upload Button */}
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition shadow-sm cursor-pointer"
          >
            <FiUpload size={16} />
            Upload PDF / Resource
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
              placeholder="Search resources by title or category..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none text-xs focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categoriesList.map((item) => (
              <button
                key={item}
                onClick={() => setSelectedCategory(item)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                  selectedCategory === item
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
            key={resource._id || resource.id}
            resource={resource}
            onDelete={handleDelete}
            onEdit={handleOpenEdit}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredResources.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl py-14 text-center">
          <FiBookOpen size={36} className="mx-auto text-gray-300 mb-2" />
          <p className="text-sm font-semibold text-gray-700">No resources found</p>
          <p className="text-xs text-gray-400 mt-1">
            Try adjusting your search or upload a new PDF document.
          </p>
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
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <FiEdit2 className="text-blue-600" /> Edit Learning Resource
              </h2>
              <button
                onClick={() => setEditingResource(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Resource Title *
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.title}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={editFormData.category}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-blue-500 bg-white"
                >
                  {apiCategories.length > 0 ? (
                    apiCategories.map((c) => (
                      <option key={c._id || c.id} value={c._id || c.id}>
                        {c.categoryName || c.name}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="React">React</option>
                      <option value="Node.js">Node.js</option>
                      <option value="Database">Database</option>
                      <option value="JavaScript">JavaScript</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Format Type
                </label>
                <select
                  value={editFormData.fileType}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, fileType: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none focus:border-blue-500 bg-white"
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
                  className="px-4 py-2 font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow cursor-pointer"
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