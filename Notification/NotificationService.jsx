let nextNotificationId = 1;

const listeners = new Set();

function emit(event) {
    listeners.forEach((listener) => listener(event));
}

function createNotification(type, options) {
    const notification = {
        id: nextNotificationId++,
        type,
        title: options.title ?? "",
        message: options.message ?? "",
        duration: options.duration ?? 4000,
    };

    emit({
        action: "add",
        notification,
    });

    return notification.id;
}

export const notificationService = {
    subscribe(listener) {
        listeners.add(listener);

        return () => {
            listeners.delete(listener);
        };
    },

    success(options) {
        return createNotification("success", options);
    },

    error(options) {
        return createNotification("error", options);
    },

    warning(options) {
        return createNotification("warning", options);
    },

    info(options) {
        return createNotification("info", options);
    },

    close(id) {
        emit({
            action: "remove",
            id,
        });
    },

    clear() {
        emit({
            action: "clear",
        });
    },
};