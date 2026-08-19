import React, { useState } from "react";
import { FiBookOpen, FiPlus, FiTrash2, FiSearch, FiFileText, FiDownload, FiExternalLink } from "react-icons/fi";
import { useResources } from "../../context/SystemContext";
import UploadResourceModal from "../../components/features/Resources/UploadResourceModal";
import { downloadResourceFile } from "../../utils/downloadHelper";

function Resources() {
  const { resources = [], deleteResource, addResource } = useResources();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  const filtered = resources.filter((r) => {
    const title = r.title || r.name || "";
    const category = typeof r.category === "object" ? r.category?.categoryName || "" : r.category || "";
    const query = search.toLowerCase();
    return title.toLowerCase().includes(query) || category.toLowerCase().includes(query);
  });

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this resource?")) {
      try {
        await deleteResource(id);
      } catch (err) {
        alert(err?.response?.data?.message || "Failed to delete resource");
      }
    }
  };

  const handleOpenDoc = async (item) => {
    const fileUrl = item.file || item.fileUrl || item.url || item.link;
    const fileName = item.fileName || item.title || item.name || "Resource";
    const fileType = item.fileType || item.type || "PDF";
    const itemId = item._id || item.id;

    if (!fileUrl) {
      alert("No file URL available on this resource.");
      return;
    }

    setDownloadingId(itemId);
    try {
      await downloadResourceFile(fileUrl, fileName, fileType);
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setDownloadingId(null);
    }
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
              Upload and manage PDF slides, documentation, and resources hosted via Cloudinary
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs shadow transition cursor-pointer"
          >
            <FiPlus size={16} />
            Upload PDF / Resource
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
        <div className="relative max-w-md">
          <FiSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resources by title or category..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
        <div className="grid grid-cols-5 px-5 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
          <span className="col-span-2">Resource Title</span>
          <span>Category</span>
          <span>Size & Format</span>
          <span className="text-right">Actions</span>
        </div>
        <div className="divide-y divide-gray-100">
          {filtered.map((item) => {
            const title = item.title || item.name || "Resource";
            const id = item._id || item.id;
            const categoryName = typeof item.category === "object" ? item.category?.categoryName : item.category || "General";
            const fileType = item.fileType || item.type || "PDF";
            const fileSize = item.fileSize || item.size || "PDF";
            const date = item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : item.date || "Recent";

            return (
              <div key={id} className="grid grid-cols-5 px-5 py-4 items-center hover:bg-gray-50/70 text-xs transition">
                <div className="col-span-2 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0 font-bold text-[11px] border border-red-100">
                    <FiFileText size={16} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-gray-900 truncate" title={title}>{title}</div>
                    <div className="text-[10px] text-gray-400">Added: {date}</div>
                  </div>
                </div>
                <div>
                  <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
                    {categoryName}
                  </span>
                </div>
                <span className="text-xs text-gray-700 font-medium">{fileType} • {fileSize}</span>
                <div className="flex items-center justify-end gap-2 text-gray-400">
                  <button
                    onClick={() => handleOpenDoc(item)}
                    disabled={downloadingId === id}
                    className="p-1.5 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-50 rounded-lg transition cursor-pointer"
                    title="Download File"
                  >
                    {downloadingId === id ? (
                      <span className="text-[10px] font-bold text-blue-600 animate-pulse">...</span>
                    ) : (
                      <FiDownload size={16} />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(id)}
                    className="p-1.5 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="py-10 text-center text-xs text-gray-500">
              No learning resources found.
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showModal && (
        <UploadResourceModal
          onClose={() => setShowModal(false)}
          onUpload={async (formData) => {
            await addResource(formData);
          }}
        />
      )}
    </div>
  );
}

export default Resources;
