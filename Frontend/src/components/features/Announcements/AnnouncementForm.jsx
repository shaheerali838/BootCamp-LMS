import React, { useEffect, useState } from "react";
import { FaTimes, FaBullhorn } from "react-icons/fa";
import { FiLoader } from "react-icons/fi";

const AnnouncementForm = ({
  onSubmit,
  editingAnnouncement,
  onCancel,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingAnnouncement) {
      setTitle(editingAnnouncement.title || "");
      setDescription(editingAnnouncement.description || "");
    } else {
      setTitle("");
      setDescription("");
    }
    setError("");
  }, [editingAnnouncement]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Please provide an announcement title.");
      return;
    }

    if (!description.trim()) {
      setError("Please provide announcement details / content.");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
      });
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to post announcement.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 sm:p-6">
      <div className="flex items-center justify-between mb-5 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <FaBullhorn size={14} />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">
            {editingAnnouncement
              ? "Edit Announcement"
              : "Create New Announcement"}
          </h2>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition cursor-pointer"
          title="Close"
        >
          <FaTimes size={14} />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
            Announcement Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError("");
            }}
            placeholder="e.g., Mid-term Capstone Evaluation Schedule & Submission Guidelines"
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
            Announcement Content / Description <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (error) setError("");
            }}
            placeholder="Write announcement details for all students and mentors..."
            rows={5}
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition resize-y min-h-[120px]"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#0476b9] hover:bg-[#03669f] text-white rounded-xl text-sm font-medium transition shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <FiLoader size={14} className="animate-spin" />
                <span>{editingAnnouncement ? "Updating Announcement..." : "Posting Announcement..."}</span>
              </>
            ) : (
              <span>{editingAnnouncement ? "Update Announcement" : "Post Announcement"}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnnouncementForm;