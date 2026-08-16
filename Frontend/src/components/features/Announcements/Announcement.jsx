import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { FaBullhorn, FaPlus } from "react-icons/fa";
import AnnouncementCard from "./AnnouncementCard";
import AnnouncementForm from "./AnnouncementForm";
import { useAnnouncement } from "../../../context/AnnouncementContext";

const Announcement = () => {
  const location = useLocation();
  const isSuperAdmin = location.pathname.startsWith("/superadmin");

  const {
    announcements,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
  } = useAnnouncement();

  const [showForm, setShowForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);

  const handleSubmit = (data) => {
    if (editingAnnouncement) {
      updateAnnouncement(editingAnnouncement.id, data);
    } else {
      addAnnouncement(data);
    }

    setEditingAnnouncement(null);
    setShowForm(false);
  };

  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this announcement?",
    );

    if (confirmDelete) {
      deleteAnnouncement(id);
    }
  };

  const handleCancel = () => {
    setEditingAnnouncement(null);
    setShowForm(false);
  };

  const handleCreate = () => {
    setEditingAnnouncement(null);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* PAGE HEADER */}
        <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm p-5 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
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


            {!showForm && (
              <button
                type="button"
                onClick={handleCreate}
                className="shrink-0 flex items-center justify-center gap-2 px-5 py-3 bg-[#0476b9] text-white rounded-lg hover:bg-[#03669f] transition whitespace-nowrap"
              >
                <FaPlus size={14} />
                <span>Create Announcement</span>
              </button>
            )}
          </div>
        </div>

        {showForm && (
          <div className="w-full mb-6">
            <AnnouncementForm
              onSubmit={handleSubmit}
              editingAnnouncement={editingAnnouncement}
              onCancel={handleCancel}
            />
          </div>
        )}

        <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
          <div className="flex items-center justify-between gap-4 mb-5">
            <h2 className="text-lg font-semibold text-gray-800">
              All Announcements
            </h2>

            <span className="text-sm text-gray-500 whitespace-nowrap">
              {announcements.length}{" "}
              {announcements.length === 1 ? "Announcement" : "Announcements"}
            </span>
          </div>

          {announcements.length === 0 ? (
            <div className="w-full border border-dashed border-gray-300 rounded-xl p-10 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
                <FaBullhorn size={22} />
              </div>

              <h3 className="text-lg font-semibold text-gray-700">
                No announcements yet
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Create your first announcement to get started.
              </p>

              <button
                type="button"
                onClick={handleCreate}
                className="mt-5 px-5 py-2.5 bg-[#0476b9] text-white rounded-lg hover:bg-[#03669f] transition"
              >
                Create Announcement
              </button>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-4">
              {announcements.map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
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
