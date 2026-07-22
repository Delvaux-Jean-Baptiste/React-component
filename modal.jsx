import { useEffect } from "react";
import SpecialButton from "./specialButton.jsx";
import "./modal.css";

export default function Modal({
    isOpen,
    onClose,
    onConfirm,
    title,
    children,

    size = "medium", // customizable sizes: small, medium, large
    closeOnOverlay = true,

    confirmLabel = "Confirmer", // customizable labels for buttons
    cancelLabel = "Annuler",

    confirmVariant = "primary", // can be "primary", "secondary", "danger", etc.
    cancelVariant = "secondary",

    confirmLoading = false, // can be toggled to show a loading state on the confirm button
    confirmDisabled = false,

    showCancelButton = true, // can be toggled to show/hide the cancel button
    showConfirmButton = true,
}) {

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose?.();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    const handleOverlayClick = () => {
        if (closeOnOverlay) {
            onClose?.();
        }
    };

    return (
        <div
            className="modal-overlay"
            onClick={handleOverlayClick}
        >
            <div
                className={`modal modal-${size}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h2>{title}</h2>

                    <button
                        className="modal-close"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                <div className="modal-body">
                    {children}
                </div>

                <div className="modal-footer">

                    {showCancelButton && (
                        <SpecialButton
                            label={cancelLabel}
                            variant={cancelVariant}
                            onClick={onClose}
                        />
                    )}

                    {showConfirmButton && (
                        <SpecialButton
                            label={confirmLabel}
                            variant={confirmVariant}
                            loading={confirmLoading}
                            disabled={confirmDisabled}
                            onClick={onConfirm}
                        />
                    )}

                </div>
            </div>
        </div>
    );
}