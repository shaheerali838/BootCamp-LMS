import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { FaBullhorn, FaPlus, FaTimes } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import AnnouncementCard from "./AnnouncementCard";
import AnnouncementForm from "./AnnouncementForm";
import { useAnnouncement } from "../../../context/AnnouncementContext";

const Announcement = () => {
  const location = useLocation();
  const isSuperAdmin = location.pathname.startsWith("/superadmin");

  const {
    announcements = [],
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
  } = useAnnouncement();

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);

  const handleSubmit = async (data) => {
    try {
      if (editingAnnouncement) {
        await updateAnnouncement(
          editingAnnouncement._id || editingAnnouncement.id,
          data
        );
      } else {
        await addAnnouncement(data);
      }

      setEditingAnnouncement(null);
      setShowForm(false);
    } catch (err) {
      console.error("Error submitting announcement:", err);
    }
  };

  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement);
    setShowForm(true);
    // Smooth scroll to top of page/form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this announcement?"
    );

    if (confirmDelete) {
      try {
        await deleteAnnouncement(id);
      } catch (err) {
        console.error("Error deleting announcement:", err);
      }
    }
  };

  const handleCancel = () => {
    setEditingAnnouncement(null);
    setShowForm(false);
  };

  const handleCreate = () => {
    setEditingAnnouncement(null);
    setShowForm((prev) => !prev);
  };

  // Filter announcements by search text
  const filteredAnnouncements = announcements.filter((announcement) => {
    if (!search.trim()) return true;
    const query = search.toLowerCase().trim();
    const titleMatch = announcement.title?.toLowerCase().includes(query);
    const descMatch = announcement.description?.toLowerCase().includes(query);
    return titleMatch || descMatch;
  });

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 min-w-0 pt-6 px-4 sm:px-6">
        <div className="w-11 h-11 shrink-0 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
          <FaBullhorn size={20} />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs text-gray-400 font-medium mb-0.5">
            <span>{isSuperAdmin ? "Super Admin" : "Admin"}</span>
            <span>›</span>
            <span className="font-semibold text-gray-800">Announcements</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 truncate">
            Announcements
          </h1>

          <p className="text-sm text-gray-500 truncate">
            Manage school announcements
          </p>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 mt-4 pb-10">
        {/* Search & Action Bar: Search input on left, Create button on right */}
        <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm p-4 mb-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="relative w-full sm:w-80 md:w-96">
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

            {/* Create Announcement Button on Right Side */}
            <button
              type="button"
              onClick={handleCreate}
              className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0476b9] hover:bg-[#03669f] text-white rounded-xl font-medium text-sm transition shadow-sm cursor-pointer whitespace-nowrap"
            >
              <FaPlus
                size={13}
                className={`transition-transform duration-200 ${
                  showForm && !editingAnnouncement ? "rotate-45" : ""
                }`}
              />
              <span>
                {showForm && !editingAnnouncement
                  ? "Close Form"
                  : "Create Announcement"}
              </span>
            </button>
          </div>
        </div>

        {/* Announcement Form (Opens directly on the page) */}
        {showForm && (
          <div className="w-full mb-6">
            <AnnouncementForm
              onSubmit={handleSubmit}
              editingAnnouncement={editingAnnouncement}
              onCancel={handleCancel}
            />
          </div>
        )}

        {/* Announcement List */}
        <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {search.trim() ? "Search Results" : "All Announcements"}
            </h2>

            <span className="text-xs sm:text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full font-medium whitespace-nowrap">
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
                  ? `No announcements match "${search}". Try checking for typos or searching for different keywords.`
                  : "Create your first announcement to share updates with students and mentors."}
              </p>

              {search.trim() ? (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="mt-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition cursor-pointer"
                >
                  Clear Search
                </button>
              ) : (
                !showForm && (
                  <button
                    type="button"
                    onClick={handleCreate}
                    className="mt-5 px-5 py-2.5 bg-[#0476b9] hover:bg-[#03669f] text-white rounded-lg text-sm font-medium transition cursor-pointer"
                  >
                    Create Announcement
                  </button>
                )
              )}
            </div>
          ) : (
            <div className="w-full flex flex-col gap-4">
              {filteredAnnouncements.map((announcement) => (
                <AnnouncementCard
                  key={announcement._id || announcement.id}
                  announcement={announcement}
                  onEdit={handleEdit}
                  onDelete={() => handleDelete(announcement._id || announcement.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Announcement;
