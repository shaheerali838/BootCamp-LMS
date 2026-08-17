import mongoose from "mongoose";

const announcementRecipientSchema = new mongoose.Schema(
  {
    announcementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Announcement",
      required: true,
    },
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      // Made optional since an announcement might just be for a team or student
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  },
  { timestamps: true },
);

const AnnouncementRecipient = mongoose.model(
  "AnnouncementRecipient",
  announcementRecipientSchema,
);
export default AnnouncementRecipient;
