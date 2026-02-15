import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import "./Login.css";
import { login } from "../../../services/auth/login";
import {
  validateEmail,
  validatePassword,
} from "../../../validation/AuthValidation";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    server: "",
  });
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: ({ email, password }) => login(email, password),
    onSuccess: (data) => {
      if (data.role === "admin") {
        navigate("/dashboard-stats");
      } else {
        navigate("/user-dashboard");
      }
    },
    onError: (error) => {
      console.error("Login failed:", error);
      setErrors((prev) => ({
        ...prev,
        server: error.response?.data?.msg || "Login failed",
      }));
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    setErrors({ email: emailError, password: passwordError, server: "" });
    if (emailError || passwordError) return;
    loginMutation.mutate(formData);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="auth-container page-animate">
      <div className="auth-wrapper">
        <div className="auth-description login">
          <h2>Hello Friend!</h2>
          <p>Register Now to discover all of site features</p>
          <Link to="/Register">
            <Button variant="outline">REGISTER</Button>
          </Link>
        </div>

        <div className="auth-form-container">
          <div className="auth-form-box">
            <h2>Sign In</h2>
            <form className="auth-form" onSubmit={handleSubmit}>
              <Input
                type="email"
                label="Email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                error={errors.email}
                disabled={loginMutation.isPending}
                required
              />

              <Input
                type="password"
                label="Password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                error={errors.password}
                disabled={loginMutation.isPending}
                required
              />

              {errors.server && (
                <div className="error-message">{errors.server}</div>
              )}

              <Button
                type="submit"
                loading={loginMutation.isPending}
                className="btn-full"
              >
                {loginMutation.isPending ? "SIGNING IN..." : "SIGN IN"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
