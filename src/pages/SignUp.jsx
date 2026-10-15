import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";

function SignUp() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        accountType: 'Buyer',
        password: '',
        confirmPassword: '',
        agreeTerms: false
    });
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSignUp = (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (formData.password !== formData.confirmPassword) {
            setErrorMessage('Passwords do not match!');
            return;
        }

        if (!formData.agreeTerms) {
            setErrorMessage('You must agree to the Safety Rules & Terms.');
            return;
        }

        sessionStorage.setItem('isLoggedIn', 'true');
        window.location.href = '/';
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

                {errorMessage && (
                    <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: '6px', fontSize: '0.875rem', marginBottom: '16px', border: '1px solid #fca5a5' }}>
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="e.g. Tinuayo Ososanwo"
                            required
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Campus Email / ID</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="student@koladaisiuniversity.edu.ng"
                            required
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>I want to join as a:</label>
                        <select
                            name="accountType"
                            value={formData.accountType}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff' }}
                        >
                            <option value="Buyer">Buyer</option>
                            <option value="Vendor">Vendor</option>
                            <option value="Both">Both (Buyer & Vendor)</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
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

                    <button type="submit" className="card-action-btn accent" style={{ padding: '12px', marginTop: '10px', cursor: 'pointer', fontWeight: '600' }}>
                        Register & Continue
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.875rem', color: '#64748b' }}>
                    Already have an account? <Link to="/signin" style={{ color: '#16a34a', fontWeight: '600' }}>Sign In</Link>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default SignUp;