import Announcement from "../../model/announcement.model.js";
import AnnouncementRecipient from "../../model/announcementRecipient.model.js";
import mongoose from "mongoose";

// ---------- CREATE ANNOUNCEMENT ----------
export const createAnnouncement = async (req, res) => {
  try {
    const { title, description, recipients } = req.body;
    
    // Assumes authMiddleware attaches admin user id to req.user._id
    const createdBy = req.user?._id; 

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required.",
      });
    }

    if (!createdBy) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated or user id missing.",
      });
    }

    const announcement = await Announcement.create({
      title,
      description,
      createdBy,
    });

    // Optionally handle recipients if provided
    if (recipients && Array.isArray(recipients) && recipients.length > 0) {
      const recipientDocs = recipients.map(recipient => ({
        announcementId: announcement._id,
        batchId: recipient.batchId || undefined,
        teamId: recipient.teamId || undefined,
        studentId: recipient.studentId || undefined,
      }));
      await AnnouncementRecipient.insertMany(recipientDocs);
    }

    return res.status(201).json({
      success: true,
      message: "Announcement created successfully",
      data: announcement,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create announcement",
      error: error.message,
    });
  }
};

// ---------- GET ALL ANNOUNCEMENTS ----------
export const getAllAnnouncements = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      const searchRegex = new RegExp(search, "i");
      query = {
        $or: [{ title: searchRegex }, { description: searchRegex }],
      };
    }

    const announcements = await Announcement.find(query)
      .populate("createdBy", "firstName lastName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: announcements.length,
      data: announcements,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch announcements",
      error: error.message,
    });
  }
};

// ---------- GET ANNOUNCEMENT BY ID ----------
export const getAnnouncementById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid announcement ID" });
    }

    const announcement = await Announcement.findById(id).populate("createdBy", "firstName lastName email");

    if (!announcement) {
      return res.status(404).json({ success: false, message: "Announcement not found" });
    }

    // Fetch recipients if needed
    const recipients = await AnnouncementRecipient.find({ announcementId: id })
      .populate("batchId", "name")
      .populate("teamId", "name")
      .populate("studentId", "firstName lastName email");

    return res.status(200).json({ 
      success: true, 
      data: {
        ...announcement.toObject(),
        recipients
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch announcement",
      error: error.message,
    });
  }
};

// ---------- UPDATE ANNOUNCEMENT ----------
export const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid announcement ID" });
    }

    const announcement = await Announcement.findById(id);
    if (!announcement) {
      return res.status(404).json({ success: false, message: "Announcement not found" });
    }

    const { title, description } = req.body;

    if (title) announcement.title = title;
    if (description) announcement.description = description;

    await announcement.save();

    return res.status(200).json({
      success: true,
      message: "Announcement updated successfully",
      data: announcement,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update announcement",
      error: error.message,
    });
  }
};

// ---------- DELETE ANNOUNCEMENT ----------
export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid announcement ID" });
    }

    const announcement = await Announcement.findById(id);
    if (!announcement) {
      return res.status(404).json({ success: false, message: "Announcement not found" });
    }

    await Announcement.findByIdAndDelete(id);
    // Also delete associated recipients
    await AnnouncementRecipient.deleteMany({ announcementId: id });

    return res.status(200).json({ success: true, message: "Announcement deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete announcement",
      error: error.message,
    });
  }
};
