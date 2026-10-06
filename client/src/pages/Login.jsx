import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

function Login() {
  const navigate = useNavigate();

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

      const user = response.user;
      const token = response.token;

      // Make sure the backend returned both user and JWT.
      if (!user || !token) {
        throw new Error(
          "Login succeeded, but authentication data was not received."
        );
      }

      // Store JWT separately from user information.
      localStorage.setItem("authToken", token);

      // Store only safe user information.
      // The backend removes the password before sending this response.
      if (user.role === "family") {
        localStorage.setItem(
          "familyUser",
          JSON.stringify(user)
        );

        navigate("/family-dashboard");
        return;
      }

      if (user.role === "educator") {
        localStorage.setItem(
          "educatorUser",
          JSON.stringify(user)
        );

        navigate("/educator-dashboard");
        return;
      }

      // Unknown role
      localStorage.removeItem("authToken");

      setError("Invalid account role.");
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
          <p className="eyebrow">
            WELCOME BACK
          </p>

          <h1>
            Log in to LinguaCare
          </h1>

          <p>
            Access your LinguaCare account and
            continue your journey.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="login-form"
        >
          <div className="form-group">
            <label>
              Email Address
            </label>

            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label>
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Logging in..."
              : "Log In"}
          </button>
        </form>

        <p className="login-register">
          Don't have an account?{" "}

          <Link to="/register">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;