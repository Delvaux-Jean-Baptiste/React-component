import {useCallback, useEffect, useState} from "react";
import Notification from "./Notification";
import {notificationService} from "./NotificationService";
import "./Notification.css";

export default function NotificationContainer() {
    const [notifications, setNotifications] = useState([]);

    const closeNotification = useCallback((id) => {
        setNotifications((currentNotifications) =>
            currentNotifications.filter(
                (notification) => notification.id !== id
            )
        );
    }, []);

    useEffect(() => {
        return notificationService.subscribe((event) => {
            switch (event.action) {
                case "add":
                    setNotifications((currentNotifications) => [
                        ...currentNotifications,
                        event.notification,
                    ]);
                    break;

                case "remove":
                    setNotifications((currentNotifications) =>
                        currentNotifications.filter(
                            (notification) =>
                                notification.id !== event.id
                        )
                    );
                    break;

                case "clear":
                    setNotifications([]);
                    break;

                default:
                    console.warn(
                        `Unknown notification action: ${event.action}`
                    );
            }
        });
    }, []);

    return (
        <section
            className="notification-container"
            aria-label="Notifications"
        >
            {notifications.map((notification) => (
                <Notification
                    key={notification.id}
                    {...notification}
                    onClose={closeNotification}
                />
            ))}
        </section>
    );
}