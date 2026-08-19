import React, { useState, useEffect } from "react";
import { FaBullhorn, FaTimes } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { useAnnouncement } from "../../context/AnnouncementContext";
import AnnouncementCard from "../../components/features/Announcements/AnnouncementCard";

const Announcements = () => {
  const { announcements = [] } = useAnnouncement();
  const [search, setSearch] = useState("");

  // Filter announcements by search
  const filteredAnnouncements = announcements.filter((announcement) => {
    if (!search.trim()) return true;
    const query = search.toLowerCase().trim();
    const titleMatch = announcement.title?.toLowerCase().includes(query);
    const descMatch = announcement.description?.toLowerCase().includes(query);
    return titleMatch || descMatch;
  });

  // Pagination logic (6 items per page)
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(filteredAnnouncements.length / itemsPerPage));

  // Reset to page 1 on search change
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const currentAnnouncements = filteredAnnouncements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <div className="w-full px-4 sm:px-6 lg:px-4 py-8">

        {/* Top Header Card */}
        <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm p-5 mb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 shrink-0 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <FaBullhorn size={20} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Announcements
                </h1>

                <p className="text-sm text-gray-500">
                  View the latest school announcements
                </p>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <FiSearch
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search announcements..."
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  title="Clear search"
                >
                  <FaTimes size={13} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm p-5">

          <div className="flex items-center justify-between gap-4 mb-5">
            <h2 className="text-lg font-semibold text-gray-800">
              {search.trim() ? "Search Results" : "Latest Announcements"}
            </h2>

            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
              {filteredAnnouncements.length}{" "}
              {filteredAnnouncements.length === 1
                ? "Announcement"
                : "Announcements"}
            </span>
          </div>

          {filteredAnnouncements.length === 0 ? (
            <div className="w-full border border-dashed border-gray-300 rounded-xl p-10 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
                <FaBullhorn size={22} />
              </div>

              <h3 className="text-lg font-semibold text-gray-700">
                {search.trim()
                  ? "No matching announcements found"
                  : "No announcements yet"}
              </h3>

              <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
                {search.trim()
                  ? `No announcements match "${search}". Try searching with a different keyword.`
                  : "There are currently no announcements created by Super Admin or Admin."}
              </p>

              {search.trim() && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="mt-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition cursor-pointer"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="w-full flex flex-col gap-4">
                {currentAnnouncements.map((announcement) => (
                  <AnnouncementCard
                    key={announcement._id || announcement.id}
                    announcement={announcement}
                    showActions={false}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold border transition ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 rounded-lg text-xs font-semibold transition ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold border transition ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default Announcements;
