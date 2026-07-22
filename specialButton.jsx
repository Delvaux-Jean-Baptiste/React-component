import "./SpecialButton.css";

export default function SpecialButton({
                                          label, //The label of the button
                                          variant = "primary", //Type of the button : compatible with primary,secondary and danger
                                          disabled = false,
                                          loading = false,
                                          icon = null,
                                          onClick, //Use this to bind an event to the button wich will be triggered onClick
                                      }) {
    const handleClick = (event) => {
        if (disabled || loading) {
            return;
        }

        onClick?.(event);
    };

    return (
        <button
            type="button"
            className={`special-button special-button--${variant}`}
            disabled={disabled || loading}
            aria-disabled={disabled || loading}
            aria-busy={loading}
            onClick={handleClick}
        >
            {loading ? (
                <span
                    className="special-button__loader"
                    aria-hidden="true"
                />
            ) : (
                icon && (
                    <span
                        className="special-button__icon"
                        aria-hidden="true"
                    >
                        {icon}
                    </span>
                )
            )}

            <span className="special-button__label">
                {loading ? "Loading..." : label}
            </span>
        </button>
    );
}