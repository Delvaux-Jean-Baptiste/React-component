import { useState } from "react";
import "./emptyState.css";

/* ---------------------------------------------------------------------- */
/* Hand-drawn icons (no external icon library)                            */
/* ---------------------------------------------------------------------- */

function InboxIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 12h4l2 3h4l2-3h4" />
      <path d="M5.5 5h13l2 7v7a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1v-7z" />
    </svg>
  );
}

function SearchOffIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="M15 15l5 5" />
      <path d="M8 8l5 5" />
      <path d="M13 8l-5 5" />
    </svg>
  );
}

function AlertIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3.5l9.5 16.5h-19z" />
      <path d="M12 9.5v4.5" />
      <circle cx="12" cy="17" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function PlusIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function RetryIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 12a9 9 0 1 1 2.6 6.35" />
      <path d="M3 20v-6h6" />
    </svg>
  );
}

/* ---------------------------------------------------------------------- */
/* EmptyState                                                             */
/* ---------------------------------------------------------------------- */

const STATE_CONFIG = {
  "no-data": {
    Icon: InboxIcon,
    title: "Nothing here yet",
    description: "Once you add items, they'll show up in this space.",
  },
  "no-results": {
    Icon: SearchOffIcon,
    title: "No results found",
    description: "Try adjusting your search or filters to find what you're looking for.",
  },
  error: {
    Icon: AlertIcon,
    title: "Something went wrong",
    description: "We couldn't load this content. Please try again.",
  },
};

const ICON_PX = { small: 20, medium: 26, large: 32 };

/**
 * EmptyState
 *
 * Generic empty-state block for lists, tables, search results, dashboards, etc.
 *
 * Usage:
 *   <EmptyState />
 *   <EmptyState state="no-results" title="No matches" description="Try a different search." />
 *   <EmptyState state="error" actionLabel="Retry" onAction={retry} />
 *   <EmptyState icon={<CustomSvg />} title="Custom" description="...">
 *       <SomeExtraContent />
 *   </EmptyState>
 */
export default function EmptyState({
  state = "no-data", // "no-data" | "no-results" | "error"
  icon, // optional custom icon element, overrides the default for the state
  title, // optional custom title, overrides default
  description, // optional custom description, overrides default
  actionLabel, // optional label for the action button
  onAction, // optional click handler; button only renders if both this and actionLabel are set
  actionIcon: ActionIcon, // optional icon component rendered inside the action button
  size = "medium", // "small" | "medium" | "large"
  children, // optional extra custom content, rendered below description
  className = "",
}) {
  const config = STATE_CONFIG[state] ?? STATE_CONFIG["no-data"];
  const { Icon } = config;
  const iconPx = ICON_PX[size] ?? ICON_PX.medium;

  return (
    <div
      role={state === "error" ? "alert" : "status"}
      className={`empty-state empty-state--${size} empty-state--${state} ${className}`}
    >
      <div className="empty-state__icon-wrap">
        {icon ?? <Icon className="empty-state__icon" width={iconPx} height={iconPx} />}
      </div>

      <div className="empty-state__text">
        <h3 className="empty-state__title">{title ?? config.title}</h3>
        <p className="empty-state__description">{description ?? config.description}</p>
      </div>

      {children}

      {actionLabel && onAction && (
        <button className="empty-state__action" onClick={onAction}>
          {ActionIcon && (
            <span className="empty-state__action-icon">
              <ActionIcon width={16} height={16} />
            </span>
          )}
          {actionLabel}
        </button>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Demo / preview — shows the three built-in states side by side          */
/* ---------------------------------------------------------------------- */

function DemoEmptyState() {
  const [active, setActive] = useState("no-data");

  const tabs = [
    { key: "no-data", label: "No data" },
    { key: "no-results", label: "No results" },
    { key: "error", label: "Error" },
  ];

  return (
    <div className="empty-state-demo">
      <div className="empty-state-demo__inner">
        <div className="empty-state-demo__tabs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              className={`empty-state-demo__tab ${
                active === tab.key ? "empty-state-demo__tab--active" : ""
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="empty-state-demo__panel">
          {active === "no-data" && (
            <EmptyState
              state="no-data"
              actionLabel="Add item"
              actionIcon={PlusIcon}
              onAction={() => alert("Add item clicked")}
            />
          )}
          {active === "no-results" && (
            <EmptyState
              state="no-results"
              title='No matches for "budget report"'
              actionLabel="Clear filters"
              onAction={() => alert("Filters cleared")}
            />
          )}
          {active === "error" && (
            <EmptyState
              state="error"
              actionLabel="Retry"
              actionIcon={RetryIcon}
              onAction={() => alert("Retrying...")}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export { DemoEmptyState };