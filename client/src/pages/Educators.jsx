import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getEducators } from "../services/api";

function Educators() {
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("");
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");

  const [educators, setEducators] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEducators = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await getEducators();

        const databaseEducators = (response.educators || []).map(
          (educator) => ({
            id: educator._id,

            name:
              `${educator.firstName || ""} ${
                educator.lastName || ""
              }`.trim() || "Educator",

            language:
              educator.language || "Not specified",

            location:
              educator.location || "Not specified",

            experience:
              educator.experience || "Not specified",

            education:
              educator.education || "Not specified",

            description:
              educator.about ||
              "This educator has not added a professional summary yet.",

            skills: Array.isArray(educator.skills)
              ? educator.skills
              : [],
          })
        );

        setEducators(databaseEducators);
      } catch (error) {
        console.error(
          "Educator loading error:",
          error
        );

        setError(
          error.message ||
            "Unable to load educators."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadEducators();
  }, []);

  const filteredEducators = useMemo(() => {
    const searchValue = search.toLowerCase().trim();
    const locationValue = location.toLowerCase().trim();

    return educators.filter((educator) => {
      const searchableText = [
        educator.name,
        educator.language,
        educator.location,
        educator.education,
        educator.description,
        ...(educator.skills || []),
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !searchValue ||
        searchableText.includes(searchValue);

      const matchesLanguage =
        !language ||
        educator.language.toLowerCase() ===
          language.toLowerCase();

      const matchesExperience =
        !experience ||
        educator.experience === experience;

      const matchesLocation =
        !locationValue ||
        educator.location
          .toLowerCase()
          .includes(locationValue);

      return (
        matchesSearch &&
        matchesLanguage &&
        matchesExperience &&
        matchesLocation
      );
    });
  }, [
    educators,
    search,
    language,
    experience,
    location,
  ]);

  const hasActiveFilters =
    search ||
    language ||
    experience ||
    location;

  const clearFilters = () => {
    setSearch("");
    setLanguage("");
    setExperience("");
    setLocation("");
  };

  if (isLoading) {
    return (
      <div className="educators-page">
        <div className="educators-header">
          <p className="eyebrow">
            EXPLORE OUR EDUCATORS
          </p>

          <h1>
            Find the right educator for your family
          </h1>

          <p>
            Discover experienced educators who combine
            childcare with language immersion.
          </p>
        </div>

        <div className="no-educators">
          <h2>Loading educators...</h2>

          <p>
            We're securely loading educator profiles.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="educators-page">
        <div className="educators-header">
          <p className="eyebrow">
            EXPLORE OUR EDUCATORS
          </p>

          <h1>
            Find the right educator for your family
          </h1>

          <p>
            Discover experienced educators who combine
            childcare with language immersion.
          </p>
        </div>

        <div className="no-educators">
          <h2>
            Unable to load educators
          </h2>

          <p>{error}</p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="educators-page">
      {/* PAGE HEADER */}
      <div className="educators-header">
        <p className="eyebrow">
          EXPLORE OUR EDUCATORS
        </p>

        <h1>
          Find the right educator for your family
        </h1>

        <p>
          Discover experienced educators who combine
          childcare with Mandarin, Spanish, French,
          and other language immersion experiences.
        </p>
      </div>

      {/* FILTERS */}
      <div className="educator-filters">
        <input
          type="text"
          placeholder="Search by name, language, education, or skill..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(event) =>
            setLocation(event.target.value)
          }
        />

        <select
          value={language}
          onChange={(event) =>
            setLanguage(event.target.value)
          }
        >
          <option value="">
            All Languages
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

          <option value="English">
            English
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

        <select
          value={experience}
          onChange={(event) =>
            setExperience(event.target.value)
          }
        >
          <option value="">
            All Experience
          </option>

          <option value="1-3 years">
            1–3 years
          </option>

          <option value="3-5 years">
            3–5 years
          </option>

          <option value="4-5 years">
            4–5 years
          </option>

          <option value="5+ years">
            5+ years
          </option>
        </select>
      </div>

      {/* RESULTS HEADER */}
      <div className="educator-results-header">
        <div className="educator-results-count">
          Showing{" "}
          <strong>
            {filteredEducators.length}
          </strong>{" "}
          educator
          {filteredEducators.length !== 1
            ? "s"
            : ""}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            className="clear-filters-button"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* EDUCATOR CARDS */}
      {filteredEducators.length > 0 ? (
        <div className="educator-grid">
          {filteredEducators.map(
            (educator) => {
              const initials = educator.name
                .split(" ")
                .filter(Boolean)
                .map(
                  (word) => word[0]
                )
                .join("")
                .toUpperCase();

              return (
                <article
                  className="educator-card"
                  key={educator.id}
                >
                  <div className="educator-avatar">
                    {initials || "ED"}
                  </div>

                  <div className="educator-card-content">
                    <div className="educator-top">
                      <div>
                        <h2>
                          {educator.name}
                        </h2>

                        <p>
                          {educator.location}
                        </p>
                      </div>

                      <span className="rating">
                        NEW
                      </span>
                    </div>

                    <div className="educator-tags">
                      <span>
                        {educator.language}
                      </span>

                      <span>
                        {educator.experience}
                      </span>
                    </div>

                    <p className="educator-education">
                      {educator.education}
                    </p>

                    <p className="educator-description">
                      {educator.description}
                    </p>

                    {educator.skills.length > 0 && (
                      <div className="educator-skills">
                        {educator.skills
                          .slice(0, 3)
                          .map((skill) => (
                            <span key={skill}>
                              {skill}
                            </span>
                          ))}
                      </div>
                    )}

                    <Link
                      to={`/educators/${educator.id}`}
                      className="view-profile"
                    >
                      View Profile →
                    </Link>
                  </div>
                </article>
              );
            }
          )}
        </div>
      ) : (
        <div className="no-educators">
          <div className="no-educators-icon">
            🔎
          </div>

          <h2>
            No educators found
          </h2>

          <p>
            We couldn't find educators matching your
            current search criteria.
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default Educators;