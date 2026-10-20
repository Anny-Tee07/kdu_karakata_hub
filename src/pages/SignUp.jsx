import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import { isSupabaseConfigured, supabase } from '../lib/supabase';

function SignUp() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setStatusMessage('');

        if (formData.password !== formData.confirmPassword) {
            setErrorMessage('Passwords do not match!');
            return;
        }

        if (!formData.agreeTerms) {
            setErrorMessage('You must agree to the Safety Rules & Terms.');
            return;
        }

        if (!/^[a-zA-Z0-9_]{3,32}$/.test(formData.username)) {
            setErrorMessage('Username must be 3–32 characters using letters, numbers, or underscores.');
            return;
        }

        setSubmitting(true);
        try {
            const { data, error } = await supabase.auth.signUp({
                email: formData.email.trim(),
                password: formData.password,
                options: {
                    data: {
                        username: formData.username.trim(),
                        display_name: formData.fullName.trim(),
                    },
                },
            });
            if (error) {
                setErrorMessage(error.message);
                return;
            }

            setFormData((current) => ({ ...current, password: '', confirmPassword: '' }));
            setStatusMessage(data.session
                ? 'Your account was created and you are signed in.'
                : 'Account created. Check your email for the confirmation link before signing in.');
            if (data.session) {
                navigate('/');
            }
        } catch (error) {
            setErrorMessage(`Could not contact the authentication service: ${error.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <Navbar />
            <main className="category-page-container" style={{ maxWidth: '500px', margin: '40px auto', padding: '0 20px' }}>
                <Link className="category-back-link" to="/">&larr; Back to Home</Link>

                <header className="category-page-header" style={{ marginBottom: '24px' }}>
                    <h1 className="category-page-title">Create Account</h1>
                    <p>Join the KDU Karakatá campus marketplace community.</p>
                </header>

                {!isSupabaseConfigured && (
                    <p className="account-status-message" role="status">
                        Authentication is not configured. Add the Supabase project URL and public
                        anon/publishable key to your ignored local <code>.env.local</code> file before registering.
                    </p>
                )}
                {statusMessage && <p className="account-status-message" role="status">{statusMessage}</p>}

                {errorMessage && (
                    <div role="alert" style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: '6px', fontSize: '0.875rem', marginBottom: '16px', border: '1px solid #fca5a5' }}>
                        {errorMessage}
                    </div>
                )}

                {isSupabaseConfigured && <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label htmlFor="fullName" style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Full Name</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="e.g. Tinuayo Ososanwo"
                            minLength="2"
                            maxLength="80"
                            required
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        />
                    </div>

                    <div>
                        <label htmlFor="signupUsername" style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Username</label>
                        <input
                            type="text"
                            id="signupUsername"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            autoComplete="username"
                            minLength="3"
                            maxLength="32"
                            pattern="[A-Za-z0-9_]{3,32}"
                            required
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        />
                    </div>

                    <div>
                        <label htmlFor="signupEmail" style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Campus Email / ID</label>
                        <input
                            type="email"
                            id="signupEmail"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="student@koladaisiuniversity.edu.ng"
                            required
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        />
                    </div>

                    <div>
                        <label htmlFor="signupPassword" style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Password</label>
                        <input
                            type="password"
                            id="signupPassword"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            minLength="12"
                            maxLength="72"
                            required
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                            minLength="12"
                            maxLength="72"
                            required
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
                        <input
                            type="checkbox"
                            name="agreeTerms"
                            id="agreeTerms"
                            checked={formData.agreeTerms}
                            onChange={handleChange}
                        />
                        <label htmlFor="agreeTerms">I agree to the <Link to="/safety" style={{ color: '#16a34a' }}>Safety Rules & Terms</Link></label>
                    </div>

                    <button disabled={submitting} type="submit" className="card-action-btn accent" style={{ padding: '12px', marginTop: '10px', cursor: 'pointer', fontWeight: '600' }}>
                    {submitting ? 'Creating account…' : 'Create account'}
                    </button>
                </form>}

                <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.875rem', color: '#64748b' }}>
                    Already have an account? <Link to="/signin" style={{ color: '#16a34a', fontWeight: '600' }}>Sign In</Link>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default SignUp;