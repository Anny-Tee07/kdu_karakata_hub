import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div>
            <Navbar />
            <main className="category-page-container not-found-page">
                <span className="section-tag">Page not found</span>
                <h1 className="category-page-title">We couldn't find that page.</h1>
                <p>Check the address or return to the marketplace to browse current listings.</p>
                <Link className="btn-post vendor-back-button" to="/">
                    Go to marketplace
                </Link>
            </main>
            <Footer />
        </div>
    );
}

export default NotFound;
