import Button from "../../components/button/Button";

const AuthForm = ({
  mode,
  formData,
  errors,
  handleInputChange,
  handleSubmit,
  isLoading,
}) => {
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

      <div>
        <input
          type="password"
          className="auth-input"
          placeholder="Your password"
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          disabled={isLoading}
        />
        {errors.password && <p className="error-text">{errors.password}</p>}
      </div>

      {mode === "register" && (
        <div>
          <select
            className="auth-select"
            value={formData.role}
            onChange={(e) => handleInputChange("role", e.target.value)}
            disabled={isLoading}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      )}

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
