// src/auth/hooks/useAuthForm.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { login } from "../services/auth/login";
import { register } from "../services/auth/register";
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "../validation/AuthValidation";

export const useAuthForm = (mode) => {
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

  // Reset form when mode changes
  useEffect(() => {
    setFormData({
      username: "",
      email: "",
      password: "",
      role: "user",
    });
    setErrors({
      username: "",
      email: "",
      password: "",
      server: "",
    });
  }, [mode]);

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
      setErrors((prev) => ({
        ...prev,
        server:
          error.response?.data?.msg ||
          "Login failed. Please check your credentials.",
      }));
    },
  });

  const registerMutation = useMutation({
    mutationFn: ({ email, password, username, role }) =>
      register(username, email, password, role),
    onSuccess: () => {
      navigate("/login");
    },
    onError: (error) => {
      setErrors((prev) => ({
        ...prev,
        server: error.response?.data?.msg || "Registration failed",
      }));
    },
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (mode === "register") {
      const usernameError = validateUsername(formData.username);
      if (usernameError) newErrors.username = usernameError;
    }

    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (mode === "login") {
      loginMutation.mutate({
        email: formData.email,
        password: formData.password,
      });
    } else {
      registerMutation.mutate(formData);
    }
  };

  return {
    formData,
    errors,
    handleInputChange,
    handleSubmit,
    isLoading:
      mode === "login" ? loginMutation.isPending : registerMutation.isPending,
    serverError:
      mode === "login" ? loginMutation.error : registerMutation.error,
    mutation: mode === "login" ? loginMutation : registerMutation,
  };
};
