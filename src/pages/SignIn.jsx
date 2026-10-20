import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { useAuth } from '../auth/useAuth';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSubmitting(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signInError) {
        setError(signInError.message || 'Sign-in failed. Check your email and password.');
        return;
      }
      setPassword('');
      navigate('/');
    } catch (signInError) {
      setError(`Could not contact the authentication service: ${signInError.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <Navbar />
      <main className="category-page-container" style={{ maxWidth: '500px', margin: '40px auto', padding: '0 20px' }}>
        <Link className="category-back-link" to="/">&larr; Back to Home</Link>
        
        <header className="category-page-header" style={{ marginBottom: '24px' }}>
          <h1 className="category-page-title">Sign In to KDU Karakatá</h1>
          <p>Sign in to manage your account and listings.</p>
        </header>

        {!isSupabaseConfigured ? (
          <p className="account-status-message" role="status">
            Authentication is not configured. Add the Supabase project URL and public anon/publishable key
            to your ignored local <code>.env.local</code> file before entering credentials.
          </p>
        ) : (
        <>
        {message && <p className="account-status-message" role="status">{message}</p>}
        {error && <p className="form-error" role="alert">{error}</p>}
        <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label htmlFor="signinEmail" style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Email address</label>
            <input
              type="email"
              id="signinEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div>
            <label htmlFor="signinPassword" style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Password</label>
            <input 
              type="password" 
              id="signinPassword"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••" 
              required
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <button type="submit" className="card-action-btn accent" style={{ padding: '12px', marginTop: '10px', cursor: 'pointer', fontWeight: '600' }}>
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        </>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default SignIn;