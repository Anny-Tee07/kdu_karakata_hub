import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlus, faShieldHalved } from "../icons";
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { cleanSearchQuery } from "../utils/search";
import { useAuth } from '../auth/useAuth';

function NavBar() {
  const { configured, user, profile, loading, profileLoading, profileError, signOut } = useAuth();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [accountError, setAccountError] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const cleanedQuery = cleanSearchQuery(searchQuery);

    const nextParams = new URLSearchParams();
    if (cleanedQuery) {
      nextParams.set('search', cleanedQuery);
    }
    const location = searchParams.get('location');
    if (location) {
      nextParams.set('location', location);
    }
    navigate(`/categories${nextParams.size ? `?${nextParams.toString()}` : ''}`);
  };

  const handleSignOut = async () => {
    setAccountError('');
    try {
      const { error } = await signOut();
      if (error) {
        setAccountError(`Could not sign out: ${error.message}`);
      }
    } catch (error) {
      setAccountError(`Could not sign out: ${error.message}`);
    }
  };

  const displayName = profile?.display_name || profile?.username || user?.email || 'Account';

  return (
    <header className="navbar-header">
      <div className="navbar-container">

        <Link to="/" className="nav-brand" style={{ textDecoration: 'none', color: 'inherit' }}>
          <span className="brand-icon">
            <FontAwesomeIcon icon={faShieldHalved} />
          </span>
          <h2>KDU Karakatá</h2>
        </Link>

        <form onSubmit={handleSearchSubmit} className="nav-search" role="search">
          <input
            type="search"
            placeholder="Search product..."
            aria-label="Search products"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-submit-btn" aria-label="Search">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </form>

        <ul className="nav-links">
          <li><NavLink to="/" end>Marketplace</NavLink></li>
          <li><NavLink to="/categories">Categories</NavLink></li>
          <li><Link to="/safety">Safety & Rules</Link></li>
          <li><Link to="/vendor-hub">Vendor Hub</Link></li>
        </ul>

        <div className="nav-actions">
          {!loading && !user && (
            <>
              <Link to="/signup" className="btn-post" style={{ textDecoration: 'none' }}>
                <FontAwesomeIcon icon={faPlus} /> Sign Up
              </Link>
              <Link to="/signin" className="btn-post" style={{ textDecoration: 'none' }}>
                <FontAwesomeIcon icon={faPlus} /> Sign In
              </Link>
            </>
          )}
          {loading && <span className="account-loading" role="status">Restoring session…</span>}
          {user && (profileLoading || (!profile && !profileError)) && (
            <span className="account-loading" role="status">Loading account…</span>
          )}
          {user && profileError && (
            <span className="navbar-auth-error" role="alert">
              {profileError}
              <button type="button" onClick={handleSignOut}>Sign out</button>
            </span>
          )}
          {user && profile && (
            <details className="nav-account-menu">
              <summary>{displayName}</summary>
              <div className="nav-account-options">
                <Link to="/profile">Profile</Link>
                <Link to="/my-listings">My Listings</Link>
                {profile.role === 'admin' && <Link to="/admin">Admin Dashboard</Link>}
                <button type="button" onClick={handleSignOut}>Sign Out</button>
              </div>
            </details>
          )}
          {!configured && <span className="auth-not-configured">Auth setup required</span>}
        </div>

      </div>
      {accountError && <p className="navbar-auth-error" role="alert">{accountError}</p>}
    </header>
  );
}

export default NavBar;