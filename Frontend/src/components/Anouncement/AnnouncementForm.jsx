import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useAnnouncement } from "../../contextAPI/Anouncement";

const AnnouncementForm = ({
  onSubmit,
  editingAnnouncement,
  onCancel,
}) => {
  const { announcements } = useAnnouncement();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [postedBy, setPostedBy] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (editingAnnouncement) {
      setTitle(editingAnnouncement.title || "");
      setDescription(
        editingAnnouncement.description || ""
      );
      setPostedBy(
        editingAnnouncement.postedBy || ""
      );
      setDate(
        editingAnnouncement.createdAt || ""
      );
    } else if (announcements.length > 0) {
      const announcement = announcements[0];

      setTitle(announcement.title || "");
      setDescription(
        announcement.description || ""
      );
      setPostedBy(
        announcement.postedBy || ""
      );
      setDate(
        announcement.createdAt || ""
      );
    } else {
      setTitle("");
      setDescription("");
      setPostedBy("");
      setDate("");
    }
  }, [editingAnnouncement, announcements]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !title.trim() ||
      !description.trim() ||
      !postedBy.trim() ||
      !date.trim()
    ) {
      alert("Please fill in all fields");
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      postedBy: postedBy.trim(),
      createdAt: date.trim(),
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">

      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold text-gray-800">
          {editingAnnouncement
            ? "Edit Announcement"
            : "Create Announcement"}
        </h2>

        <button
          type="button"
          onClick={onCancel}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 bg-gray-100 hover:bg-gray-200 transition"
        >
          <FaTimes size={15} />
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Announcement Title
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            placeholder="Enter announcement title"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Posted By
          </label>

          <input
            type="text"
            value={postedBy}
            onChange={(e) =>
              setPostedBy(e.target.value)
            }
            placeholder="Super Admin or Admin"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>

          <input
            type="date"
            value={date}
            onChange={(e) =>
              setDate(e.target.value)
            }
            placeholder="August 14, 2026"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Announcement Description
          </label>

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            placeholder="Write announcement..."
            rows="5"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3">

          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {editingAnnouncement
              ? "Update Announcement"
              : "Create Announcement"}
          </button>

        </div>

      </form>
    </div>
  );
};

export default AnnouncementForm;