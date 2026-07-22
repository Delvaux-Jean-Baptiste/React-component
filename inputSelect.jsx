import { useState, useRef, useEffect, useId, forwardRef } from "react";
import "./inputSelect.css";

/**
 * Select
 *
 * Props:
 *  - options: Array<{ label: string, value: string } | string>
 *  - value: string | null                controlled selected value
 *  - defaultValue: string | null          uncontrolled initial value
 *  - onChange: (value: string | null) => void
 *  - name: string                         for native form submission (renders a hidden input)
 *  - label: string                        optional field label
 *  - placeholder: string                  shown when nothing is selected
 *  - searchable: boolean                  show a search box in the dropdown (default true)
 *  - clearable: boolean                   allow clearing back to an empty value (default true)
 *  - disabled: boolean
 *  - required: boolean
 *  - error: string                        error message; also drives error styling
 *  - id: string
 */
const Select = forwardRef(function Select(
  {
    options = [],
    value,
    defaultValue = null,
    onChange,
    name,
    label,
    placeholder = "Select an option",
    searchable = true,
    clearable = true,
    disabled = false,
    required = false,
    error,
    id,
  },
  ref
) {
  const normalized = options.map((opt) =>
    typeof opt === "string" ? { label: opt, value: opt } : opt
  );

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = isControlled ? value : internalValue;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef(null);
  const searchInputRef = useRef(null);
  const generatedId = useId();
  const fieldId = id || generatedId;
  const errorId = `${fieldId}-error`;

  const filtered = searchable
    ? normalized.filter((opt) =>
        opt.label.toLowerCase().includes(query.trim().toLowerCase())
      )
    : normalized;

  const selectedOption = normalized.find((opt) => opt.value === currentValue) || null;

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && searchable) {
      // focus after the dropdown mounts
      requestAnimationFrame(() => searchInputRef.current?.focus());
      setActiveIndex(-1);
    }
  }, [open, searchable]);

  const commitValue = (newValue) => {
    if (!isControlled) setInternalValue(newValue);
    onChange?.(newValue);
  };

  const handleSelect = (opt) => {
    commitValue(opt.value);
    setOpen(false);
    setQuery("");
  };

  const handleClear = (e) => {
    e.stopPropagation();
    commitValue(null);
    setQuery("");
  };

  const toggleOpen = () => {
    if (disabled) return;
    setOpen((o) => !o);
  };

  const handleKeyDown = (e) => {
    if (disabled) return;
    if (!open && (e.key === "Enter" || e.key === " " || e.key === "ArrowDown")) {
      e.preventDefault();
      setOpen(true);
      return;
    }
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && filtered[activeIndex]) {
        handleSelect(filtered[activeIndex]);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      setQuery("");
    }
  };

  return (
    <div className="sel-wrapper" ref={containerRef}>
      {label && (
        <label htmlFor={fieldId} className="sel-label">
          {label}
          {required && <span className="sel-required">*</span>}
        </label>
      )}

      {/* Hidden input keeps native <form> submission / FormData working */}
      {name && <input type="hidden" name={name} value={currentValue ?? ""} ref={ref} />}

      <div className="sel-container">
        <button
          type="button"
          id={fieldId}
          disabled={disabled}
          onClick={toggleOpen}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`sel-trigger ${disabled ? "sel-trigger--disabled" : ""} ${
            error && !disabled ? "sel-trigger--error" : ""
          }`}
        >
          <span className={`sel-value ${!selectedOption ? "sel-value--placeholder" : ""}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span className="sel-actions">
            {clearable && selectedOption && !disabled && (
              <span onClick={handleClear} role="button" aria-label="Clear selection" className="sel-clear">
                ×
              </span>
            )}
            <span className={`sel-caret ${open ? "sel-caret--open" : ""}`}>▼</span>
          </span>
        </button>

        {open && !disabled && (
          <div className="sel-dropdown">
            {searchable && (
              <div className="sel-search">
                <span className="sel-search-icon">⌕</span>
                <input
                  ref={searchInputRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActiveIndex(0);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Search..."
                  className="sel-search-input"
                />
              </div>
            )}

            <ul role="listbox" className="sel-list">
              {filtered.length === 0 ? (
                <li className="sel-no-results">No results found</li>
              ) : (
                filtered.map((opt, index) => {
                  const isSelected = opt.value === currentValue;
                  const isActive = index === activeIndex;
                  return (
                    <li
                      key={opt.value}
                      role="option"
                      aria-selected={isSelected}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => handleSelect(opt)}
                      className={`sel-option ${isActive ? "sel-option--active" : ""} ${
                        isSelected ? "sel-option--selected" : ""
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && <span className="sel-check">✓</span>}
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        )}
      </div>

      {error && (
        <p id={errorId} className="sel-error">
          <span>⚠</span>
          {error}
        </p>
      )}
    </div>
  );
});

export default Select;
