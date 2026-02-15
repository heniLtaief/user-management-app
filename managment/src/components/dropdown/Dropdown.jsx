// Dropdown.js - Fixed width inheritance
import { useState, useEffect, useRef } from "react";
import "./Dropdown.css";
import { KeyboardArrowDown, KeyboardArrowUp, Check } from "@mui/icons-material";

const Dropdown = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  error = "",
  helperText = "",
  disabled = false,
  required = false,
  className = "",
  fullWidth = false,
  size = "medium", // 'small', 'medium', 'large'
  variant = "outlined", // 'outlined', 'filled', 'ghost'
  icon: CustomIcon,
  style, // Add style prop
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const optionsRef = useRef([]);

  // Find the label for the current value
  const selectedOption = options.find((opt) => opt.value === value);
  const displayValue = selectedOption ? selectedOption.label : placeholder;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isOpen) return;

      switch (event.key) {
        case "Escape":
          setIsOpen(false);
          break;
        case "ArrowDown":
          event.preventDefault();
          setHighlightedIndex((prev) =>
            prev < options.length - 1 ? prev + 1 : prev,
          );
          break;
        case "ArrowUp":
          event.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case "Enter":
          event.preventDefault();
          if (highlightedIndex >= 0 && highlightedIndex < options.length) {
            handleSelect(options[highlightedIndex]);
          }
          break;
        default:
          break;
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, highlightedIndex, options]);

  // Scroll highlighted option into view
  useEffect(() => {
    if (highlightedIndex >= 0 && optionsRef.current[highlightedIndex]) {
      optionsRef.current[highlightedIndex].scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [highlightedIndex]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setHighlightedIndex(options.findIndex((opt) => opt.value === value));
    }
  };

  const handleSelect = (option) => {
    if (option.value !== value) {
      // Pass the name from props to the onChange event
      onChange({
        target: {
          name: props.name, // Add name here
          value: option.value,
        },
      });
    }
    setIsOpen(false);
  };

  const handleOptionMouseEnter = (index) => {
    setHighlightedIndex(index);
  };

  return (
    <div
      className={`
        dropdown-group
        ${fullWidth ? "dropdown-full-width" : ""}
        ${disabled ? "dropdown-disabled" : ""}
        ${error ? "dropdown-error" : ""}
        dropdown-size-${size}
        dropdown-variant-${variant}
        ${className}
      `.trim()}
      ref={dropdownRef}
      style={style} // Pass through style prop
      {...props}
    >
      {label && (
        <label className="dropdown-label">
          {label}
          {required && <span className="dropdown-required">*</span>}
        </label>
      )}

      <div className="dropdown-container">
        <button
          type="button"
          className={`
            dropdown-trigger
            ${isOpen ? "dropdown-open" : ""}
          `.trim()}
          onClick={handleToggle}
          disabled={disabled}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label={label || placeholder}
        >
          <div className="dropdown-trigger-content">
            {CustomIcon && (
              <span className="dropdown-trigger-icon">
                <CustomIcon />
              </span>
            )}
            <span className="dropdown-trigger-text">{displayValue}</span>
          </div>
          <span className="dropdown-trigger-arrow">
            {isOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </span>
        </button>

        {isOpen && (
          <div className="dropdown-menu">
            <div
              className="dropdown-menu-inner"
              role="listbox"
              aria-activedescendant={selectedOption?.value}
            >
              {options.map((option, index) => (
                <div
                  key={option.value}
                  ref={(el) => (optionsRef.current[index] = el)}
                  className={`
                    dropdown-option
                    ${option.value === value ? "dropdown-option-selected" : ""}
                    ${index === highlightedIndex ? "dropdown-option-highlighted" : ""}
                    ${option.disabled ? "dropdown-option-disabled" : ""}
                  `.trim()}
                  onClick={() => !option.disabled && handleSelect(option)}
                  onMouseEnter={() => handleOptionMouseEnter(index)}
                  role="option"
                  aria-selected={option.value === value}
                  aria-disabled={option.disabled}
                >
                  <span className="dropdown-option-content">
                    {option.icon && (
                      <span className="dropdown-option-icon">
                        {option.icon}
                      </span>
                    )}
                    <span className="dropdown-option-text">{option.label}</span>
                  </span>
                  {option.value === value && (
                    <span className="dropdown-option-check">
                      <Check fontSize="small" />
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {(error || helperText) && (
        <div
          className={`dropdown-message ${
            error ? "dropdown-error-message" : "dropdown-helper"
          }`}
        >
          {error || helperText}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
