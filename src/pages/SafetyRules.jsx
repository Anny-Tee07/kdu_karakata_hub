import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from "../components/NavBar";

function SafetyRules() {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <main className="category-page-container">
        <Link className="category-back-link" to="/">
          &larr; Back to Marketplace Home
        </Link>

        <header className="category-page-header">
          <span className="section-tag">Campus Safety</span>
          <h1 className="category-page-title">Safety & Rules</h1>
          <p>Guidelines for secure trading across campus hostels and faculties.</p>
        </header>

        <div className="safety-content-wrapper">
          <div className="safety-card">
            <h3>1. Designated Handover Zones</h3>
            <p>Meet only in safe campus areas like the Main Cafeteria, Student Center, or Hall Entrances.</p>
          </div>

          <div className="safety-card">
            <h3>2. Inspect Before You Pay</h3>
            <p>Always verify physical items or confirm service details before releasing payment to vendors.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SafetyRules;