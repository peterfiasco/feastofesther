// src/components/Footer.js
import React from "react";
import "./Footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faTiktok,
  faFacebook,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="social-section">
          <h6 className="follow-text">Follow Us: </h6>
          <div className="social-icons">
            <a href="https://www.instagram.com/feast_of_esther_na" className="social-icon" aria-label="Instagram">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href="https://www.tiktok.com/@feastofestherna" className="social-icon" aria-label="TikTok">
              <FontAwesomeIcon icon={faTiktok} />
            </a>
            <a href="https://www.facebook.com/groups/feastofestherna/" className="social-icon" aria-label="Facebook">
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a href="https://www.youtube.com/@feastofesther5437" className="social-icon" aria-label="YouTube">
              <FontAwesomeIcon icon={faYoutube} />
            </a>
          </div>
        </div>
        <div className="copyright">
          <p>Copyright 2025 &copy; FeastOfEstherNA</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
