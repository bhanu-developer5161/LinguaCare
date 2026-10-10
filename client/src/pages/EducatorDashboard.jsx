"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import {
  getEducatorRequests,
  getMyProfile,
  logoutUser,
  updateMyProfile,
  updateRequestStatus,
} from "../services/api";

import Conversation from "../components/Conversation";

function EducatorDashboard() {
  const router = useRouter();

  const [educator, setEducator] = useState(null);
  const [requests, setRequests] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [requestLoading, setRequestLoading] = useState(true);
  const [processingRequestId, setProcessingRequestId] = useState(null);

  const [error, setError] = useState("");
  const [requestError, setRequestError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");

  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    language: "",
    education: "",
    experience: "",
    location: "",
    about: "",
    skills: "",
  });

  // ==========================================
  // LOAD DASHBOARD
  // ==========================================
  const loadDashboard = useCallback(async () => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("authToken")
        : null;

    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      setIsLoading(true);
      setRequestLoading(true);
      setError("");
      setRequestError("");

      const profileResponse = await getMyProfile();

      if (!profileResponse?.user) {
        throw new Error("Unable to load educator profile.");
      }

      if (profileResponse.user.role !== "educator") {
        router.replace("/family-dashboard");
        return;
      }

      const user = profileResponse.user;

      setEducator(user);

      setEditForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        language: user.language || "",
        education: user.education || "",
        experience: user.experience || "",
        location: user.location || "",
        about: user.about || "",
        skills: Array.isArray(user.skills)
          ? user.skills.join(", ")
          : "",
      });

      const requestResponse = await getEducatorRequests();

      setRequests(requestResponse?.requests || []);
    } catch (error) {
      console.error("Educator dashboard loading error:", error);

      const message = error?.message || "";

      if (
        message.includes("Authentication") ||
        message.toLowerCase().includes("token") ||
        message.includes("Invalid")
      ) {
        logoutUser();
        router.replace("/login");
        return;
      }

      setError(message || "Unable to load educator dashboard.");
    } finally {
      setIsLoading(false);
      setRequestLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // ==========================================
  // AUTO-CLEAR SUCCESS MESSAGES
  // ==========================================
  useEffect(() => {
    if (!profileMessage) return;

    const timer = setTimeout(() => {
      setProfileMessage("");
    }, 4000);

    return () => clearTimeout(timer);
  }, [profileMessage]);

  useEffect(() => {
    if (!actionMessage) return;

    const timer = setTimeout(() => {
      setActionMessage("");
    }, 4000);

    return () => clearTimeout(timer);
  }, [actionMessage]);

  // ==========================================
  // RESET EDIT FORM
  // ==========================================
  const resetEditForm = (user) => {
    setEditForm({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
      language: user?.language || "",
      education: user?.education || "",
      experience: user?.experience || "",
      location: user?.location || "",
      about: user?.about || "",
      skills: Array.isArray(user?.skills)
        ? user.skills.join(", ")
        : "",
    });
  };

  // ==========================================
  // EDIT PROFILE
  // ==========================================
  const handleEditProfile = () => {
    setProfileMessage("");
    setProfileError("");
    resetEditForm(educator);
    setIsEditing(true);
  };

  // ==========================================
  // CANCEL EDIT
  // ==========================================
  const handleCancelEdit = () => {
    setProfileMessage("");
    setProfileError("");
    resetEditForm(educator);
    setIsEditing(false);
  };

  // ==========================================
  // FORM CHANGE
  // ==========================================
  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setEditForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  // ==========================================
  // SAVE PROFILE
  // ==========================================
  const handleSaveProfile = async (event) => {
    event.preventDefault();

    setProfileMessage("");
    setProfileError("");

    const firstName = editForm.firstName.trim();
    const lastName = editForm.lastName.trim();

    if (!firstName || !lastName) {
      setProfileError("First name and last name are required.");
      return;
    }

    try {
      setSavingProfile(true);

      const skills = editForm.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      const response = await updateMyProfile({
        firstName,
        lastName,
        phone: editForm.phone.trim(),
        language: editForm.language.trim(),
        education: editForm.education.trim(),
        experience: editForm.experience.trim(),
        location: editForm.location.trim(),
        about: editForm.about.trim(),
        skills,
      });

      if (!response?.user) {
        throw new Error("Unable to update educator profile.");
      }

      setEducator(response.user);
      resetEditForm(response.user);
      setIsEditing(false);
      setProfileMessage("Profile updated successfully.");
    } catch (error) {
      console.error("Educator profile update error:", error);

      const message = error?.message || "";

      if (
        message.includes("Authentication") ||
        message.toLowerCase().includes("token") ||
        message.includes("Invalid")
      ) {
        logoutUser();
        router.replace("/login");
        return;
      }

      setProfileError(message || "Unable to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  // ==========================================
  // ACCEPT / REJECT REQUEST
  // ==========================================
  const handleRequestStatus = async (requestId, status) => {
    try {
      setProcessingRequestId(requestId);
      setRequestError("");
      setActionMessage("");

      const response = await updateRequestStatus(requestId, status);

      const updatedStatus = response?.request?.status;

      if (!updatedStatus) {
        throw new Error("The server did not return the updated request status.");
      }

      setRequests((currentRequests) =>
        currentRequests.map((request) =>
          request._id === requestId
            ? { ...request, status: updatedStatus }
            : request
        )
      );

      setActionMessage(
        updatedStatus === "accepted"
          ? "Family request accepted successfully."
          : "Family request rejected successfully."
      );
    } catch (error) {
      console.error("Update request status error:", error);

      setRequestError(
        error?.message || "Unable to update request status."
      );
    } finally {
      setProcessingRequestId(null);
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================
  const handleLogout = () => {
    logoutUser();
    router.replace("/login");
  };

  // ==========================================
  // LOADING
  // ==========================================
  if (isLoading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-container">
          <div className="dashboard-empty">
            <h2>Loading your dashboard...</h2>
            <p>
              We&apos;re securely loading your educator profile and
              family requests.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================
  if (error) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-container">
          <div className="dashboard-empty">
            <h2>Unable to load dashboard</h2>
            <p>{error}</p>

            <button
              type="button"
              onClick={loadDashboard}
              className="dashboard-button"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!educator) {
    return null;
  }

  const fullName =
    `${educator.firstName || ""} ${educator.lastName || ""}`.trim() ||
    "Educator";

  const skills = Array.isArray(educator.skills) ? educator.skills : [];

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* HEADER */}
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">EDUCATOR DASHBOARD</p>
            <h1>Welcome, {educator.firstName}</h1>
            <p>Manage your profile and family requests.</p>
          </div>

          <button
            type="button"
            className="dashboard-logout-button"
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>

        {/* PROFILE */}
        <section className="dashboard-section">
          <div className="dashboard-section-header">
            <div>
              <p className="eyebrow">YOUR PROFILE</p>
              <h2>{fullName}</h2>
            </div>

            {!isEditing && (
              <button
                type="button"
                className="dashboard-button"
                onClick={handleEditProfile}
              >
                Edit Profile
              </button>
            )}
          </div>

          {profileMessage && (
            <div className="profile-success-message" role="status">
              {profileMessage}
            </div>
          )}

          {profileError && (
            <div className="profile-error-message" role="alert">
              {profileError}
            </div>
          )}

          {isEditing ? (
            <div className="dashboard-profile-card">
              <form
                onSubmit={handleSaveProfile}
                className="profile-edit-form"
              >
                <div className="profile-edit-grid">
                  <div className="profile-form-group">
                    <label htmlFor="educator-firstName">First Name</label>
                    <input
                      id="educator-firstName"
                      name="firstName"
                      type="text"
                      value={editForm.firstName}
                      onChange={handleFormChange}
                      placeholder="Enter first name"
                      required
                    />
                  </div>

                  <div className="profile-form-group">
                    <label htmlFor="educator-lastName">Last Name</label>
                    <input
                      id="educator-lastName"
                      name="lastName"
                      type="text"
                      value={editForm.lastName}
                      onChange={handleFormChange}
                      placeholder="Enter last name"
                      required
                    />
                  </div>

                  <div className="profile-form-group">
                    <label htmlFor="educator-phone">Phone</label>
                    <input
                      id="educator-phone"
                      name="phone"
                      type="tel"
                      value={editForm.phone}
                      onChange={handleFormChange}
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div className="profile-form-group">
                    <label htmlFor="educator-language">
                      Teaching Language
                    </label>
                    <select
                      id="educator-language"
                      name="language"
                      value={editForm.language}
                      onChange={handleFormChange}
                    >
                      <option value="">Select language</option>
                      <option value="English">English</option>
                      <option value="French">French</option>
                      <option value="Spanish">Spanish</option>
                      <option value="Mandarin">Mandarin</option>
                      <option value="German">German</option>
                      <option value="Italian">Italian</option>
                      <option value="Japanese">Japanese</option>
                    </select>
                  </div>

                  <div className="profile-form-group">
                    <label htmlFor="educator-education">Education</label>
                    <input
                      id="educator-education"
                      name="education"
                      type="text"
                      value={editForm.education}
                      onChange={handleFormChange}
                      placeholder="Example: Bachelor's in Education"
                    />
                  </div>

                  <div className="profile-form-group">
                    <label htmlFor="educator-experience">Experience</label>
                    <input
                      id="educator-experience"
                      name="experience"
                      type="text"
                      value={editForm.experience}
                      onChange={handleFormChange}
                      placeholder="Example: 3-5 years"
                    />
                  </div>

                  <div className="profile-form-group">
                    <label htmlFor="educator-location">Location</label>
                    <input
                      id="educator-location"
                      name="location"
                      type="text"
                      value={editForm.location}
                      onChange={handleFormChange}
                      placeholder="Example: Paris, France"
                    />
                  </div>

                  <div className="profile-form-group">
                    <label htmlFor="educator-skills">Skills</label>
                    <input
                      id="educator-skills"
                      name="skills"
                      type="text"
                      value={editForm.skills}
                      onChange={handleFormChange}
                      placeholder="Example: French, Childcare, Music"
                    />
                    <span className="profile-field-hint">
                      Separate multiple skills with commas.
                    </span>
                  </div>

                  <div className="profile-form-group profile-form-full">
                    <label htmlFor="educator-about">
                      Professional Summary
                    </label>
                    <textarea
                      id="educator-about"
                      name="about"
                      value={editForm.about}
                      onChange={handleFormChange}
                      placeholder="Tell families about your teaching experience and approach..."
                      rows={6}
                      maxLength={1500}
                    />
                    <span className="profile-character-count">
                      {editForm.about.length}/1500
                    </span>
                  </div>
                </div>

                <div className="profile-edit-actions">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="dashboard-button"
                    disabled={savingProfile}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="dashboard-button profile-save-button"
                    disabled={savingProfile}
                  >
                    {savingProfile ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="dashboard-profile-card">
              <div className="dashboard-profile-details">
                <div>
                  <span>Email</span>
                  <strong>{educator.email}</strong>
                </div>
                <div>
                  <span>Phone</span>
                  <strong>{educator.phone || "Not specified"}</strong>
                </div>
                <div>
                  <span>Language</span>
                  <strong>{educator.language || "Not specified"}</strong>
                </div>
                <div>
                  <span>Location</span>
                  <strong>{educator.location || "Not specified"}</strong>
                </div>
                <div>
                  <span>Experience</span>
                  <strong>{educator.experience || "Not specified"}</strong>
                </div>
                <div>
                  <span>Education</span>
                  <strong>{educator.education || "Not specified"}</strong>
                </div>
              </div>

              <Link
                href={`/educators/${educator._id}`}
                className="dashboard-profile-link"
              >
                View Public Profile
              </Link>
            </div>
          )}
        </section>

        {/* FAMILY REQUESTS */}
        <section className="dashboard-section">
          <div className="dashboard-section-header">
            <div>
              <p className="eyebrow">FAMILY REQUESTS</p>
              <h2>Interest Requests</h2>
            </div>

            <div className="request-count">{requests.length}</div>
          </div>

          {requestLoading ? (
            <div className="dashboard-empty">
              <h3>Loading requests...</h3>
              <p>Checking for new family interest requests.</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="dashboard-empty">
              <h3>No family requests yet</h3>
              <p>
                When a family expresses interest in your profile, their
                request will appear here.
              </p>
            </div>
          ) : (
            <>
              {actionMessage && (
                <div className="request-success" role="status">
                  {actionMessage}
                </div>
              )}

              {requestError && (
                <div className="request-error" role="alert">
                  {requestError}
                </div>
              )}

              <div className="interest-request-list">
                {requests.map((request) => {
                  const family = request.family || {};

                  const familyName =
                    `${family.firstName || ""} ${family.lastName || ""}`.trim() ||
                    "Family";

                  const isProcessing =
                    processingRequestId === request._id;

                  return (
                    <div
                      className="interest-request-card"
                      key={request._id}
                    >
                      <div className="interest-request-header">
                        <div>
                          <p className="eyebrow">FAMILY INTEREST</p>
                          <h3>{familyName}</h3>
                        </div>

                        <span
                          className={`request-status ${request.status}`}
                        >
                          {request.status}
                        </span>
                      </div>

                      <div className="interest-request-details">
                        <div>
                          <span>Email</span>
                          <strong>{family.email || "Not provided"}</strong>
                        </div>
                        <div>
                          <span>Phone</span>
                          <strong>{family.phone || "Not provided"}</strong>
                        </div>
                        <div>
                          <span>Language</span>
                          <strong>{family.language || "Not specified"}</strong>
                        </div>
                        <div>
                          <span>Child&apos;s Age</span>
                          <strong>{family.childAge || "Not specified"}</strong>
                        </div>
                      </div>

                      {family.requirements && (
                        <div className="request-information">
                          <span>Family Requirements</span>
                          <p>{family.requirements}</p>
                        </div>
                      )}

                      {request.message && (
                        <div className="request-information">
                          <span>Message from Family</span>
                          <p>{request.message}</p>
                        </div>
                      )}

                      <div className="request-date">
                        Request received:{" "}
                        {request.createdAt
                          ? new Date(request.createdAt).toLocaleString()
                          : "Recently"}
                      </div>

                      {request.status === "pending" && (
                        <div className="request-actions">
                          <button
                            type="button"
                            className="request-accept-button"
                            disabled={isProcessing}
                            onClick={() =>
                              handleRequestStatus(request._id, "accepted")
                            }
                          >
                            {isProcessing ? "Updating..." : "Accept"}
                          </button>

                          <button
                            type="button"
                            className="request-reject-button"
                            disabled={isProcessing}
                            onClick={() =>
                              handleRequestStatus(request._id, "rejected")
                            }
                          >
                            {isProcessing ? "Updating..." : "Reject"}
                          </button>
                        </div>
                      )}

                      {request.status === "accepted" && (
                        <>
                          <div className="request-decision-message">
                            ✓ You accepted this family request.
                          </div>

                          {educator?._id && (
                            <Conversation
                              requestId={request._id}
                              currentUserId={educator._id}
                            />
                          )}
                        </>
                      )}

                      {request.status === "rejected" && (
                        <div className="request-decision-message">
                          This family request was rejected.
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </section>

        {/* ABOUT */}
        <section className="dashboard-section">
          <div className="dashboard-section-header">
            <div>
              <p className="eyebrow">ABOUT YOU</p>
              <h2>Professional Summary</h2>
            </div>
          </div>

          <div className="dashboard-content-card">
            <p>
              {educator.about ||
                "You have not added a professional summary yet."}
            </p>
          </div>
        </section>

        {/* SKILLS */}
        <section className="dashboard-section">
          <div className="dashboard-section-header">
            <div>
              <p className="eyebrow">SKILLS &amp; EXPERTISE</p>
              <h2>Professional Skills</h2>
            </div>
          </div>

          <div className="dashboard-content-card">
            {skills.length > 0 ? (
              <div className="dashboard-skills">
                {skills.map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="dashboard-skill"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p>No skills have been added yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default EducatorDashboard;

