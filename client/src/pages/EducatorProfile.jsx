import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  createInterestRequest,
  getEducatorById,
} from "../services/api";

function EducatorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [educator, setEducator] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [requestMessage, setRequestMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState("");
  const [requestError, setRequestError] = useState("");

  // ==========================================
  // LOAD EDUCATOR
  // ==========================================
  useEffect(() => {
    const loadEducator = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await getEducatorById(id);

        if (!response?.educator) {
          throw new Error("Educator profile not found.");
        }

        setEducator(response.educator);
      } catch (error) {
        console.error("Educator profile loading error:", error);

        setError(
          error.message || "Unable to load educator profile."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadEducator();
  }, [id]);

  // ==========================================
  // SEND INTEREST REQUEST
  // ==========================================
  const handleSendRequest = async () => {
    setRequestSuccess("");
    setRequestError("");

    const token = localStorage.getItem("authToken");

    if (!token) {
      setRequestError(
        "Please log in as a family before sending an interest request."
      );
      return;
    }

    const familyUser = JSON.parse(
      localStorage.getItem("familyUser") || "null"
    );

    if (!familyUser) {
      setRequestError(
        "Please log in with a family account to send an interest request."
      );
      return;
    }

    try {
      setIsSending(true);

      await createInterestRequest(id, requestMessage);

      setRequestSuccess(
        "Interest request sent successfully! The educator can now review your request."
      );

      setRequestMessage("");
    } catch (error) {
      console.error("Send interest request error:", error);

      setRequestError(
        error.message || "Unable to send interest request."
      );
    } finally {
      setIsSending(false);
    }
  };

  // ==========================================
  // LOADING STATE
  // ==========================================
  if (isLoading) {
    return (
      <div className="educator-profile-page">
        <div className="educator-profile-card">
          <div className="profile-empty">
            <div className="profile-loading-icon">LC</div>

            <h2>Loading educator profile...</h2>

            <p>
              We're securely loading the educator's
              professional information.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR STATE
  // ==========================================
  if (error) {
    return (
      <div className="educator-profile-page">
        <div className="educator-profile-card">
          <div className="profile-empty">
            <div className="profile-error-icon">!</div>

            <h2>Unable to load profile</h2>

            <p>{error}</p>

            <button
              type="button"
              onClick={() => navigate("/educators")}
            >
              Back to Educators
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!educator) {
    return null;
  }

  // ==========================================
  // PROFILE DATA
  // ==========================================
  const fullName =
    `${educator.firstName || ""} ${educator.lastName || ""}`.trim() ||
    "Educator";

  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const skills = Array.isArray(educator.skills)
    ? educator.skills
    : [];

  const language =
    educator.language || "Language not specified";

  const experience =
    educator.experience || "Experience not specified";

  const location =
    educator.location || "Location not specified";

  const education =
    educator.education || "Education not specified";

  const about =
    educator.about ||
    "This educator has not added a professional summary yet.";

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <div className="educator-profile-page">
      {/* BACK */}
      <Link
        to="/educators"
        className="profile-back-link"
      >
        ← Back to Educators
      </Link>

      <div className="educator-profile-card">
        {/* ======================================
            PROFILE HERO
        ====================================== */}
        <div className="profile-hero">
          <div className="profile-avatar">
            {initials}
          </div>

          <div className="profile-hero-content">
            <p className="eyebrow">
              LINGUACARE EDUCATOR
            </p>

            <h1>{fullName}</h1>

            <p className="profile-location">
              📍 {location}
            </p>

            <div className="profile-tags">
              <span>{language}</span>
              <span>{experience}</span>
            </div>
          </div>

          <div className="profile-verified">
            <span className="profile-verified-icon">
              ✓
            </span>

            <span>Verified Profile</span>
          </div>
        </div>

        {/* ======================================
            PROFILE CONTENT
        ====================================== */}
        <div className="profile-content">
          {/* ====================================
              ABOUT
          ==================================== */}
          <section>
            <p className="eyebrow">ABOUT</p>

            <h2>Professional Profile</h2>

            <p className="profile-about">
              {about}
            </p>
          </section>

          {/* ====================================
              EDUCATION & EXPERIENCE
          ==================================== */}
          <section>
            <p className="eyebrow">
              PROFESSIONAL DETAILS
            </p>

            <h2>Education & Experience</h2>

            <div className="profile-info-grid">
              <div>
                <span>Education</span>

                <strong>{education}</strong>
              </div>

              <div>
                <span>Experience</span>

                <strong>{experience}</strong>
              </div>

              <div>
                <span>Language</span>

                <strong>{language}</strong>
              </div>

              <div>
                <span>Location</span>

                <strong>{location}</strong>
              </div>
            </div>
          </section>

          {/* ====================================
              SKILLS
          ==================================== */}
          <section>
            <p className="eyebrow">SKILLS</p>

            <h2>Specializations</h2>

            {skills.length > 0 ? (
              <div className="profile-skills">
                {skills.map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="profile-about">
                No specializations have been added yet.
              </p>
            )}
          </section>

          {/* ====================================
              INTEREST REQUEST
          ==================================== */}
          <section className="profile-contact-section">
            <div className="profile-contact-content">
              <p className="eyebrow">
                FIND YOUR MATCH
              </p>

              <h2>
                Interested in working with{" "}
                {educator.firstName || "this educator"}?
              </h2>

              <p>
                Send an interest request to introduce
                your family and share what you're
                looking for.
              </p>
            </div>

            <div className="interest-request-form">
              <label htmlFor="request-message">
                Message
              </label>

              <textarea
                id="request-message"
                value={requestMessage}
                onChange={(event) =>
                  setRequestMessage(event.target.value)
                }
                placeholder="Introduce your family and briefly describe what you're looking for..."
                rows={5}
                maxLength={1000}
                disabled={isSending}
              />

              <div className="request-form-footer">
                <span>
                  {requestMessage.length}/1000
                </span>

                <button
                  type="button"
                  className="profile-primary-button"
                  onClick={handleSendRequest}
                  disabled={isSending}
                >
                  {isSending
                    ? "Sending Request..."
                    : "Send Interest Request →"}
                </button>
              </div>

              {requestSuccess && (
                <div
                  className="request-success"
                  role="status"
                >
                  ✓ {requestSuccess}
                </div>
              )}

              {requestError && (
                <div
                  className="request-error"
                  role="alert"
                >
                  {requestError}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default EducatorProfile;