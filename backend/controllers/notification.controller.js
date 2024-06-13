import Notification from "../models/notifications.model.js";
export async function getNotifications(req, res) {
  const userId = req.user._id;
  try {
    const notifications = await Notification.find({ to: userId }).populate({
      path: "from",
      selected: "username profileImg",
    });

    await Notification.updateMany({ to: userId }, { read: true });

    res.status(200).json(notifications);
  } catch (error) {
    console.log("Error occured at getNotifications", error.message);
    res.status(500).json({ message: " Internal server error" });
  }
}

export async function deleteNotifications(req, res) {
  const userId = req.user._id;
  try {
    await Notification.deleteMany({ to: userId }, { read: true });
    res.status(200).json({ message: "notifications deleted successfully" });
  } catch (error) {
    console.log("Error occured at deleteNotifications", error.message);
    res.status(500).json({ message: " Internal server error" });
  }
}
