import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("family");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();
    const enteredPassword = password.trim();

    console.log("LOGIN DEBUG:", {
      role,
      enteredEmail: normalizedEmail,
      passwordEntered: enteredPassword.length > 0,
    });

    // =========================
    // FAMILY LOGIN
    // =========================
    if (role === "family") {
      const family = JSON.parse(
        localStorage.getItem("familyUser") || "null"
      );

      console.log("Family account found:", !!family);

      if (!family) {
        setError(
          "No family account found. Please register first."
        );
        return;
      }

      if (
        !family.email ||
        family.email.trim().toLowerCase() !== normalizedEmail
      ) {
        setError(
          "No family account found with this email."
        );
        return;
      }

      if (family.password !== enteredPassword) {
        setError("Incorrect password.");
        return;
      }

      console.log("Family login successful.");

      navigate("/family-dashboard");
      return;
    }

    // =========================
    // EDUCATOR LOGIN
    // =========================
    const educator = JSON.parse(
      localStorage.getItem("educatorUser") || "null"
    );

    console.log("Educator account found:", !!educator);

    if (!educator) {
      setError(
        "No educator account found. Please register first."
      );
      return;
    }

    console.log("Stored educator email:", educator.email);
    console.log(
      "Entered email matches:",
      educator.email?.trim().toLowerCase() === normalizedEmail
    );
    console.log(
      "Entered password length:",
      enteredPassword.length
    );
    console.log(
      "Stored password length:",
      educator.password?.length
    );

    if (
      !educator.email ||
      educator.email.trim().toLowerCase() !== normalizedEmail
    ) {
      setError(
        "No educator account found with this email."
      );
      return;
    }

    if (educator.password !== enteredPassword) {
      setError("Incorrect password.");
      return;
    }

    console.log("Educator login successful.");

    navigate("/educator-dashboard");
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* Header */}
        <div className="login-header">
          <p className="eyebrow">
            WELCOME BACK
          </p>

          <h1>
            Log in to LinguaCare
          </h1>

          <p>
            Access your family or educator account.
          </p>
        </div>

        {/* Role Switch */}
        <div className="role-switch">

          <button
            type="button"
            className={
              role === "family"
                ? "active"
                : ""
            }
            onClick={() => {
              setRole("family");
              setError("");
            }}
          >
            Family
          </button>

          <button
            type="button"
            className={
              role === "educator"
                ? "active"
                : ""
            }
            onClick={() => {
              setRole("educator");
              setError("");
            }}
          >
            Educator
          </button>

        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="login-form"
        >

          {/* Email */}
          <div className="form-group">
            <label htmlFor="login-email">
              Email Address
            </label>

            <input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="login-password">
              Password
            </label>

            <input
              id="login-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />
          </div>

          {/* Error */}
          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="login-button"
          >
            Log In
          </button>

        </form>

        {/* Register */}
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