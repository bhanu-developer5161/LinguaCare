import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function FamilyDashboard() {
  const navigate = useNavigate();

  const [family, setFamily] = useState(null);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const storedFamily = JSON.parse(
      localStorage.getItem("familyUser") || "null"
    );

    if (!storedFamily) {
      navigate("/login");
      return;
    }

    setFamily(storedFamily);

    const allRequests = JSON.parse(
      localStorage.getItem("interestRequests") || "[]"
    );

    const familyRequests = allRequests.filter(
      (request) =>
        request.family?.email === storedFamily.email
    );

    setRequests(familyRequests);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("familyUser");
    navigate("/login");
  };

  if (!family) {
    return null;
  }

  const fullName =
    `${family.firstName || ""} ${family.lastName || ""}`.trim() ||
    "Family";

  return (
    <div className="dashboard-page">

      {/* HEADER */}

      <div className="dashboard-header">

        <div>
          <p className="eyebrow">
            FAMILY DASHBOARD
          </p>

          <h1>
            Welcome, {family.firstName || "Family"}
          </h1>

          <p>
            Manage your family profile and educator requests.
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
            <strong>{family.email}</strong>
          </div>

          <div>
            <span>Phone</span>
            <strong>{family.phone || "Not provided"}</strong>
          </div>

          <div>
            <span>Preferred Language</span>
            <strong>
              {family.language || "Not specified"}
            </strong>
          </div>

          <div>
            <span>Child's Age</span>
            <strong>
              {family.childAge || "Not specified"}
            </strong>
          </div>

        </div>

        <div className="dashboard-about">

          <span>Family Requirements</span>

          <p>
            {family.requirements ||
              "No requirements have been added yet."}
          </p>

        </div>

      </section>

      {/* REQUESTS */}

      <section className="dashboard-card">

        <div className="dashboard-section-heading">

          <div>
            <p className="eyebrow">
              EDUCATOR CONNECTIONS
            </p>

            <h2>
              Interest Requests
            </h2>
          </div>

          <Link
            to="/educators"
            className="dashboard-secondary-button"
          >
            Browse Educators
          </Link>

        </div>

        {requests.length === 0 ? (
          <div className="dashboard-empty">

            <h3>
              No interest requests yet
            </h3>

            <p>
              Browse our educators and send an interest
              request to start a connection.
            </p>

            <Link
              to="/educators"
              className="dashboard-primary-button"
            >
              Find an Educator
            </Link>

          </div>
        ) : (
          <div className="request-list">

            {requests.map((request) => (

              <div
                className="request-card"
                key={request.id}
              >

                <div className="request-main">

                  <div className="request-avatar">
                    {request.educator?.name
                      ?.split(" ")
                      .filter(Boolean)
                      .map((word) => word[0])
                      .join("")
                      .toUpperCase() || "ED"}
                  </div>

                  <div>

                    <h3>
                      {request.educator?.name ||
                        "Educator"}
                    </h3>

                    <p>
                      {request.educator?.language ||
                        "Language not specified"}
                      {" · "}
                      {request.educator?.location ||
                        "Location not specified"}
                    </p>

                  </div>

                </div>

                <div className="request-status-area">

                  <span
                    className={`request-status ${request.status}`}
                  >
                    {request.status === "accepted"
                      ? "Accepted"
                      : request.status === "rejected"
                      ? "Rejected"
                      : "Pending"}
                  </span>

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

            ))}

          </div>
        )}

      </section>

    </div>
  );
}

export default FamilyDashboard;