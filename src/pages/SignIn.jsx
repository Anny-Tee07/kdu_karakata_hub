import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";

function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = (e) => {
    e.preventDefault();
    
    // Save login state and redirect back to home
    sessionStorage.setItem('isLoggedIn', 'true');
    window.location.href = '/';
  };

  return (
    <div>
      <Navbar />
      <main className="category-page-container" style={{ maxWidth: '500px', margin: '40px auto', padding: '0 20px' }}>
        <Link className="category-back-link" to="/">&larr; Back to Home</Link>
        
        <header className="category-page-header" style={{ marginBottom: '24px' }}>
          <h1 className="category-page-title">Sign In to KDU Karakatá</h1>
          <p>Welcome back, student trader!</p>
        </header>

        <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Campus Email / ID</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="e.g. student@koladaisiuniversity.edu.ng" 
              required
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••" 
              required
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <button type="submit" className="card-action-btn accent" style={{ padding: '12px', marginTop: '10px', cursor: 'pointer', fontWeight: '600' }}>
            Sign In
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}

export default SignIn;