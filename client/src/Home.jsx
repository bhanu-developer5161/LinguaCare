import { Search, Globe2, ShieldCheck, ArrowRight, Star } from "lucide-react";
import "./App.css";

const educators = [
  {
    name: "Sophie Martin",
    language: "French",
    location: "Paris, France",
    experience: "6+ years",
    rating: "4.9",
    initials: "SM",
  },
  {
    name: "Elena Garcia",
    language: "Spanish",
    location: "Madrid, Spain",
    experience: "5+ years",
    rating: "4.8",
    initials: "EG",
  },
  {
    name: "Mei Lin",
    language: "Mandarin",
    location: "Shanghai, China",
    experience: "7+ years",
    rating: "5.0",
    initials: "ML",
  },
];

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo">
          <span className="logo-mark">L</span>
          Lingua<span>Care</span>
        </div>

        <div className="nav-links">
          <a href="#how">How it works</a>
          <a href="#educators">Educators</a>
          <a href="#languages">Languages</a>
          <button className="login-btn">Log in</button>
          <button className="primary-btn">Get started</button>
        </div>
      </nav>

      <main>
        <section className="hero">
          <div className="hero-content">
            <div className="eyebrow">
              <Globe2 size={16} />
              Language immersion at home
            </div>

            <h1>
              Give your child the gift of
              <span> another language.</span>
            </h1>

            <p>
              Connect with carefully matched bilingual governesses and au pairs
              who bring language, culture, and learning into everyday family life.
            </p>

            <div className="hero-actions">
              <button className="primary-btn large">
                Find an educator <ArrowRight size={18} />
              </button>
              <button className="secondary-btn">
                Become an educator
              </button>
            </div>

            <div className="trust-row">
              <div className="avatars">
                <span>SM</span>
                <span>EG</span>
                <span>ML</span>
              </div>
              <div>
                <div className="stars">
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                </div>
                <small>Trusted by families worldwide</small>
              </div>
            </div>
          </div>

          <div className="hero-card">
            <div className="card-label">Featured educator</div>

            <div className="profile-image">
              <span>SM</span>
            </div>

            <h3>Sophie Martin</h3>
            <p className="role">French Governess</p>

            <div className="profile-details">
              <div>
                <strong>French</strong>
                <small>Native</small>
              </div>
              <div>
                <strong>6+ yrs</strong>
                <small>Experience</small>
              </div>
              <div>
                <strong>4.9</strong>
                <small>Rating</small>
              </div>
            </div>

            <button className="profile-btn">View profile</button>
          </div>
        </section>

        <section className="search-section">
          <div>
            <span>I'm looking for</span>
            <strong>A bilingual educator</strong>
          </div>

          <div>
            <span>Language</span>
            <strong>Any language</strong>
          </div>

          <div>
            <span>Location</span>
            <strong>Anywhere</strong>
          </div>

          <button className="search-btn">
            <Search size={19} />
            Search
          </button>
        </section>

        <section className="section" id="languages">
          <div className="section-heading">
            <div>
              <p className="section-tag">Explore languages</p>
              <h2>Learning that becomes part of everyday life.</h2>
            </div>
            <p>
              Choose from experienced educators who make language learning
              natural through daily conversation, play, and cultural immersion.
            </p>
          </div>

          <div className="language-grid">
            <div className="language-card french">
              <span>FR</span>
              <h3>French</h3>
              <p>Discover language through culture and conversation.</p>
            </div>

            <div className="language-card spanish">
              <span>ES</span>
              <h3>Spanish</h3>
              <p>Make Spanish part of your child's everyday world.</p>
            </div>

            <div className="language-card mandarin">
              <span>中</span>
              <h3>Mandarin</h3>
              <p>Build confidence through natural language immersion.</p>
            </div>
          </div>
        </section>

        <section className="section" id="educators">
          <div className="section-heading">
            <div>
              <p className="section-tag">Meet our educators</p>
              <h2>People who make the difference.</h2>
            </div>
          </div>

          <div className="educator-grid">
            {educators.map((educator) => (
              <div className="educator-card" key={educator.name}>
                <div className="educator-avatar">{educator.initials}</div>
                <div className="educator-info">
                  <div className="rating">
                    <Star size={14} fill="currentColor" />
                    {educator.rating}
                  </div>
                  <h3>{educator.name}</h3>
                  <p>{educator.language} · {educator.location}</p>
                  <small>{educator.experience} experience</small>
                </div>
                <button className="arrow-btn">
                  <ArrowRight size={18} />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="how-section" id="how">
          <div className="how-heading">
            <p className="section-tag">Simple by design</p>
            <h2>From first search to lasting connection.</h2>
          </div>

          <div className="steps">
            <div>
              <span>01</span>
              <h3>Tell us what you need</h3>
              <p>Share your family's language, schedule, and learning goals.</p>
            </div>

            <div>
              <span>02</span>
              <h3>Discover your matches</h3>
              <p>Explore educators whose experience fits your family's needs.</p>
            </div>

            <div>
              <span>03</span>
              <h3>Start the journey</h3>
              <p>Connect, arrange a conversation, and build a lasting relationship.</p>
            </div>
          </div>
        </section>

        <section className="cta">
          <div>
            <p className="section-tag">Ready to begin?</p>
            <h2>Bring a new language into your home.</h2>
            <p>
              Find a bilingual educator who fits your family's world.
            </p>
          </div>

          <button className="primary-btn large">
            Find an educator <ArrowRight size={18} />
          </button>
        </section>
      </main>

      <footer>
        <div className="logo">
          <span className="logo-mark">L</span>
          Lingua<span>Care</span>
        </div>
        <p>Language, culture, and care — together.</p>
      </footer>
    </div>
  );
}

export default App;