import mongoose from "mongoose";

const anouncementRecipientSchema = new mongoose.Schema(
  {
    anouncementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Anouncement",
      required: true,
    },
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
  },
  { timestamps: true },
);

const AnouncementRecipient = mongoose.model(
  "AnouncementRecipient",
  anouncementRecipientSchema,
);
export default AnouncementRecipient;
