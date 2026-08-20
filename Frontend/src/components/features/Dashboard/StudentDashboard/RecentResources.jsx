import React from "react";
import { Link } from "react-router-dom";
import { FiFileText, FiFolder, FiDownload, FiExternalLink } from "react-icons/fi";
import { useResources } from "../../../../context/SystemContext";
import { downloadResourceFile } from "../../../../utils/downloadHelper";

function RecentResources() {
  const { resources = [] } = useResources();
  const [downloadingId, setDownloadingId] = React.useState(null);

  const list = resources.slice(0, 4).map((r, i) => ({
    id: r._id || r.id || i,
    name: r.name || r.title || "Resource File",
    type: r.fileType || r.type || "PDF",
    fileUrl: r.file || r.fileUrl || r.url || r.link,
    fileName: r.fileName || r.title || r.name || "Resource File",
    subtitle: `${r.fileType || r.type || "Document"} • ${r.fileSize || r.size || "1.2 MB"}`,
    iconColor:
      i % 2 === 0
        ? "text-blue-600 bg-blue-50 border-blue-100"
        : "text-amber-600 bg-amber-50 border-amber-100",
  }));

  const handleDownload = (item) => {
    downloadResourceFile(item);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-gray-900">Recent Resources</h2>
          <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full">
            {resources.length}
          </span>
        </div>
        <Link
          to="/student/resources"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
        >
          View All
        </Link>
      </div>

      {/* 4 Cards Grid */}
      {list.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {list.map((item) => (
            <div
              key={item.id}
              className="border border-gray-100 rounded-xl p-3 bg-gray-50/40 hover:bg-white hover:border-gray-200 transition flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-lg border ${item.iconColor} flex items-center justify-center shrink-0`}
                >
                  <FiFileText size={18} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-gray-900 truncate group-hover:text-blue-600 transition" title={item.name}>
                    {item.name}
                  </h3>
                  <p className="text-[10px] font-medium text-gray-400 mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>

              {item.fileUrl && (
                <button
                  onClick={() => handleDownload(item)}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition shrink-0 cursor-pointer"
                  title="Open / Download in New Tab"
                >
                  <FiExternalLink size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-gray-400 space-y-1">
          <FiFolder size={24} className="mx-auto opacity-50 text-gray-300" />
          <p className="text-xs">No learning resources uploaded yet</p>
        </div>
      )}
    </div>
  );
}

export default RecentResources;
