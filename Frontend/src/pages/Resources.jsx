import React, { useMemo, useState } from "react";
import {
  FiSearch,
  FiUpload,
} from "react-icons/fi";

import ResourceCard from "../components/Resources/ResourceCard";
import UploadResourceModal from "../components/Resources/UploadResourceModal";
import { resourceData } from "../components/common/resourceData";

function Resources() {
  const [resources, setResources] = useState(resourceData);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showUploadModal, setShowUploadModal] =
    useState(false);

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
        category === "All" ||
        resource.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [resources, search, category]);

  const handleUpload = (file, selectedCategory) => {
    const extension =
      file.name.split(".").pop()?.toUpperCase() || "FILE";

    const sizeInMB = (
      file.size /
      (1024 * 1024)
    ).toFixed(1);

    const newResource = {
      id: Date.now(),
      name: file.name,
      size: `${sizeInMB} MB`,
      date: new Date().toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "numeric",
          year: "numeric",
        }
      ),
      category: selectedCategory,
      type: extension,
      file: file,
    };

    setResources((previous) => [
      newResource,
      ...previous,
    ]);
  };

  const handleDelete = (id) => {
    setResources((previous) =>
      previous.filter((resource) => resource.id !== id)
    );
  };

  return (
    <div className="p-5 space-y-5">
      {/* Header */}
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

          {/* ONE Upload Button */}
          <button
            onClick={() =>
              setShowUploadModal(true)
            }
            className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
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
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search resources..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg outline-none text-sm focus:border-blue-500"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() =>
                  setCategory(item)
                }
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
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredResources.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl py-12 text-center">
          <FiSearch
            size={30}
            className="mx-auto text-gray-300"
          />

          <p className="text-sm text-gray-500 mt-3">
            No resources found.
          </p>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadResourceModal
          onClose={() =>
            setShowUploadModal(false)
          }
          onUpload={handleUpload}
        />
      )}
    </div>
  );
}

export default Resources;