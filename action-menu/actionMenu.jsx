import { useState } from "react";
import ConfirmDialog from "../confirmDialog.jsx";
import "./actionMenu.css";

/*
  ActionMenu Props:
    items: array of objects (see schema below)
    iconPosition: 'left' | 'right'
    className: custom CSS class for wrapper

  Item Schema:
  {
    label: string,
    onClick: fn,
    icon?: ReactNode,
    disabled?: bool,
    danger?: bool,
    hidden?: bool,
    isVisible?: () => bool,
    className?: string,
    
    // Optional modal confirm before onClick
    confirm?: { title?, text?, confirmLabel?, variant? },
  }

  OR Divider item:
  
  Divider Schema:
  {
    type?: 'separator'
  }
*/

export default function ActionMenu({
  items = [],
  iconPosition = "left",
  className = "",
}) {
  const [activeConfirmAction, setActiveConfirmAction] = useState(null);

  const handleActionClick = (action) => {
    if (action.disabled) return;

    if (action.confirm) {
      setActiveConfirmAction(action);
      return;
    }

    action.onClick?.();
  };

  const handleConfirm = () => {
    if (activeConfirmAction) {
      activeConfirmAction.onClick?.();
      setActiveConfirmAction(null);
    }
  };

  const handleCloseConfirm = () => {
    setActiveConfirmAction(null);
  };

  const visibleItems = items.filter((item) => {
    if (item.hidden) return false;
    if (typeof item.isVisible === "function" && !item.isVisible()) return false;
    return true;
  });

  return (
    <>
      <div
        className={`action-menu icon-pos-${iconPosition} ${className}`.trim()}
      >
        {visibleItems.map((item, index) => {
          if (item.type === "separator") {
            return (
              <div key={`sep-${index}`} className="action-menu-separator" />
            );
          }

          const isDanger = item.variant === "danger" || item.danger;

          return (
            <button
              key={item.id || index}
              type="button"
              className={`action-menu-item ${isDanger ? "is-danger" : ""} ${item.className || ""}`.trim()}
              disabled={item.disabled}
              onClick={() => handleActionClick(item)}
            >
              {item.icon && (
                <span className="action-menu-icon">{item.icon}</span>
              )}
              <span className="action-menu-label">{item.label}</span>
            </button>
          );
        })}
      </div>

      {activeConfirmAction && (
        <ConfirmDialog
          title={activeConfirmAction.confirm.title || "Confirmation"}
          text={activeConfirmAction.confirm.text || "Are you certain?"}
          confirmLabel={activeConfirmAction.confirm.confirmLabel || "Yes"}
          variant={activeConfirmAction.confirm.variant || "primary"}
          onConfirm={handleConfirm}
          onCancel={handleCloseConfirm}
          onClose={handleCloseConfirm}
        />
      )}
    </>
  );
}
