import React, { useState } from "react";
import { FaBullhorn, FaPlus } from "react-icons/fa";
// Import AnnouncementCard and AnnouncementForm from the Anouncement folder (correct folder name)
import AnnouncementCard from "../../components/Anouncement/AnnouncementCard";
import AnnouncementForm from "../../components/Anouncement/AnnouncementForm";
import { useAnnouncement } from "../../contextAPI/Anouncement";

const Announcement = () => {
  const {
    announcements,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
  } = useAnnouncement();

  // Debug: Log announcements when they change to verify data is loaded
  React.useEffect(() => {
    console.log("Current announcements:", announcements);
  }, [announcements]);

  const [showForm, setShowForm] =
    useState(false);

  const [editingAnnouncement, setEditingAnnouncement] =
    useState(null);


  const handleSubmit = (data) => {
    if (editingAnnouncement) {
      updateAnnouncement(
        editingAnnouncement.id,
        data
      );

      setEditingAnnouncement(null);
    } else {
      addAnnouncement(data);
    }

    setShowForm(false);
  };


  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this announcement?"
    );

    if (confirmDelete) {
      deleteAnnouncement(id);
    }
  };



  const handleCancel = () => {
    setEditingAnnouncement(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* PAGE HEADER */}

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <FaBullhorn size={20} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Announcements
                </h1>

                <p className="text-sm text-gray-500">
                  Manage school announcements
                </p>
              </div>
            </div>
          </div>

          {/* CREATE BUTTON */}

          {!showForm && (
            <button
              onClick={() => {
                setEditingAnnouncement(null);
                setShowForm(true);
              }}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <FaPlus size={14} />
              Create Announcement
            </button>
          )}
        </div>

        {/* CREATE / EDIT FORM */}

        {showForm && (
          <div className="mb-8">
            <AnnouncementForm
              onSubmit={handleSubmit}
              editingAnnouncement={
                editingAnnouncement
              }
              onCancel={handleCancel}
            />
          </div>
        )}

        {/* ANNOUNCEMENT LIST */}

        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-800">
              All Announcements
            </h2>

            <span className="text-sm text-gray-500">
              {announcements.length}{" "}
              {announcements.length === 1
                ? "Announcement"
                : "Announcements"}
            </span>
          </div>

          {announcements.length === 0 ? (
            /* EMPTY STATE */

            <div className="bg-white border border-dashed border-gray-300 rounded-xl p-12 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
                <FaBullhorn size={22} />
              </div>

              <h3 className="text-lg font-semibold text-gray-700">
                No announcements yet
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Create your first announcement
                to get started.
              </p>

              <button
                onClick={() => setShowForm(true)}
                className="mt-5 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Create Announcement
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {announcements.map((announcement) => (
                  <AnnouncementCard
                    key={announcement.id}
                    announcement={announcement}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Announcement;