import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { register } from "../../../services/auth/register";
import "./Register.css";

import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "../../../validation/AuthValidation";
import Button from "../../../components/button/Button";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    server: "",
  });
  const navigate = useNavigate();

  const registerMutation = useMutation({
    mutationFn: ({ email, password, username, role }) =>
      register(username, email, password, role),

    onSuccess: (data) => {
      console.log("Registration successful:", data);
      navigate("/Login");
    },

    onError: (error) => {
      console.error("Registration failed:", error);
      setErrors((prev) => ({
        ...prev,
        server: error.response?.data?.msg || "Registration failed",
      }));
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const usernameError = validateUsername(formData.username);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    setErrors({
      username: usernameError,
      email: emailError,
      password: passwordError,
      server: "",
    });

    if (usernameError || emailError || passwordError) return;
    registerMutation.mutate(formData);
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
        <div className="auth-description register">
          <h2>Welcome Back!</h2>
          <p>Enter your personal details to use all of site features</p>
          <Link to="/Login">
            <Button variant="outline">SIGN IN</Button>
          </Link>
        </div>

        <div className="auth-form-container">
          <div className="auth-form-box">
            <h2>Create your Account</h2>
            <form className="auth-form" onSubmit={handleSubmit}>
              <Input
                type="text"
                label="Username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                error={errors.username}
                disabled={registerMutation.isPending}
                required
              />

              <Input
                type="email"
                label="Email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                error={errors.email}
                disabled={registerMutation.isPending}
                required
              />

              <Input
                type="password"
                label="Password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                error={errors.password}
                disabled={registerMutation.isPending}
                required
              />

              <Dropdown
                label="Role"
                value={formData.role}
                onChange={(e) => handleInputChange("role", e.target.value)}
                options={[
                  { value: "user", label: "User" },
                  { value: "admin", label: "Admin" },
                ]}
                disabled={registerMutation.isPending}
              />

              {errors.server && (
                <div className="error-message">{errors.server}</div>
              )}

              <Button
                type="submit"
                loading={registerMutation.isPending}
                className="btn-full"
              >
                {registerMutation.isPending ? "REGISTERING..." : "REGISTER"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
