import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBell, faPlus, faShieldHalved } from "../icons";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <header className="navbar-header">
      <div className="navbar-container">

        <div className="nav-brand">
          <span className="brand-icon">
            <FontAwesomeIcon icon={faShieldHalved} />
          </span>
          <h2>KDU Karakatá</h2>
        </div>

        <div className="nav-search">
          <FontAwesomeIcon icon={faSearch} />
          <input type="text" placeholder="Search product" />
        </div>

        <ul className="nav-links">
          <li><a href="/" className="active">Marketplace</a></li>
          <li><a href="/categories">Categories</a></li>
          <li><Link to="/safety">Safety & Rules</Link></li>
          <li><Link to="/vendor-hub">Vendor Hub</Link></li>
        </ul>

        <div className="nav-actions">
          {/* <button className="icon-btn">
            <FontAwesomeIcon icon={faBell} />
            <span className="badge">0</span>
          </button> */}

          <Link to="/signup" className="btn-post" style={{ textDecoration: 'none' }}>
            <FontAwesomeIcon icon={faPlus} /> Sign Up
          </Link>

          <Link to="/signin" className="btn-post" style={{ textDecoration: 'none' }}>
            <FontAwesomeIcon icon={faPlus} /> Sign In
          </Link>
        </div>

      </div>
    </header>
  );
}

export default NavBar;