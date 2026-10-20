import React from 'react'
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <div>
            <footer className="footer">
                <div className="container footer-content">
                    <div className="footer-brand">
                        <div className="logo">Karakatá</div>
                        <p>A campus marketplace catalog for students, staff, and local vendors.</p>
                    </div>

                    <div className="footer-links">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link to="/#home">Home</Link></li>
                            <li><Link to="/#explore">Explore listings</Link></li>
                            <li><Link to="/#categories">Categories</Link></li>
                            <li><Link to="/vendor-hub">Vendor Hub</Link></li>
                        </ul>
                    </div>

                    <div className="footer-links">
                        <h4>Safety & Support</h4>
                        <ul>
                            <li><Link to="/safety">Safety rules</Link></li>
                            <li><Link to="/vendor-hub">Vendor Hub</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2026 Karakatá. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}

export default Footer