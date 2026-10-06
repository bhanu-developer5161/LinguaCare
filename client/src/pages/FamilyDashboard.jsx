import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getMyProfile,
  getFamilyRequests,
  logoutUser,
  updateMyProfile,
} from "../services/api";
import Conversation from "../components/Conversation";

function FamilyDashboard() {
  const navigate = useNavigate();

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

  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    language: "",
    childAge: "",
    requirements: "",
  });

  // ==========================================
  // LOAD DASHBOARD
  // ==========================================
  const loadFamilyDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("authToken");
      const familyUser = localStorage.getItem("familyUser");

      if (!token || !familyUser) {
        navigate("/login");
        return;
      }

      const storedUser = JSON.parse(familyUser);

      if (storedUser.role !== "family") {
        navigate("/login");
        return;
      }

      const profileData = await getMyProfile();

      if (!profileData.user) {
        throw new Error("Unable to load family profile.");
      }

      if (profileData.user.role !== "family") {
        navigate("/login");
        return;
      }

      setProfile(profileData.user);

      setEditForm({
        firstName: profileData.user.firstName || "",
        lastName: profileData.user.lastName || "",
        phone: profileData.user.phone || "",
        language: profileData.user.language || "",
        childAge: profileData.user.childAge || "",
        requirements: profileData.user.requirements || "",
      });

      try {
        setRequestsLoading(true);
        setRequestsError("");

        const requestData = await getFamilyRequests();

        setRequests(requestData.requests || []);
      } catch (requestError) {
        console.error(
          "Family requests loading error:",
          requestError
        );

        setRequestsError(
          requestError.message ||
            "Unable to load interest requests."
        );
      } finally {
        setRequestsLoading(false);
      }
    } catch (error) {
      console.error(
        "Family dashboard loading error:",
        error
      );

      if (
        error.message?.includes("Authentication") ||
        error.message?.includes("token") ||
        error.message?.includes("Invalid")
      ) {
        logoutUser();
        navigate("/login");
        return;
      }

      setError(
        error.message ||
          "Unable to load family dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFamilyDashboard();
  }, []);

  // ==========================================
  // LOGOUT
  // ==========================================
  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  // ==========================================
  // EDIT PROFILE
  // ==========================================
  const handleEditProfile = () => {
    setProfileMessage("");
    setProfileError("");

    setEditForm({
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      phone: profile?.phone || "",
      language: profile?.language || "",
      childAge: profile?.childAge || "",
      requirements: profile?.requirements || "",
    });

    setIsEditing(true);
  };

  // ==========================================
  // CANCEL EDIT
  // ==========================================
  const handleCancelEdit = () => {
    setProfileMessage("");
    setProfileError("");
    setIsEditing(false);

    setEditForm({
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      phone: profile?.phone || "",
      language: profile?.language || "",
      childAge: profile?.childAge || "",
      requirements: profile?.requirements || "",
    });
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
      setProfileError(
        "First name and last name are required."
      );
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
        throw new Error(
          "Unable to update family profile."
        );
      }

      setProfile(response.user);

      setEditForm({
        firstName: response.user.firstName || "",
        lastName: response.user.lastName || "",
        phone: response.user.phone || "",
        language: response.user.language || "",
        childAge: response.user.childAge || "",
        requirements: response.user.requirements || "",
      });

      setIsEditing(false);

      setProfileMessage(
        "Profile updated successfully."
      );
    } catch (error) {
      console.error(
        "Family profile update error:",
        error
      );

      if (
        error.message?.includes("Authentication") ||
        error.message?.includes("token") ||
        error.message?.includes("Invalid")
      ) {
        logoutUser();
        navigate("/login");
        return;
      }

      setProfileError(
        error.message ||
          "Unable to update profile."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  // ==========================================
  // REQUEST STATUS
  // ==========================================
  const getStatusClass = (status) => {
    if (status === "accepted") {
      return "status-accepted";
    }

    if (status === "rejected") {
      return "status-rejected";
    }

    return "status-pending";
  };

  const getStatusMessage = (status) => {
    if (status === "accepted") {
      return "✓ The educator accepted your request.";
    }

    if (status === "rejected") {
      return "The educator rejected this request.";
    }

    return "Waiting for the educator to respond.";
  };

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-section">
          <h2>Loading Family Dashboard...</h2>

          <p>
            Please wait while we load your profile.
          </p>
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
        <div className="dashboard-section">
          <h2>Unable to load dashboard</h2>

          <p>{error}</p>

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
        {/* HEADER */}
        <div className="dashboard-header">
          <div>
            <h1>
              Welcome, {profile?.firstName || "Family"}
            </h1>

            <p>
              Manage your family profile and educator
              requests.
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

        {/* PROFILE */}
        <div className="dashboard-profile-card">
          <div className="dashboard-header">
            <div>
              <h2>YOUR PROFILE</h2>
            </div>

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
            <div className="profile-success-message">
              {profileMessage}
            </div>
          )}

          {profileError && (
            <div className="profile-error-message">
              {profileError}
            </div>
          )}

          {/* EDIT FORM */}
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
                    required
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
                    required
                  />
                </div>

                <div className="profile-form-group">
                  <label htmlFor="family-phone">
                    Phone
                  </label>

                  <input
                    id="family-phone"
                    name="phone"
                    type="tel"
                    value={editForm.phone}
                    onChange={handleFormChange}
                    placeholder="Enter phone number"
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
                  >
                    <option value="">
                      Select language
                    </option>
                    <option value="English">
                      English
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
                    <option value="German">
                      German
                    </option>
                    <option value="Italian">
                      Italian
                    </option>
                    <option value="Japanese">
                      Japanese
                    </option>
                  </select>
                </div>

                <div className="profile-form-group">
                  <label htmlFor="family-childAge">
                    Child's Age
                  </label>

                  <input
                    id="family-childAge"
                    name="childAge"
                    type="text"
                    value={editForm.childAge}
                    onChange={handleFormChange}
                    placeholder="Example: 5 years"
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
                  {savingProfile
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </div>
            </form>
          ) : (
            <div className="dashboard-profile-details">
              <h3>
                {profile?.firstName}{" "}
                {profile?.lastName}
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
                <strong>Child's Age</strong>
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

        {/* EDUCATOR CONNECTIONS */}
        <div className="dashboard-section">
          <div className="dashboard-header">
            <div>
              <h2>EDUCATOR CONNECTIONS</h2>

              <p>Interest Requests</p>
            </div>

            <Link
              to="/educators"
              className="dashboard-profile-link"
            >
              Browse Educators
            </Link>
          </div>

          {requestsError && (
            <div className="dashboard-empty">
              <p>{requestsError}</p>

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
              <p>
                Loading your educator requests...
              </p>
            </div>
          )}

          {!requestsLoading &&
            !requestsError &&
            requests.length === 0 && (
              <div className="dashboard-empty">
                <h3>No interest requests yet</h3>

                <p>
                  Browse our educators and send an
                  interest request to start a connection.
                </p>

                <Link
                  to="/educators"
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
                {requests.map((request) => {
                  const educator = request.educator;

                  return (
                    <div
                      key={request._id}
                      className="dashboard-profile-card family-request-card"
                    >
                      <div className="family-request-header">
                        <div>
                          <h3>
                            {educator?.firstName}{" "}
                            {educator?.lastName}
                          </h3>

                          <p>
                            {educator?.language ||
                              "Language not specified"}
                          </p>
                        </div>

                        <span
                          className={`request-status ${getStatusClass(
                            request.status
                          )}`}
                        >
                          {request.status}
                        </span>
                      </div>

                      <div className="dashboard-profile-details">
                        <p>
                          <strong>Language</strong>

                          {educator?.language ||
                            "Not provided"}
                        </p>

                        <p>
                          <strong>Location</strong>

                          {educator?.location ||
                            "Not provided"}
                        </p>

                        <p>
                          <strong>Experience</strong>

                          {educator?.experience ||
                            "Not provided"}
                        </p>

                        {request.message && (
                          <div>
                            <strong>Your Message</strong>

                            <p>{request.message}</p>
                          </div>
                        )}

                        <p>
                          <strong>Request Sent</strong>

                          {request.createdAt
                            ? new Date(
                                request.createdAt
                              ).toLocaleString()
                            : "Date unavailable"}
                        </p>

                        <div className="request-status-message">
                          <strong>
                            Request Status
                          </strong>

                          <p>
                            {getStatusMessage(
                              request.status
                            )}
                          </p>
                        </div>
                      </div>

                      {educator?._id && (
                        <Link
                          to={`/educators/${educator._id}`}
                          className="dashboard-profile-link"
                        >
                          View Educator Profile
                        </Link>
                      )}

                      {request.status === "accepted" &&
                        profile?._id && (
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

export default FamilyDashboard;