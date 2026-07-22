import { useEffect } from "react";
import "./Notification.css";

const notificationIcons = {
    success: "✓",
    error: "×",
    warning: "!",
    info: "i",
};

export default function Notification({
                                         id,
                                         type = "info",
                                         title,
                                         message,
                                         duration = 4000,
                                         onClose,
                                     }) {
    useEffect(() => {
        if (duration === 0) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            onClose(id);
        }, duration);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [id, duration, onClose]);

    return (
        <article
            className={`notification notification--${type}`}
            role={type === "error" ? "alert" : "status"}
            aria-live={type === "error" ? "assertive" : "polite"}
        >
            <div
                className="notification__icon"
                aria-hidden="true"
            >
                {notificationIcons[type]}
            </div>

            <div className="notification__content">
                {title && (
                    <h3 className="notification__title">
                        {title}
                    </h3>
                )}

                {message && (
                    <p className="notification__message">
                        {message}
                    </p>
                )}
            </div>

            <button
                type="button"
                className="notification__close"
                aria-label="Close notification"
                onClick={() => onClose(id)}
            >
                ×
            </button>

            {duration > 0 && (
                <div
                    className="notification__progress"
                    style={{
                        animationDuration: `${duration}ms`,
                    }}
                />
            )}
        </article>
    );
}