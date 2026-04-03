import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-about">
          <h2>Quaid-i-Azam University</h2>
          <p>Islamabad, Pakistan</p>
          <p>Excellence in Education & Research</p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/admissions">Admissions</a></li>
            <li><a href="/faculties">Faculties</a></li>
            <li><a href="/research">Research</a></li>
            <li><a href="/contact">Contact Us</a></li>
          </ul>
        </div>


        <div className="footer-contact">
          <h3>Contact</h3>
          <p>Email: info@qau.edu.pk</p>
          <p>Phone: +92-51-9064-0000</p>
          <div className="footer-social">
            <a href="https://facebook.com/qauofficial">Facebook</a>
            <a href="https://twitter.com/qau_official">Twitter</a>
            <a href="https://instagram.com/qauofficial">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
