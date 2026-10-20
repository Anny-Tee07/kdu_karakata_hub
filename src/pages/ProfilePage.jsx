import { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/NavBar';
import ProtectedRoute from '../auth/ProtectedRoute';
import { useAuth } from '../auth/useAuth';
import { supabase } from '../lib/supabase';

function ProfileContent() {
    const { user, profile, refreshProfile } = useAuth();
    const [displayName, setDisplayName] = useState(profile.display_name);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    const saveProfile = async (event) => {
        event.preventDefault();
        setMessage('');
        setError('');
        const nextDisplayName = displayName.trim();
        if (nextDisplayName.length < 2 || nextDisplayName.length > 80) {
            setError('Display name must be between 2 and 80 characters.');
            return;
        }
        setSaving(true);
        try {
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ display_name: nextDisplayName })
                .eq('id', user.id);
            if (updateError) {
                setError(updateError.message);
                return;
            }
            await refreshProfile();
            setMessage('Profile updated.');
        } catch (updateError) {
            setError(`Could not update your profile: ${updateError.message}`);
        } finally {
            setSaving(false);
        }
    };

    return (
        <main className="category-page-container">
            <Link className="category-back-link" to="/">← Back to marketplace</Link>
            <header className="category-page-header">
                <span className="section-tag">Account</span>
                <h1 className="category-page-title">Profile</h1>
            </header>
            <form className="seller-listing-form profile-form" onSubmit={saveProfile}>
                <label>
                    Username
                    <input value={profile.username} readOnly />
                </label>
                <label>
                    Email
                    <input value={user.email || ''} readOnly />
                </label>
                <label>
                    Display name
                    <input
                        value={displayName}
                        onChange={(event) => setDisplayName(event.target.value)}
                        maxLength="80"
                        required
                    />
                </label>
                {error && <p className="form-error" role="alert">{error}</p>}
                {message && <p className="account-status-message" role="status">{message}</p>}
                <div className="seller-form-actions">
                    <button className="btn-post" type="submit" disabled={saving}>
                        {saving ? 'Saving…' : 'Save Profile'}
                    </button>
                </div>
            </form>
        </main>
    );
}

function ProfilePage() {
    return (
        <>
            <Navbar />
            <ProtectedRoute><ProfileContent /></ProtectedRoute>
            <Footer />
        </>
    );
}

export default ProfilePage;
