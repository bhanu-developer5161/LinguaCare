
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser } from "../services/api";

export default function Login() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const response = await loginUser({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      const user = response?.user;
      const token = response?.token;

      if (!user || !token) {
        throw new Error(
          "Login succeeded, but authentication data was not received."
        );
      }

      if (user.role !== "family" && user.role !== "educator") {
        localStorage.removeItem("authToken");
        localStorage.removeItem("familyUser");
        localStorage.removeItem("educatorUser");

        setError("Invalid account role.");
        return;
      }

      // Store the authentication token.
      localStorage.setItem("authToken", token);

      // Save the authenticated user's information.
      if (user.role === "family") {
        localStorage.setItem("familyUser", JSON.stringify(user));
        localStorage.removeItem("educatorUser");

        router.push("/family-dashboard");
        return;
      }

      if (user.role === "educator") {
        localStorage.setItem("educatorUser", JSON.stringify(user));
        localStorage.removeItem("familyUser");

        router.push("/educator-dashboard");
        return;
      }
    } catch (error) {
      console.error("Login error:", error);

      setError(
        error.message ||
          "Login failed. Please check your email and password."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <p className="eyebrow">WELCOME BACK</p>

          <h1>Log in to LinguaCare</h1>

          <p>
            Access your LinguaCare account and continue your journey.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="login-email">Email Address</label>

            <input
              id="login-email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>

            <input
              id="login-password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
              disabled={isSubmitting}
            />
          </div>

          {error && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="login-register">
          Don&apos;t have an account?{" "}
          <Link href="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}