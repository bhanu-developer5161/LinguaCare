
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getMyProfile,
  getFamilyRequests,
  logoutUser,
  updateMyProfile,
} from "../services/api";
import Conversation from "../components/Conversation";

const INITIAL_EDIT_FORM = {
  firstName: "",
  lastName: "",
  phone: "",
  language: "",
  childAge: "",
  requirements: "",
};

function getStatusClass(status) {
  switch (String(status || "").toLowerCase()) {
    case "accepted":
      return "status-accepted";
    case "rejected":
    case "declined":
      return "status-rejected";
    default:
      return "status-pending";
  }
}

function getStatusMessage(status) {
  switch (String(status || "").toLowerCase()) {
    case "accepted":
      return "✓ The educator accepted your request.";
    case "rejected":
    case "declined":
      return "The educator rejected this request.";
    default:
      return "Waiting for the educator to respond.";
  }
}

function getEditForm(user) {
  return {
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    language: user?.language || "",
    childAge: user?.childAge || "",
    requirements: user?.requirements || "",
  };
}

function isAuthenticationError(error) {
  const message = String(error?.message || "").toLowerCase();

  return (
    message.includes("authentication") ||
    message.includes("token") ||
    message.includes("unauthorized") ||
    message.includes("invalid")
  );
}

export default function FamilyDashboard() {
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestsError, setRequestsError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [editForm, setEditForm] = useState(INITIAL_EDIT_FORM);

  const loadFamilyDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    setRequestsError("");
    setRequestsLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      const familyUser = localStorage.getItem("familyUser");

      if (!token || !familyUser) {
        router.replace("/login");
        return;
      }

      let storedUser;

      try {
        storedUser = JSON.parse(familyUser);
      } catch {
        logoutUser();
        router.replace("/login");
        return;
      }

      if (storedUser?.role !== "family") {
        logoutUser();
        router.replace("/login");
        return;
      }

      const profileData = await getMyProfile();

      if (!profileData?.user) {
        throw new Error("Unable to load family profile.");
      }

      if (profileData.user.role !== "family") {
        logoutUser();
        router.replace("/login");
        return;
      }

      setProfile(profileData.user);
      setEditForm(getEditForm(profileData.user));

      try {
        const requestData = await getFamilyRequests();
        setRequests(
          Array.isArray(requestData?.requests)
            ? requestData.requests
            : []
        );
      } catch (requestError) {
        console.error(
          "Family requests loading error:",
          requestError
        );

        setRequestsError(
          requestError?.message ||
            "Unable to load interest requests."
        );
      } finally {
        setRequestsLoading(false);
      }
    } catch (loadError) {
      console.error("Family dashboard loading error:", loadError);

      if (isAuthenticationError(loadError)) {
        logoutUser();
        router.replace("/login");
        return;
      }

      setError(
        loadError?.message || "Unable to load family dashboard."
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadFamilyDashboard();
  }, [loadFamilyDashboard]);

  const handleLogout = () => {
    logoutUser();
    router.replace("/login");
  };

  const handleEditProfile = () => {
    setProfileMessage("");
    setProfileError("");
    setEditForm(getEditForm(profile));
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setProfileMessage("");
    setProfileError("");
    setEditForm(getEditForm(profile));
    setIsEditing(false);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setEditForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

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

      const response = await updateMyProfile({
        firstName,
        lastName,
        phone: editForm.phone.trim(),
        language: editForm.language.trim(),
        childAge: editForm.childAge.trim(),
        requirements: editForm.requirements.trim(),
      });

      if (!response?.user) {
        throw new Error("Unable to update family profile.");
      }

      setProfile(response.user);
      setEditForm(getEditForm(response.user));
      setIsEditing(false);
      setProfileMessage("Profile updated successfully.");

      localStorage.setItem(
        "familyUser",
        JSON.stringify(response.user)
      );
    } catch (saveError) {
      console.error("Family profile update error:", saveError);

      if (isAuthenticationError(saveError)) {
        logoutUser();
        router.replace("/login");
        return;
      }

      setProfileError(
        saveError?.message || "Unable to update profile."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-section">
          <h2>Loading Family Dashboard...</h2>
          <p>Please wait while we load your profile.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-section">
          <h2>Unable to load dashboard</h2>
          <p role="alert">{error}</p>

          <button
            type="button"
            onClick={loadFamilyDashboard}
            className="dashboard-button"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-section">
        <div className="dashboard-header">
          <div>
            <h1>Welcome, {profile?.firstName || "Family"}</h1>
            <p>
              Manage your family profile and educator requests.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="dashboard-button"
          >
            Log out
          </button>
        </div>

        {/* Family profile */}
        <div className="dashboard-profile-card">
          <div className="dashboard-header">
            <h2>YOUR PROFILE</h2>

            {!isEditing && (
              <button
                type="button"
                onClick={handleEditProfile}
                className="dashboard-button"
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
            <form
              onSubmit={handleSaveProfile}
              className="profile-edit-form"
            >
              <div className="profile-edit-grid">
                <div className="profile-form-group">
                  <label htmlFor="family-firstName">
                    First Name
                  </label>
                  <input
                    id="family-firstName"
                    name="firstName"
                    type="text"
                    value={editForm.firstName}
                    onChange={handleFormChange}
                    placeholder="Enter first name"
                    autoComplete="given-name"
                    required
                    disabled={savingProfile}
                  />
                </div>

                <div className="profile-form-group">
                  <label htmlFor="family-lastName">
                    Last Name
                  </label>
                  <input
                    id="family-lastName"
                    name="lastName"
                    type="text"
                    value={editForm.lastName}
                    onChange={handleFormChange}
                    placeholder="Enter last name"
                    autoComplete="family-name"
                    required
                    disabled={savingProfile}
                  />
                </div>

                <div className="profile-form-group">
                  <label htmlFor="family-phone">Phone</label>
                  <input
                    id="family-phone"
                    name="phone"
                    type="tel"
                    value={editForm.phone}
                    onChange={handleFormChange}
                    placeholder="Enter phone number"
                    autoComplete="tel"
                    disabled={savingProfile}
                  />
                </div>

                <div className="profile-form-group">
                  <label htmlFor="family-language">
                    Preferred Language
                  </label>
                  <select
                    id="family-language"
                    name="language"
                    value={editForm.language}
                    onChange={handleFormChange}
                    disabled={savingProfile}
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
                  <label htmlFor="family-childAge">
                    Child&apos;s Age
                  </label>
                  <input
                    id="family-childAge"
                    name="childAge"
                    type="text"
                    value={editForm.childAge}
                    onChange={handleFormChange}
                    placeholder="Example: 5 years"
                    disabled={savingProfile}
                  />
                </div>

                <div className="profile-form-group profile-form-full">
                  <label htmlFor="family-requirements">
                    Family Requirements
                  </label>
                  <textarea
                    id="family-requirements"
                    name="requirements"
                    value={editForm.requirements}
                    onChange={handleFormChange}
                    placeholder="Describe your language and childcare requirements..."
                    rows={5}
                    maxLength={1000}
                    disabled={savingProfile}
                  />

                  <span className="profile-character-count">
                    {editForm.requirements.length}/1000
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
          ) : (
            <div className="dashboard-profile-details">
              <h3>
                {profile?.firstName} {profile?.lastName}
              </h3>

              <p>
                <strong>Email</strong>
                {profile?.email || "Not provided"}
              </p>

              <p>
                <strong>Phone</strong>
                {profile?.phone || "Not provided"}
              </p>

              <p>
                <strong>Preferred Language</strong>
                {profile?.language || "Not provided"}
              </p>

              <p>
                <strong>Child&apos;s Age</strong>
                {profile?.childAge || "Not provided"}
              </p>

              <div>
                <strong>Family Requirements</strong>
                <p>
                  {profile?.requirements ||
                    "No requirements added yet."}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Educator requests */}
        <div className="dashboard-section">
          <div className="dashboard-header">
            <div>
              <h2>EDUCATOR CONNECTIONS</h2>
              <p>Interest Requests</p>
            </div>

            <Link
              href="/educators"
              className="dashboard-profile-link"
            >
              Browse Educators
            </Link>
          </div>

          {requestsError && (
            <div className="dashboard-empty">
              <p role="alert">{requestsError}</p>

              <button
                type="button"
                onClick={loadFamilyDashboard}
                className="dashboard-button"
              >
                Try Again
              </button>
            </div>
          )}

          {requestsLoading && !requestsError && (
            <div className="dashboard-empty">
              <p>Loading your educator requests...</p>
            </div>
          )}

          {!requestsLoading &&
            !requestsError &&
            requests.length === 0 && (
              <div className="dashboard-empty">
                <h3>No interest requests yet</h3>
                <p>
                  Browse our educators and send an interest request
                  to start a connection.
                </p>

                <Link
                  href="/educators"
                  className="dashboard-profile-link"
                >
                  Find an Educator
                </Link>
              </div>
            )}

          {!requestsLoading &&
            !requestsError &&
            requests.length > 0 && (
              <div className="family-request-list">
                {requests.map((request, index) => {
                  const educator = request.educator;
                  const requestId =
                    request._id || request.id || index;
                  const status = String(
                    request.status || "pending"
                  ).toLowerCase();

                  return (
                    <div
                      key={requestId}
                      className="dashboard-profile-card family-request-card"
                    >
                      <div className="family-request-header">
                        <div>
                          <h3>
                            {educator?.firstName ||
                              educator?.name ||
                              "Educator"}{" "}
                            {educator?.lastName || ""}
                          </h3>

                          <p>
                            {educator?.language ||
                              "Language not specified"}
                          </p>
                        </div>

                        <span
                          className={`request-status ${getStatusClass(
                            status
                          )}`}
                        >
                          {status}
                        </span>
                      </div>

                      <div className="dashboard-profile-details">
                        <p>
                          <strong>Language</strong>
                          {educator?.language || "Not provided"}
                        </p>

                        <p>
                          <strong>Location</strong>
                          {educator?.location || "Not provided"}
                        </p>

                        <p>
                          <strong>Experience</strong>
                          {educator?.experience || "Not provided"}
                        </p>

                        {request.message && (
                          <div>
                            <strong>Your Message</strong>
                            <p>{request.message}</p>
                          </div>
                        )}

                        <p>
                          <strong>Request Sent</strong>
                          {request.createdAt &&
                          !Number.isNaN(
                            new Date(request.createdAt).getTime()
                          )
                            ? new Date(
                                request.createdAt
                              ).toLocaleString()
                            : "Date unavailable"}
                        </p>

                        <div className="request-status-message">
                          <strong>Request Status</strong>
                          <p>{getStatusMessage(status)}</p>
                        </div>
                      </div>

                      {educator?._id && (
                        <Link
                          href={`/educators/${educator._id}`}
                          className="dashboard-profile-link"
                        >
                          View Educator Profile
                        </Link>
                      )}

                      {status === "accepted" &&
                        profile?._id &&
                        request._id && (
                          <Conversation
                            requestId={request._id}
                            currentUserId={profile._id}
                          />
                        )}
                    </div>
                  );
                })}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}