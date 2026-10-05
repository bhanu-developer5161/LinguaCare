import { Link } from "react-router-dom";
import { useState } from "react";

const demoEducators = [
  {
    id: "1",
    name: "Sophie Martin",
    language: "French",
    location: "Paris, France",
    experience: "3-5 years",
    rating: "4.9",
    education: "Early Childhood Education",
    description:
      "Experienced bilingual educator specializing in French language immersion and early childhood learning.",
    skills: [
      "French Immersion",
      "Early Childhood",
      "Creative Learning",
      "Childcare",
    ],
  },
  {
    id: "2",
    name: "Elena Garcia",
    language: "Spanish",
    location: "Madrid, Spain",
    experience: "3-5 years",
    rating: "4.8",
    education: "Child Development",
    description:
      "Spanish-speaking educator focused on creating engaging language immersion experiences for children.",
    skills: [
      "Spanish Immersion",
      "Child Development",
      "Storytelling",
      "Creative Learning",
    ],
  },
  {
    id: "3",
    name: "Mei Lin",
    language: "Mandarin",
    location: "Shanghai, China",
    experience: "5+ years",
    rating: "5.0",
    education: "Education & Psychology",
    description:
      "Mandarin educator with experience in international households and personalized child education.",
    skills: [
      "Mandarin Immersion",
      "Education",
      "Psychology",
      "International Families",
    ],
  },
];

function Educators() {
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("");
  const [experience, setExperience] = useState("");

  const registeredEducator = JSON.parse(
    localStorage.getItem("educatorUser") || "null"
  );

  const registeredProfile = registeredEducator
    ? {
        id: "registered",
        name: `${registeredEducator.firstName || ""} ${
          registeredEducator.lastName || ""
        }`.trim(),
        language: registeredEducator.language || "Not specified",
        location: registeredEducator.location || "Not specified",
        experience: registeredEducator.experience || "Not specified",
        rating: "New",
        education: registeredEducator.education || "Not specified",
        description:
          registeredEducator.about ||
          "This educator has not added a professional summary yet.",
        skills: registeredEducator.skills || [],
      }
    : null;

  const allEducators = registeredProfile
    ? [...demoEducators, registeredProfile]
    : demoEducators;

  const searchValue = search.toLowerCase().trim();

  const filteredEducators = allEducators.filter((educator) => {
    const matchesSearch =
      !searchValue ||
      educator.name.toLowerCase().includes(searchValue) ||
      educator.location.toLowerCase().includes(searchValue) ||
      educator.language.toLowerCase().includes(searchValue);

    const matchesLanguage =
      !language || educator.language === language;

    const matchesExperience =
      !experience || educator.experience === experience;

    return (
      matchesSearch &&
      matchesLanguage &&
      matchesExperience
    );
  });

  const clearFilters = () => {
    setSearch("");
    setLanguage("");
    setExperience("");
  };

  return (
    <div className="educators-page">
      <div className="educators-header">
        <div>
          <p className="eyebrow">EXPLORE OUR EDUCATORS</p>

          <h1>
            Find the right educator for your family
          </h1>

          <p>
            Discover experienced educators who combine
            childcare with Mandarin, Spanish, or French
            language immersion.
          </p>
        </div>
      </div>

      <div className="educator-filters">
        <input
          type="text"
          placeholder="Search by name, location, or language..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="">All Languages</option>
          <option value="French">French</option>
          <option value="Spanish">Spanish</option>
          <option value="Mandarin">Mandarin</option>
        </select>

        <select
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        >
          <option value="">All Experience</option>
          <option value="1-3 years">1–3 years</option>
          <option value="3-5 years">3–5 years</option>
          <option value="5+ years">5+ years</option>
        </select>
      </div>

      <div className="educator-results-count">
        Showing {filteredEducators.length} educator
        {filteredEducators.length !== 1 ? "s" : ""}
      </div>

      {filteredEducators.length > 0 ? (
        <div className="educator-grid">
          {filteredEducators.map((educator) => {
            const initials = educator.name
              .split(" ")
              .filter(Boolean)
              .map((word) => word[0])
              .join("")
              .toUpperCase();

            return (
              <div
                className="educator-card"
                key={educator.id}
              >
                <div className="educator-avatar">
                  {initials}
                </div>

                <div className="educator-card-content">
                  <div className="educator-top">
                    <div>
                      <h2>{educator.name}</h2>
                      <p>{educator.location}</p>
                    </div>

                    <span className="rating">
                      ★ {educator.rating}
                    </span>
                  </div>

                  <div className="educator-tags">
                    <span>{educator.language}</span>
                    <span>{educator.experience}</span>
                  </div>

                  <p className="educator-education">
                    {educator.education}
                  </p>

                  <p className="educator-description">
                    {educator.description}
                  </p>

                  <Link
                    to={`/educators/${educator.id}`}
                    className="view-profile"
                  >
                    View Profile →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="no-educators">
          <h2>No educators found</h2>

          <p>
            Try changing your search or filters.
          </p>

          <button onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default Educators;