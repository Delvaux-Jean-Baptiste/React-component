import "./custom-badge.css";

export function CustomBadge({
  value,
  variant = "danger", // primary | success | warning | danger | gray
  size = "medium", // small | medium | large
  position = "top-right", // top-right | top-left | bottom-right | bottom-left
  icon = null,
  isActive = true,
  maxValue = 99,
  children = null,
  className = "",
}) {
  const displayValue =
    typeof value === "number" && value > maxValue ? `${maxValue}+` : value;

  const isAnchored = Boolean(children);

  const badgeElement = (
    <span
      className={`badge badge-${variant} badge-${size} ${
        isAnchored ? `badge-pos-${position}` : ""
      } ${!isActive ? "badge-inactive" : ""} ${className}`}
    >
      {icon && <span className="badge-icon">{icon}</span>}
      {displayValue !== undefined && displayValue !== null && (
        <span className="badge-text">{displayValue}</span>
      )}
    </span>
  );

  if (isAnchored) {
    return (
      <div className="badge-anchor-wrapper">
        {children}
        {badgeElement}
      </div>
    );
  }

  return badgeElement;
}
