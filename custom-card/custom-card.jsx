import "./custom-card.css";

export function CustomCard({
  className = "",
  header = null,
  footer = null,
  title = "",
  subtitle = "",
  img = "",
  isClickable = false,
  onClick,
  children,
  actionArea = null,
}) {
  const clickable = isClickable && Boolean(onClick);
  const handleBlockPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className={`card ${clickable ? "card-clickable" : ""} ${className}`}
      onClick={clickable ? onClick : undefined}
    >
      {header && <div className="card-header">{header}</div>}
      {img && (
        <div className="card-image-wrapper">
          <img src={img} />
        </div>
      )}
      <div className="card-body">
        {title && <h3>{title}</h3>}
        {subtitle && <h4>{subtitle}</h4>}
        {children && <div className="card-content">{children}</div>}
        {actionArea && (
          <div className="card-action-area" onClick={handleBlockPropagation}>
            {actionArea}
          </div>
        )}
      </div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
}
