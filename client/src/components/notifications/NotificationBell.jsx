import { useEffect, useRef, useState } from "react";
import api from "../../services/api";
import "./NotificationBell.css";

function NotificationBell() {

    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);
    const notificationRef = useRef(null);

    const fetchNotifications = async () => {
        try {

            const response = await api.get("/notifications");

            setNotifications(response.data);

        } catch (error) {

            console.log(
                error.response?.data ||
                error.message
            );

        }
    };

    const markAsRead = async (id) => {
        try {

            await api.put(`/notifications/${id}/read`);

            setNotifications((prev) =>
                prev.map((notification) =>
                    notification._id === id
                        ? {
                              ...notification,
                              isRead: true,
                          }
                        : notification
                )
            );

        } catch (error) {

            console.log(
                error.response?.data ||
                error.message
            );

        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put("/notifications/read-all");

            setNotifications((prev) =>
                prev.map((notification) => ({
                    ...notification,
                    isRead: true,
                }))
            );
            setOpen(false);

        } catch (error) {
            console.log(
                error.response?.data ||
                error.message
            );
        }
    };

    useEffect(() => {
        fetchNotifications();

        const interval = setInterval(() => {
            fetchNotifications();
        }, 15000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {

            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    const unreadCount = notifications.filter(
        (notification) => !notification.isRead
    ).length;

    return (

        <div className="notification-container"
            ref={notificationRef}
        >
            <button
                className="notification-btn"
                onClick={() => setOpen(!open)}
            >
                🔔

                {unreadCount > 0 && (

                    <span className="notification-count">
                        {unreadCount}
                    </span>

                )}
            </button>

            {open && (
                <div className="notification-dropdown">
                    <h3>Notifications</h3>
                    {notifications.length === 0 ? (
                        <p className="empty-notification">
                            🎉 You're all caught up!
                        </p>
                    ) : (
                        <>
                            {notifications.map((notification) => (
                                <div
                                    key={notification._id}
                                    className={
                                        notification.isRead
                                            ? "notification-item"
                                            : "notification-item unread"
                                    }
                                    onClick={() =>
                                        markAsRead(notification._id)
                                    }
                                >
                                    <strong>
                                        {notification.type === "success"
                                            ? "✅ "
                                            : notification.type === "warning"
                                            ? "⚠️ "
                                            : notification.type === "error"
                                            ? "❌ "
                                            : "ℹ️ "}
                                        {notification.title}
                                    </strong>

                                    <p>
                                        {notification.message}
                                    </p>

                                    <small>
                                        {new Date(
                                            notification.createdAt
                                        ).toLocaleString()}
                                    </small>
                                </div>
                            ))}

                            <button
                                className="mark-all-btn"
                                onClick={markAllAsRead}
                            >
                                ✓ Mark All as Read
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default NotificationBell;