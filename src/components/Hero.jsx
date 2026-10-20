import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldHalved, faSearch, faLocationDot, faUtensils, faBolt, faShirt, faSpa, faCalculator, faFan } from "../icons";
import { useNavigate } from "react-router-dom";
import { products, marketplaceCategoryShortcuts } from "../data/products";
import { cleanSearchQuery } from "../utils/search";
import { useMarketplaceOptions } from "../data/useMarketplaceOptions";

function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();
  const { locations } = useMarketplaceOptions();

  const searchProducts = (query = searchQuery) => {
    const cleanedQuery = cleanSearchQuery(query);
    const searchParams = new URLSearchParams();

    if (cleanedQuery) {
      searchParams.set('search', cleanedQuery);
    }
    if (location) {
      searchParams.set('location', location);
    }
    navigate(`/categories${searchParams.size > 0 ? `?${searchParams.toString()}` : ''}`);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    searchProducts();
  };

  return (
    <section className="hero-section" id="home">
      <div className="container">
        <div className="trust-badge">
          <span> <FontAwesomeIcon icon={faShieldHalved} /> KolaDaisi University Student Marketplace </span>
        </div>

        <h1>Find What You Need Around Campus.</h1>
        <p className="hero-subtitle">
          Browse sample products, services, and food listings from the KDU community,
          with prices and pickup locations shown where available.
        </p>

        <form className="hero-search-container" role="search" onSubmit={handleSearchSubmit}>
          <div className="search-input-group">
            <span> <FontAwesomeIcon icon={faSearch} /> </span>
            <input
              type="search"
              placeholder="What are you looking for today?"
              aria-label="Search products"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
          <div className="location-input-group">
            <span> <FontAwesomeIcon icon={faLocationDot} /></span>
            <select
              aria-label="Filter by campus location"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
            >
              <option value="">All Campus Locations</option>
              {locations.map((group) => (
                <optgroup key={group.name} label={group.name}>
                  {group.locations.map((productLocation) => (
                    <option key={productLocation.name} value={productLocation.name}>
                      {productLocation.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <button className="btn-explore" type="submit">Explore ➔</button>
        </form>

        <div className="hero-tags">
          <span className="tag-label">Popular</span>
          <button type="button" className="tag-chip" onClick={() => searchProducts('Food')}>  <FontAwesomeIcon icon={faUtensils} />Food </button>
          <button type="button" className="tag-chip" onClick={() => searchProducts('Charger')}> <FontAwesomeIcon icon={faBolt} />Charger</button>
          <button type="button" className="tag-chip" onClick={() => searchProducts('Hoodie')}> <FontAwesomeIcon icon={faShirt} /> Hoodies</button>
          <button type="button" className="tag-chip" onClick={() => searchProducts('Braids')}> <FontAwesomeIcon icon={faSpa} /> Braids</button>
          <button type="button" className="tag-chip" onClick={() => searchProducts('Calculator')}> <FontAwesomeIcon icon={faCalculator} /> Calculators</button>
          <button type="button" className="tag-chip" onClick={() => searchProducts('Desk Fan')}> <FontAwesomeIcon icon={faFan} /> Desk Fan</button>
        </div>

        <div className="hero-stats">
          <div className="stat-card">
            <span className="stat-icon"> 🗳️ </span>
            <div>
              <h3>{products.length}</h3>
              <p>Sample listings in the catalog</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon"> 🤝</span>
            <div>
              <h3>{marketplaceCategoryShortcuts.length}</h3>
              <p>Marketplace categories</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon"> 🛡️</span>
            <div>
              <h3>{locations.reduce((count, group) => count + group.locations.length, 0)}</h3>
              <p>Listed pickup locations</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;