import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

const AnnouncementForm = ({
  onSubmit,
  editingAnnouncement,
  onCancel,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (editingAnnouncement) {
      setTitle(editingAnnouncement.title || "");
      setDescription(editingAnnouncement.description || "");
    } else {
      setTitle("");
      setDescription("");
    }
  }, [editingAnnouncement]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert("Please fill in all fields");
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-5 border-b border-gray-100 pb-3">
        <h2 className="text-xl font-semibold text-gray-800">
          {editingAnnouncement
            ? "Edit Announcement"
            : "Create Announcement"}
        </h2>

        <button
          type="button"
          onClick={onCancel}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition cursor-pointer"
        >
          <FaTimes size={15} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Announcement Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Mid-term Capstone Evaluation Schedule"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 text-xs"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Announcement Content / Description *
          </label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write announcement details for all students and mentors..."
            rows="5"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 resize-none text-xs"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 cursor-pointer"
          >
            {editingAnnouncement
              ? "Update Announcement"
              : "Post Announcement"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnnouncementForm;