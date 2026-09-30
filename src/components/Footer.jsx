import React from 'react'

function Footer() {
    return (
        <div>
            <footer class="footer">
                <div class="container footer-content">
                    <div class="footer-brand">
                        <div class="logo">Karakatá</div>
                        <p>The trusted marketplace connecting students, creators,  <br />and local vendors in one simple hub.</p>
                    </div>

                    <div class="footer-links">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="#home">Home</a></li>
                            <li><a href="#explore">Explore</a></li>
                            <li><a href="#categories">Categories</a></li>
                            <li><a href="#sell">Start Selling</a></li>
                        </ul>
                    </div>

                    <div class="footer-links">
                        <h4>Support & Info</h4>
                        <ul>
                            <li><a href="#help">Help Center</a></li>
                            <li><a href="#terms">Terms of Service</a></li>
                            <li><a href="#privacy">Privacy Policy</a></li>
                            <li><a href="#contact">Contact Us</a></li>
                        </ul>
                    </div>
                </div>

                <div class="footer-bottom">
                    <p>&copy; 2026 Karakatá. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}

export default Footer