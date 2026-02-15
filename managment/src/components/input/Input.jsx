import React from "react";
import "./Input.css";

const Input = ({
  type = "text",
  label,
  placeholder,
  value,
  onChange,
  error,
  helperText,
  disabled = false,
  required = false,
  icon,
  className = "",
  ...props
}) => {
  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}

      <div className="input-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          type={type}
          className={`
            input
            ${error ? "input-error" : ""}
            ${icon ? "input-with-icon" : ""}
            ${disabled ? "input-disabled" : ""}
          `.trim()}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          {...props}
        />
      </div>

      {(error || helperText) && (
        <div
          className={`input-message ${error ? "input-error-message" : "input-helper"}`}
        >
          {error || helperText}
        </div>
      )}
    </div>
  );
};

export default Input;
