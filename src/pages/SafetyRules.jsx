import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";

function SafetyRules() {
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
            <p>Agree on a busy public meeting place directly with the other person. Demo listing locations do not confirm a seller's address or presence.</p>
          </div>

          <div className="safety-card">
            <h3>2. Inspect Before You Pay</h3>
            <p>Always verify physical items or confirm service details before releasing payment to vendors.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default SafetyRules;