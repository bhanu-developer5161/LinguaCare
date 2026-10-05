import { Link, useParams } from "react-router-dom";

const demoEducators = {
  1: {
    id: 1,
    name: "Sophie Martin",
    language: "French",
    location: "Paris, France",
    experience: "6 years",
    rating: "4.9",
    education: "Early Childhood Education",
    availability: "Available",
    about:
      "Experienced French educator specializing in language immersion and early childhood learning.",
    skills: [
      "French Immersion",
      "Early Childhood",
      "Creative Learning",
      "Childcare",
      "Cultural Education",
    ],
  },

  2: {
    id: 2,
    name: "Elena Garcia",
    language: "Spanish",
    location: "Madrid, Spain",
    experience: "5 years",
    rating: "4.8",
    education: "Child Development",
    availability: "Available",
    about:
      "Spanish-speaking educator focused on creating engaging language immersion experiences for children.",
    skills: [
      "Spanish Immersion",
      "Child Development",
      "Storytelling",
      "Creative Learning",
      "Childcare",
    ],
  },

  3: {
    id: 3,
    name: "Mei Lin",
    language: "Mandarin",
    location: "Shanghai, China",
    experience: "7 years",
    rating: "5.0",
    education: "Education & Psychology",
    availability: "Available",
    about:
      "Mandarin educator with experience in international households and personalized child education.",
    skills: [
      "Mandarin Immersion",
      "Education",
      "Psychology",
      "International Families",
      "Childcare",
    ],
  },
};

function EducatorProfile() {
  const { id } = useParams();

  const registeredEducator = JSON.parse(
    localStorage.getItem("educatorUser") || "null"
  );

  let educator = null;

  // --------------------------------------------------
  // DEMO EDUCATOR PROFILES
  // /educators/1
  // /educators/2
  // /educators/3
  // --------------------------------------------------
  if (demoEducators[id]) {
    educator = demoEducators[id];
  }

  // --------------------------------------------------
  // REGISTERED EDUCATOR PROFILE
  // /educators/registered
  // --------------------------------------------------
  if (id === "registered" && registeredEducator) {
    const registeredName = `${registeredEducator.firstName || ""} ${
      registeredEducator.lastName || ""
    }`.trim();

    educator = {
      id: "registered",
      name: registeredName || "Educator",
      language: registeredEducator.language || "Not specified",
      location: registeredEducator.location || "Not specified",
      experience: registeredEducator.experience || "Not specified",
      rating: "New",
      education: registeredEducator.education || "Not specified",
      availability: "Available",
      about:
        registeredEducator.about ||
        "This educator has not added a professional summary yet.",
      skills:
        Array.isArray(registeredEducator.skills) &&
        registeredEducator.skills.length > 0
          ? registeredEducator.skills
          : [],
    };
  }

  // --------------------------------------------------
  // PROFILE NOT FOUND
  // --------------------------------------------------
  if (!educator) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <p className="eyebrow">PROFILE NOT FOUND</p>

          <h1>Educator profile not found</h1>

          <p>
            The educator profile you are looking for does not exist.
          </p>

          <Link to="/educators" className="profile-back-button">
            ← Back to Educators
          </Link>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // CREATE INITIALS
  // --------------------------------------------------
  const initials = educator.name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const firstName = educator.name.split(" ")[0];

  return (
    <div className="profile-page">
      {/* BACK BUTTON */}
      <Link to="/educators" className="profile-back">
        ← Back to Educators
      </Link>

      {/* PROFILE HERO */}
      <div className="profile-hero">
        <div className="profile-avatar">
          {initials}
        </div>

        <div className="profile-heading">
          <p className="eyebrow">EDUCATOR PROFILE</p>

          <h1>{educator.name}</h1>

          <p className="profile-location">
            {educator.location}
          </p>

          <div className="profile-tags">
            <span>{educator.language}</span>

            <span>{educator.experience}</span>

            <span>
              ★ {educator.rating || "New"}
            </span>
          </div>
        </div>

        <div className="profile-availability">
          <span>●</span>

          {educator.availability || "Available"}
        </div>
      </div>

      {/* PROFILE CONTENT */}
      <div className="profile-layout">
        <main>
          {/* ABOUT */}
          <section className="profile-section">
            <p className="eyebrow">ABOUT</p>

            <h2>
              About {firstName}
            </h2>

            <p>
              {educator.about}
            </p>
          </section>

          {/* BACKGROUND */}
          <section className="profile-section">
            <p className="eyebrow">BACKGROUND</p>

            <h2>
              Education & Experience
            </h2>

            <div className="profile-info-grid">
              <div>
                <span>Education</span>

                <strong>
                  {educator.education}
                </strong>
              </div>

              <div>
                <span>Experience</span>

                <strong>
                  {educator.experience}
                </strong>
              </div>

              <div>
                <span>Language</span>

                <strong>
                  {educator.language}
                </strong>
              </div>

              <div>
                <span>Location</span>

                <strong>
                  {educator.location}
                </strong>
              </div>
            </div>
          </section>

          {/* SKILLS */}
          <section className="profile-section">
            <p className="eyebrow">EXPERTISE</p>

            <h2>
              Skills & Expertise
            </h2>

            {educator.skills.length > 0 ? (
              <div className="profile-skills">
                {educator.skills.map((skill, index) => (
                  <span key={`${skill}-${index}`}>
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p>
                No skills have been added yet.
              </p>
            )}
          </section>
        </main>

        {/* SIDEBAR */}
        <aside className="profile-sidebar">
          <div className="profile-action-card">
            <p className="eyebrow">
              INTERESTED?
            </p>

            <h2>
              Connect with {firstName}
            </h2>

            <p>
              Create your family account and
              send an interest request to this
              educator.
            </p>

            {id !== "registered" ? (
              <Link
                to={`/register?educator=${id}`}
                className="interest-button"
              >
                Send Interest
              </Link>
            ) : (
              <div className="profile-owner-message">
                This is your public educator profile.
              </div>
            )}

            <Link
              to="/educators"
              className="profile-secondary-button"
            >
              Browse Other Educators
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default EducatorProfile;