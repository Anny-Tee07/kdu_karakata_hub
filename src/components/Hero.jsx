import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldHalved, faSearch, faLocationDot, faUtensils, faBolt, faShirt, faSpa, faCalculator, faFan, faBox, faHandshake } from "../icons";

function Hero() {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="trust-badge">
          <span> <FontAwesomeIcon icon={faShieldHalved} /> Verified KolaDaisi University Student Marketplace </span>
        </div>

        <h1>Find What You Need Around Campus.</h1>
        <p className="hero-subtitle">
          Discover products, services, food, and trusted vendors within the KDU community
          all in one place. Handover safely right at your hostel gate or faculty quad.
        </p>

        <div className="hero-search-container">
          <div className="search-input-group">
            <span> <FontAwesomeIcon icon={faSearch} /> </span>
            <input type="text" placeholder="What are you looking for today?" />
          </div>
          <div className="location-input-group">
            <span> <FontAwesomeIcon icon={faLocationDot} /></span>
            <select>
              <option>All KDU Locations</option>
            </select>
          </div>
          <button className="btn-explore">Explore ➔</button>
        </div>

        <div className="hero-tags">
          <span className="tag-label">Popular</span>
          <button className="tag-chip">  <FontAwesomeIcon icon={faUtensils} />Food </button>
          <button className="tag-chip"> <FontAwesomeIcon icon={faBolt} />Charger</button>
          <button className="tag-chip"> <FontAwesomeIcon icon={faShirt} /> Hoodies</button>
          <button className="tag-chip"> <FontAwesomeIcon icon={faSpa} /> Braids</button>
          <button className="tag-chip"> <FontAwesomeIcon icon={faCalculator} /> Calculators</button>
          <button className="tag-chip"> <FontAwesomeIcon icon={faFan} /> Desk Fan</button>
        </div>

        <div className="hero-stats">
          <div className="stat-card">
            <span className="stat-icon"> 🗳️ </span>
            <div>
              <h3>480+</h3>
              <p>Active Student Listings</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon"> 🤝</span>
            <div>
              <h3>65+</h3>
              <p>Verified Campus Vendors</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon"> 🛡️</span>
            <div>
              <h3>100%</h3>
              <p>On-Campus Handover</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;