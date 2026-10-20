import { Link, Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';

function ProtectedRoute({ children, requireAdmin = false }) {
    const { configured, user, profile, loading, profileLoading, profileError } = useAuth();

    if (!configured) {
        return (
            <main className="category-page-container">
                <h1 className="category-page-title">Backend setup required</h1>
                <p className="account-status-message">
                    Configure Supabase and apply the database migrations before accessing protected pages.
                </p>
                <Link to="/">Return to the marketplace</Link>
            </main>
        );
    }
    if (loading || (user && profileLoading)) {
        return <main className="category-page-container" role="status">Loading account…</main>;
    }
    if (!user) {
        return <Navigate to="/signin" replace />;
    }
    if (profileError) {
        return (
            <main className="category-page-container">
                <p className="form-error" role="alert">{profileError}</p>
            </main>
        );
    }
    if (!profile || profile.is_suspended) {
        return (
            <main className="category-page-container">
                <p className="form-error" role="alert">
                    This account cannot access marketplace management.
                </p>
            </main>
        );
    }
    if (requireAdmin && profile.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;
