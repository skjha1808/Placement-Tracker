const Notification = require("../models/Notification");

// Get logged-in user's notifications
const getMyNotifications = async (req, res) => {

    try {
        const notifications = await Notification
            .find({
                user: req.user._id,
            })
            .sort({
                createdAt: -1,
            });

        res.status(200).json(notifications);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });
    }
};

// Mark one notification as read
const markAsRead = async (req, res) => {

    try {
        const notification =
            await Notification.findOneAndUpdate(
                {
                    _id: req.params.id,
                    user: req.user._id,
                },
                {
                    isRead: true,
                },
                {
                    new: true,
                }
            );

        if (!notification) {

            return res.status(404).json({
                message: "Notification not found",
            });
        }

        res.status(200).json(notification);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });
    }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {

    try {
        await Notification.updateMany(

            {
                user: req.user._id,
                isRead: false,
            },

            {
                isRead: true,
            }
        );

        res.status(200).json({
            message: "All notifications marked as read",
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });
    }
};

const deleteNotification = async (req, res) => {

    try {
        const notification =
            await Notification.findOneAndDelete({
                _id: req.params.id,
                user: req.user._id,
            })

        if (!notification) {

            return res.status(404).json({
                message: "Notification not found",
            });
        }

        res.status(200).json({
            message: "Notification deleted successfully",
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    getMyNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
};