import "./specialButton.css"

export default function SpecialButton({
                                   children,
                                   variant = "primary",
                                   size = "medium",
                                   loading = false,
                                   fullWidth = false,
                                   className = "",
                                   disabled = false,
                                   ...props
                               }) {
    const classes = [
        "btn",
        `btn-${variant}`,
        `btn-${size}`,
        fullWidth ? "btn-full" : "",
        loading ? "btn-loading" : "",
        className
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <button
            className={classes}
            disabled={disabled || loading}
            aria-busy={loading}
            {...props}
        >
            {loading && <span className="loader" aria-hidden="true" />}

            <span className={loading ? "btn-text-hidden" : ""}>
                {children}
            </span>
        </button>
    );
}