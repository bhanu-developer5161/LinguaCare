import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function EducatorDashboard() {
  const navigate = useNavigate();

  const [educator, setEducator] = useState(null);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const storedEducator = JSON.parse(
      localStorage.getItem("educatorUser") || "null"
    );

    if (!storedEducator) {
      navigate("/login");
      return;
    }

    setEducator(storedEducator);

    loadRequests(storedEducator);
  }, [navigate]);

  const loadRequests = (storedEducator) => {
    const allRequests = JSON.parse(
      localStorage.getItem("interestRequests") || "[]"
    );

    const educatorRequests = allRequests.filter(
      (request) =>
        request.educator?.name ===
        `${storedEducator.firstName || ""} ${
          storedEducator.lastName || ""
        }`.trim()
    );

    setRequests(educatorRequests);
  };

  const updateRequestStatus = (requestId, newStatus) => {
    const allRequests = JSON.parse(
      localStorage.getItem("interestRequests") || "[]"
    );

    const updatedRequests = allRequests.map((request) => {
      if (request.id === requestId) {
        return {
          ...request,
          status: newStatus,
          updatedAt: new Date().toISOString(),
        };
      }

      return request;
    });

    localStorage.setItem(
      "interestRequests",
      JSON.stringify(updatedRequests)
    );

    if (educator) {
      loadRequests(educator);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("educatorUser");
    navigate("/login");
  };

  if (!educator) {
    return null;
  }

  const fullName =
    `${educator.firstName || ""} ${
      educator.lastName || ""
    }`.trim() || "Educator";

  return (
    <div className="dashboard-page">

      {/* HEADER */}

      <div className="dashboard-header">

        <div>
          <p className="eyebrow">
            EDUCATOR DASHBOARD
          </p>

          <h1>
            Welcome, {educator.firstName || "Educator"}
          </h1>

          <p>
            Manage your profile and family requests.
          </p>
        </div>

        <button
          type="button"
          className="dashboard-logout"
          onClick={handleLogout}
        >
          Log out
        </button>

      </div>

      {/* PROFILE */}

      <section className="dashboard-card">

        <div className="dashboard-section-heading">

          <div>
            <p className="eyebrow">
              YOUR PROFILE
            </p>

            <h2>
              {fullName}
            </h2>
          </div>

        </div>

        <div className="dashboard-info-grid">

          <div>
            <span>Email</span>
            <strong>
              {educator.email}
            </strong>
          </div>

          <div>
            <span>Language</span>
            <strong>
              {educator.language || "Not specified"}
            </strong>
          </div>

          <div>
            <span>Location</span>
            <strong>
              {educator.location || "Not specified"}
            </strong>
          </div>

          <div>
            <span>Experience</span>
            <strong>
              {educator.experience || "Not specified"}
            </strong>
          </div>

          <div>
            <span>Education</span>
            <strong>
              {educator.education || "Not specified"}
            </strong>
          </div>

        </div>

        <div style={{ marginTop: "20px" }}>
          <Link
            to="/educators/registered"
            className="dashboard-primary-button"
          >
            View Public Profile
          </Link>
        </div>

      </section>

      {/* FAMILY REQUESTS */}

      <section className="dashboard-card">

        <div className="dashboard-section-heading">

          <div>
            <p className="eyebrow">
              FAMILY REQUESTS
            </p>

            <h2>
              Interest Requests
            </h2>
          </div>

        </div>

        {requests.length === 0 ? (
          <div className="dashboard-empty">

            <h3>
              No family requests yet
            </h3>

            <p>
              When a family expresses interest in your
              profile, their request will appear here.
            </p>

          </div>
        ) : (
          <div className="request-list">

            {requests.map((request) => {

              const familyName =
                `${request.family?.firstName || ""} ${
                  request.family?.lastName || ""
                }`.trim() || "Family";

              return (
                <div
                  className="request-card"
                  key={request.id}
                >

                  <div className="request-main">

                    <div className="request-avatar">
                      {familyName
                        .split(" ")
                        .filter(Boolean)
                        .map((word) => word[0])
                        .join("")
                        .toUpperCase()}
                    </div>

                    <div>

                      <h3>
                        {familyName}
                      </h3>

                      <p>
                        {request.family?.language ||
                          "Language not specified"}
                        {" · "}
                        Child age:{" "}
                        {request.family?.childAge ||
                          "Not specified"}
                      </p>

                      <p
                        style={{
                          marginTop: "7px",
                          fontSize: "14px",
                        }}
                      >
                        {request.family?.requirements ||
                          "No requirements provided."}
                      </p>

                    </div>

                  </div>

                  <div className="request-status-area">

                    <span
                      className={`request-status ${
                        request.status || "pending"
                      }`}
                    >
                      {request.status === "accepted"
                        ? "Accepted"
                        : request.status === "rejected"
                        ? "Rejected"
                        : "Pending"}
                    </span>

                    {request.status === "pending" && (
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          marginTop: "8px",
                        }}
                      >

                        <button
                          type="button"
                          onClick={() =>
                            updateRequestStatus(
                              request.id,
                              "accepted"
                            )
                          }
                          style={{
                            border: "none",
                            background: "#315442",
                            color: "#ffffff",
                            padding: "8px 14px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "600",
                          }}
                        >
                          Accept
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            updateRequestStatus(
                              request.id,
                              "rejected"
                            )
                          }
                          style={{
                            border: "1px solid #d8caca",
                            background: "#ffffff",
                            color: "#8b4545",
                            padding: "8px 14px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "600",
                          }}
                        >
                          Reject
                        </button>

                      </div>
                    )}

                    <small>
                      Request sent{" "}
                      {request.createdAt
                        ? new Date(
                            request.createdAt
                          ).toLocaleDateString()
                        : ""}
                    </small>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </section>

      {/* ABOUT */}

      <section className="dashboard-card">

        <div className="dashboard-section-heading">

          <div>
            <p className="eyebrow">
              ABOUT YOU
            </p>

            <h2>
              Professional Summary
            </h2>
          </div>

        </div>

        <div className="dashboard-about">

          <p>
            {educator.about ||
              "No professional summary has been added yet."}
          </p>

        </div>

        <div style={{ marginTop: "25px" }}>

          <p className="eyebrow">
            SKILLS & EXPERTISE
          </p>

          <div className="profile-skills">
            {Array.isArray(educator.skills) &&
            educator.skills.length > 0 ? (
              educator.skills.map((skill, index) => (
                <span key={`${skill}-${index}`}>
                  {skill}
                </span>
              ))
            ) : (
              <p>
                No skills have been added yet.
              </p>
            )}
          </div>

        </div>

      </section>

    </div>
  );
}

export default EducatorDashboard;