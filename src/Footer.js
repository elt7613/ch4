import React from 'react';
import './CSS/Footer.css'; // Move footer-specific CSS here


{/* ========= Section 3 Footer ========================= */}
const Footer = () => {
    return (
<footer className="footer">
<div className="footer-container">
  <div className="footer-section about">
    <h2>About Us</h2>
    <p>We are dedicated to addressing climate change through technology and innovation.</p>
  </div>
  <div className="footer-section contact">
    <h2>Contact Details</h2>
    <p>Email: info@climatechange.org</p>
    <p>Phone: +1 (555) 123-4567</p>
  </div>
  <div className="footer-section datasets">
    <h2>Datasets</h2>
    <p>Find our datasets <a href="/datasets">here</a>.</p>
  </div>
  <div className="footer-section references">
    <h2>References</h2>
    <p>View our references <a href="/references">here</a>.</p>
  </div>
  <div className="footer-section apis">
    <h2>APIs Used</h2>
    <p>Explore the APIs we used <a href="/apis">here</a>.</p>
  </div>
  <div className="footer-section tech-stack">
    <h2>Tech Stack</h2>
    <p>React, Node.js, Express, MongoDB, and more.</p>
  </div>
  <div className="footer-section features">
    <h2>Features</h2>
    <p>Interactive visualizations, data analysis, and user engagement.</p>
  </div>
  <div className="footer-section hackathons">
    <h2>Hackathons</h2>
    <p>Participated in various hackathons to innovate solutions.</p>
  </div>
</div>
<div className="footer-bottom">
  <p>&copy; {new Date().getFullYear()} CH4. All rights reserved.</p>
</div>
</footer>
    );
};
export default Footer;