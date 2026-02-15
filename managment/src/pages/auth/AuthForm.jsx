import React, { useState } from "react";
import Button from "../../components/button/Button";

const AuthForm = ({
  mode,
  formData,
  errors,
  handleInputChange,
  handleSubmit,
  isLoading,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {mode === "register" && (
        <div>
          <input
            type="text"
            className="auth-input"
            placeholder="Your name"
            value={formData.username}
            onChange={(e) => handleInputChange("username", e.target.value)}
            disabled={isLoading}
          />
          {errors.username && <p className="error-text">{errors.username}</p>}
        </div>
      )}

      <div>
        <input
          type="email"
          className="auth-input"
          placeholder="Your email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          disabled={isLoading}
        />
        {errors.email && <p className="error-text">{errors.email}</p>}
      </div>

      {/* Single Password Field with Eye Icon */}
      <div className="password-field-wrapper">
        <div className="password-input-container">
          <input
            type={showPassword ? "text" : "password"}
            className="auth-input password-input"
            placeholder="Your password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            disabled={isLoading}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={togglePasswordVisibility}
            tabIndex="-1"
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
        {errors.password && <p className="error-text">{errors.password}</p>}
      </div>

      {errors.server && <div className="error-message">{errors.server}</div>}

      <Button type="submit" loading={isLoading}>
        {isLoading
          ? mode === "login"
            ? "SIGNING IN..."
            : "REGISTERING..."
          : mode === "login"
            ? "SIGN IN"
            : "REGISTER"}
      </Button>
    </form>
  );
};

export default AuthForm;
