import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { registerUser } from "../services/api";

const educators = {
  "1": {
    name: "Sophie Martin",
    language: "French",
    location: "Paris, France",
  },
  "2": {
    name: "Elena Garcia",
    language: "Spanish",
    location: "Madrid, Spain",
  },
  "3": {
    name: "Mei Lin",
    language: "Mandarin",
    location: "Shanghai, China",
  },
};

function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const educatorId = searchParams.get("educator");

  const [role, setRole] = useState("family");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",

    // Family fields
    language: "",
    childAge: "",
    requirements: "",

    // Educator fields
    education: "",
    experience: "",
    skills: "",
    location: "",
    about: "",
  });

  const selectedEducator = educatorId
    ? educators[educatorId]
    : null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // =========================
      // FAMILY REGISTRATION
      // =========================

      if (role === "family") {
        const email = formData.email.trim().toLowerCase();

        // Register family in backend
        await registerUser({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email,
          phone: formData.phone.trim(),
          password: formData.password,
          role: "family",
          language: formData.language,
          childAge: formData.childAge.trim(),
          requirements: formData.requirements.trim(),
        });

        // Temporary frontend account
        // We will remove this after React Login is connected.
        const family = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email,
          phone: formData.phone,
          password: formData.password,
          language: formData.language,
          childAge: formData.childAge,
          requirements: formData.requirements,
          role: "family",
          createdAt: new Date().toISOString(),
        };

        localStorage.setItem(
          "familyUser",
          JSON.stringify(family)
        );

        // =========================
        // CREATE INTEREST REQUEST
        // =========================

        if (educatorId) {
          const educator = selectedEducator || {
            name: "Educator",
            language: formData.language || "Not specified",
            location: "Not specified",
          };

          const request = {
            id:
              typeof crypto !== "undefined" &&
              crypto.randomUUID
                ? crypto.randomUUID()
                : Date.now().toString(),

            family: {
              firstName: formData.firstName,
              lastName: formData.lastName,
              email,
              phone: formData.phone,
              language: formData.language,
              childAge: formData.childAge,
              requirements: formData.requirements,
            },

            educatorId,

            educator: {
              name: educator.name,
              language: educator.language,
              location: educator.location,
            },

            status: "pending",

            createdAt: new Date().toISOString(),
          };

          const existingRequests = JSON.parse(
            localStorage.getItem("interestRequests") || "[]"
          );

          // Prevent duplicate request to same educator
          const duplicateRequest = existingRequests.find(
            (existingRequest) =>
              existingRequest.family?.email === email &&
              existingRequest.educatorId === educatorId &&
              ["pending", "accepted"].includes(
                existingRequest.status
              )
          );

          if (duplicateRequest) {
            setError(
              "You have already sent a request to this educator."
            );
            setIsSubmitting(false);
            return;
          }

          existingRequests.push(request);

          localStorage.setItem(
            "interestRequests",
            JSON.stringify(existingRequests)
          );

          // Connect family account to request
          const updatedFamily = {
            ...family,
            interestedEducatorId: educatorId,
            interestedEducatorName: educator.name,
            requestId: request.id,
            requestStatus: "pending",
          };

          localStorage.setItem(
            "familyUser",
            JSON.stringify(updatedFamily)
          );
        }

        navigate("/family-dashboard");
        return;
      }

      // =========================
      // EDUCATOR REGISTRATION
      // =========================

      const skillsArray = formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      const email = formData.email.trim().toLowerCase();

      // Register educator in backend
      await registerUser({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email,
        phone: formData.phone.trim(),
        password: formData.password,
        role: "educator",
        language: formData.language,
        education: formData.education.trim(),
        experience: formData.experience,
        skills: skillsArray,
        location: formData.location.trim(),
        about: formData.about.trim(),
      });

      // Temporary frontend account
      // We will remove this after React Login is connected.
      const educator = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email,
        phone: formData.phone,
        password: formData.password,
        language: formData.language,
        location: formData.location,
        education: formData.education,
        experience: formData.experience,
        skills: skillsArray,
        about: formData.about,
        role: "educator",
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(
        "educatorUser",
        JSON.stringify(educator)
      );

      navigate("/educator-dashboard");
    } catch (error) {
      console.error("Registration error:", error);

      setError(
        error.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">

        {/* HEADER */}

        <div className="register-header">
          <p className="eyebrow">
            CREATE YOUR ACCOUNT
          </p>

          <h1>
            Join LinguaCare
          </h1>

          <p>
            Create your account and connect with the
            right language immersion opportunity.
          </p>
        </div>

        {/* SELECTED EDUCATOR */}

        {selectedEducator && role === "family" && (
          <div className="selected-educator">
            <p className="eyebrow">
              YOU ARE INTERESTED IN
            </p>

            <h3>
              {selectedEducator.name}
            </h3>

            <p>
              {selectedEducator.language} ·{" "}
              {selectedEducator.location}
            </p>
          </div>
        )}

        {/* ROLE SWITCH */}

        <div className="role-switch">
          <button
            type="button"
            className={
              role === "family"
                ? "active"
                : ""
            }
            onClick={() =>
              handleRoleChange("family")
            }
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
            onClick={() =>
              handleRoleChange("educator")
            }
          >
            Educator
          </button>
        </div>

        {/* REGISTRATION FORM */}

        <form
          onSubmit={handleSubmit}
          className="register-form"
        >

          {/* NAME */}

          <div className="form-row">

            <div className="form-group">
              <label>
                First Name
              </label>

              <input
                type="text"
                name="firstName"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>
                Last Name
              </label>

              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

          </div>

          {/* EMAIL */}

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
              required
            />
          </div>

          {/* PASSWORD */}

          <div className="form-group">
            <label>
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              minLength="6"
              required
            />

            <small>
              Password must contain at least 6 characters.
            </small>
          </div>

          {/* PHONE */}

          <div className="form-group">
            <label>
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              placeholder="+1 234 567 890"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          {/* ========================= */}
          {/* FAMILY FORM */}
          {/* ========================= */}

          {role === "family" ? (
            <>
              <div className="form-group">
                <label>
                  Preferred Language
                </label>

                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select language
                  </option>

                  <option value="French">
                    French
                  </option>

                  <option value="Spanish">
                    Spanish
                  </option>

                  <option value="Mandarin">
                    Mandarin
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  Child's Age
                </label>

                <input
                  type="text"
                  name="childAge"
                  placeholder="Example: 6 years"
                  value={formData.childAge}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  What are you looking for?
                </label>

                <textarea
                  name="requirements"
                  placeholder="Tell us about your family's requirements..."
                  value={formData.requirements}
                  onChange={handleChange}
                  rows="5"
                  required
                />
              </div>
            </>
          ) : (
            /* ========================= */
            /* EDUCATOR FORM */
            /* ========================= */

            <>
              <div className="form-group">
                <label>
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  placeholder="Paris, France"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Language
                </label>

                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select language
                  </option>

                  <option value="French">
                    French
                  </option>

                  <option value="Spanish">
                    Spanish
                  </option>

                  <option value="Mandarin">
                    Mandarin
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  Education
                </label>

                <input
                  type="text"
                  name="education"
                  placeholder="Early Childhood Education"
                  value={formData.education}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Experience
                </label>

                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select experience
                  </option>

                  <option value="1-3 years">
                    1–3 years
                  </option>

                  <option value="3-5 years">
                    3–5 years
                  </option>

                  <option value="5+ years">
                    5+ years
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  Skills
                </label>

                <input
                  type="text"
                  name="skills"
                  placeholder="French Immersion, Childcare, Storytelling"
                  value={formData.skills}
                  onChange={handleChange}
                  required
                />

                <small>
                  Separate skills with commas.
                </small>
              </div>

              <div className="form-group">
                <label>
                  Professional Summary
                </label>

                <textarea
                  name="about"
                  placeholder="Tell families about your experience and teaching approach..."
                  value={formData.about}
                  onChange={handleChange}
                  rows="5"
                  required
                />
              </div>
            </>
          )}

          {/* ERROR */}

          {error && (
            <div className="register-error">
              {error}
            </div>
          )}

          {/* SUBMIT */}

          <button
            type="submit"
            className="register-button"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Creating Account..."
              : role === "family"
              ? educatorId
                ? "Create Account & Send Interest"
                : "Create Family Account"
              : "Create Educator Account"}
          </button>

        </form>

        {/* LOGIN */}

        <p className="register-login">
          Already have an account?{" "}

          <Link to="/login">
            Log in
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;