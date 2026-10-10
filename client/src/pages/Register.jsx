
"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

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
    language: "",
    childAge: "",
    requirements: "",
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
      const email = formData.email.trim().toLowerCase();

      if (role === "family") {
        // Register the family in the backend.
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

        const family = {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email,
          phone: formData.phone.trim(),
          language: formData.language,
          childAge: formData.childAge.trim(),
          requirements: formData.requirements.trim(),
          role: "family",
          createdAt: new Date().toISOString(),
        };

        // Do not store the password in localStorage.
        localStorage.setItem("familyUser", JSON.stringify(family));
        localStorage.removeItem("educatorUser");

        // Create a local demo interest request when an educator
        // was selected through the registration URL.
        if (educatorId) {
          const educator = selectedEducator || {
            name: "Educator",
            language: formData.language || "Not specified",
            location: "Not specified",
          };

          const existingRequests = JSON.parse(
            localStorage.getItem("interestRequests") || "[]"
          );

          const duplicateRequest = existingRequests.find(
            (request) =>
              request.family?.email === email &&
              request.educatorId === educatorId &&
              ["pending", "accepted"].includes(
                String(request.status).toLowerCase()
              )
          );

          if (duplicateRequest) {
            setError(
              "You have already sent a request to this educator."
            );
            return;
          }

          const requestId =
            typeof crypto !== "undefined" &&
            typeof crypto.randomUUID === "function"
              ? crypto.randomUUID()
              : `${Date.now()}`;

          const request = {
            id: requestId,
            family: {
              firstName: family.firstName,
              lastName: family.lastName,
              email: family.email,
              phone: family.phone,
              language: family.language,
              childAge: family.childAge,
              requirements: family.requirements,
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

          existingRequests.push(request);

          localStorage.setItem(
            "interestRequests",
            JSON.stringify(existingRequests)
          );

          const updatedFamily = {
            ...family,
            interestedEducatorId: educatorId,
            interestedEducatorName: educator.name,
            requestId,
            requestStatus: "pending",
          };

          localStorage.setItem(
            "familyUser",
            JSON.stringify(updatedFamily)
          );
        }

        router.push("/family-dashboard");
        return;
      }

      // Educator registration.
      const skillsArray = formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

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

      const educator = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email,
        phone: formData.phone.trim(),
        language: formData.language,
        location: formData.location.trim(),
        education: formData.education.trim(),
        experience: formData.experience,
        skills: skillsArray,
        about: formData.about.trim(),
        role: "educator",
        createdAt: new Date().toISOString(),
      };

      // Do not store the password in localStorage.
      localStorage.setItem("educatorUser", JSON.stringify(educator));
      localStorage.removeItem("familyUser");

      router.push("/educator-dashboard");
    } catch (error) {
      console.error("Registration error:", error);

      setError(
        error.message || "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-header">
          <p className="eyebrow">CREATE YOUR ACCOUNT</p>

          <h1>Join LinguaCare</h1>

          <p>
            Create your account and connect with the right language
            immersion opportunity.
          </p>
        </div>

        {selectedEducator && role === "family" && (
          <div className="selected-educator">
            <p className="eyebrow">YOU ARE INTERESTED IN</p>
            <h3>{selectedEducator.name}</h3>
            <p>
              {selectedEducator.language} · {selectedEducator.location}
            </p>
          </div>
        )}

        <div className="role-switch">
          <button
            type="button"
            className={role === "family" ? "active" : ""}
            onClick={() => handleRoleChange("family")}
            disabled={isSubmitting}
          >
            Family
          </button>

          <button
            type="button"
            className={role === "educator" ? "active" : ""}
            onClick={() => handleRoleChange("educator")}
            disabled={isSubmitting}
          >
            Educator
          </button>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="register-first-name">First Name</label>
              <input
                id="register-first-name"
                type="text"
                name="firstName"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange}
                autoComplete="given-name"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="register-last-name">Last Name</label>
              <input
                id="register-last-name"
                type="text"
                name="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange}
                autoComplete="family-name"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="register-email">Email Address</label>
            <input
              id="register-email"
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
            <label htmlFor="register-password">Password</label>
            <input
              id="register-password"
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              minLength={6}
              required
              disabled={isSubmitting}
            />
            <small>Password must contain at least 6 characters.</small>
          </div>

          <div className="form-group">
            <label htmlFor="register-phone">Phone Number</label>
            <input
              id="register-phone"
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              autoComplete="tel"
              required
              disabled={isSubmitting}
            />
          </div>

          {role === "family" ? (
            <>
              <div className="form-group">
                <label htmlFor="family-language">Preferred Language</label>
                <select
                  id="family-language"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                >
                  <option value="">Select language</option>
                  <option value="French">French</option>
                  <option value="Spanish">Spanish</option>
                  <option value="Mandarin">Mandarin</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="child-age">Child&apos;s Age</label>
                <input
                  id="child-age"
                  type="text"
                  name="childAge"
                  placeholder="Example: 6 years"
                  value={formData.childAge}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="family-requirements">
                  What are you looking for?
                </label>
                <textarea
                  id="family-requirements"
                  name="requirements"
                  placeholder="Tell us about your family's requirements..."
                  value={formData.requirements}
                  onChange={handleChange}
                  rows={5}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label htmlFor="educator-location">Location</label>
                <input
                  id="educator-location"
                  type="text"
                  name="location"
                  placeholder="Paris, France"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="educator-language">Language</label>
                <select
                  id="educator-language"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                >
                  <option value="">Select language</option>
                  <option value="French">French</option>
                  <option value="Spanish">Spanish</option>
                  <option value="Mandarin">Mandarin</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="educator-education">Education</label>
                <input
                  id="educator-education"
                  type="text"
                  name="education"
                  placeholder="Early Childhood Education"
                  value={formData.education}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="educator-experience">Experience</label>
                <select
                  id="educator-experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                >
                  <option value="">Select experience</option>
                  <option value="1-3 years">1–3 years</option>
                  <option value="3-5 years">3–5 years</option>
                  <option value="5+ years">5+ years</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="educator-skills">Skills</label>
                <input
                  id="educator-skills"
                  type="text"
                  name="skills"
                  placeholder="French Immersion, Childcare, Storytelling"
                  value={formData.skills}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
                <small>Separate skills with commas.</small>
              </div>

              <div className="form-group">
                <label htmlFor="educator-about">Professional Summary</label>
                <textarea
                  id="educator-about"
                  name="about"
                  placeholder="Tell families about your experience and teaching approach..."
                  value={formData.about}
                  onChange={handleChange}
                  rows={5}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </>
          )}

          {error && (
            <div className="register-error" role="alert">
              {error}
            </div>
          )}

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

        <p className="register-login">
          Already have an account?{" "}
          <Link href="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default function Register() {
  return (
    <Suspense
      fallback={
        <div className="register-page">
          <div className="register-card">Loading registration form...</div>
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}