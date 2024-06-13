import mongoose from "mongoose";

const notificationSchema = mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    type: {
      type: String,
      required: true,
      enum: ["follow", "like", "comment", "mention"],
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notification = new mongoose.model("Notification", notificationSchema);

export default Notification;
