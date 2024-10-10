import React from 'react';
import './customer_footer.css'; // Importing the CSS file

function CustomerFooter() {
    return (
        <footer className="footer">
            <div className="footer-container">
                {/* About Section */}
                <div className="footer-section">
                    <h3 className="footer-title">About Us</h3>
                    <p style={{marginRight:'60px'}}>we offer exceptional healthcare services tailored to your unique needs. Our team of dedicated professionals is here to provide comprehensive, compassionate care for any of your health concerns, ensuring you receive the best treatment possible. From preventive care to specialized treatment plans.</p>
                </div>

                {/* Quick Links Section */}
                <div className="footer-section" style={{marginLeft:'100px'}}>
                    <h3 className="footer-title">Quick Links</h3>
                    <ul className="footer-links">
                        <li><a href="/bookings">Home</a></li>
                        <li><a href="/make-appointment">Make Appointment</a></li>
                        <li><a href="/view-articles">Education Resources</a></li>
                        <li><a href="/transportation">Services</a></li>
                        <li><a href="/reviews">About Us</a></li>
                        <li><a href="/reviews">Contact Us</a></li>
                    </ul>
                </div>

                {/* Contact & Social Media */}
                <div className="footer-section">
                    <h3 className="footer-title">Contact Us</h3>
                    <p>Email: tenethealth@gmail.com</p>
                    <p>Phone: +94-51-2242863</p>

                    {/* Social Media Links */}
                    <div className="footer-social">
                        <a href="#">Facebook</a>
                        <a href="#">Twitter</a>
                        <a href="#">Instagram</a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                &copy; {new Date().getFullYear()} Tenet Health. All Rights Reserved.
            </div>
        </footer>
    );
}

export default CustomerFooter;
