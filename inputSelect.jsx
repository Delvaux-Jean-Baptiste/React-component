import { useState, useRef, useEffect, useId, forwardRef } from "react";
 
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
    <div className="w-full" ref={containerRef}>
      {label && (
        <label
          htmlFor={fieldId}
          className="block text-sm font-medium text-slate-700 mb-1.5"
        >
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
 
      {/* Hidden input keeps native <form> submission / FormData working */}
      {name && <input type="hidden" name={name} value={currentValue ?? ""} ref={ref} />}
 
      <div className="relative">
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
          className={`w-full flex items-center justify-between gap-2 rounded-lg border px-3.5 py-2.5 text-sm text-left transition-colors
            ${disabled ? "bg-slate-50 text-slate-400 cursor-not-allowed border-slate-200" : "bg-white cursor-pointer"}
            ${!disabled && error ? "border-red-400 focus:outline-none focus:ring-2 focus:ring-red-200" : ""}
            ${!disabled && !error ? "border-slate-300 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400" : ""}
          `}
        >
          <span className={selectedOption ? "text-slate-800" : "text-slate-400"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span className="flex items-center gap-1 shrink-0">
            {clearable && selectedOption && !disabled && (
              <span
                onClick={handleClear}
                role="button"
                aria-label="Clear selection"
                className="w-4 h-4 flex items-center justify-center rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 leading-none text-sm"
              >
                ×
              </span>
            )}
            <span
              className={`text-slate-400 text-[10px] leading-none transition-transform inline-block ${open ? "rotate-180" : ""}`}
            >
              ▼
            </span>
          </span>
        </button>
 
        {open && !disabled && (
          <div className="absolute z-20 mt-1.5 w-full rounded-lg border border-slate-200 bg-white shadow-lg overflow-hidden">
            {searchable && (
              <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-100">
                <span className="text-slate-400 shrink-0 text-sm leading-none">⌕</span>
                <input
                  ref={searchInputRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActiveIndex(0);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Search..."
                  className="w-full text-sm outline-none placeholder:text-slate-400"
                />
              </div>
            )}
 
            <ul role="listbox" className="max-h-56 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <li className="px-3.5 py-2.5 text-sm text-slate-400 text-center">
                  No results found
                </li>
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
                      className={`flex items-center justify-between gap-2 px-3.5 py-2 text-sm cursor-pointer
                        ${isActive ? "bg-blue-50" : ""}
                        ${isSelected ? "text-blue-700 font-medium" : "text-slate-700"}
                      `}
                    >
                      <span>{opt.label}</span>
                      {isSelected && (
                        <span className="text-blue-600 shrink-0 text-xs leading-none">✓</span>
                      )}
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        )}
      </div>
 
      {error && (
        <p id={errorId} className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
          <span className="leading-none">⚠</span>
          {error}
        </p>
      )}
    </div>
  );
});
 
export default Select;
