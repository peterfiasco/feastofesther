import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Toast } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";

// Images
import Pix from "../Images/FEASTOFESTHERIMAGES/1.jpg";
import zip from "../Images/FEASTOFESTHERIMAGES/2.jpg";
import mummy from "../Images/FEASTOFESTHERIMAGES/all.jpg";
import save from "../Images/FEASTOFESTHERIMAGES/flyer1.jpg";
import pg from "../Images/FEASTOFESTHERIMAGES/5.jpg";
// Add the hotel image import - you'll need to add this image to your project
import hotelImage from "../Images/FEASTOFESTHERIMAGES/7.jpg"; // You need to add this image

// CSS
import "./Home.css";

// Lightbox Component
const ImageLightbox = ({ image, alt, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="lightbox-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div 
            className="lightbox-container"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="lightbox-close" onClick={onClose}>
              <span>&times;</span>
            </button>
            <div className="lightbox-image-container">
              <img src={image} alt={alt} className="lightbox-image" />
            </div>
            <div className="lightbox-caption">{alt}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Home = () => {
  const [showToast, setShowToast] = useState(false);
  const [lightbox, setLightbox] = useState({
    isOpen: false,
    image: "",
    alt: ""
  });
  
  const hotelBookingUrl = "https://www.hilton.com/en/book/reservation/rooms/?ctyhocn=IAHWEDT&arrivalDate=2025-07-09&departureDate=2025-07-12&groupCode=CDTFOE&room1NumAdults=1&cid=OM%2CWW%2CHILTONLINK%2CEN%2CDirectLink";
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const copyBookingLink = () => {
    navigator.clipboard.writeText(hotelBookingUrl).then(() => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    });
  };

  const openLightbox = (image, alt) => {
    setLightbox({
      isOpen: true,
      image: image,
      alt: alt
    });
    // Prevent body scrolling when lightbox is open
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightbox({
      ...lightbox,
      isOpen: false
    });
    // Restore body scrolling
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="luxury-home">
      {/* Lightbox Component */}
      <ImageLightbox 
        image={lightbox.image}
        alt={lightbox.alt}
        isOpen={lightbox.isOpen}
        onClose={closeLightbox}
      />

      {/* Toast Notification */}
      <div className="toast-container">
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide>
          <Toast.Body>Booking link copied to clipboard!</Toast.Body>
        </Toast>
      </div>

      {/* Hero Section */}
      <section className="luxury-hero">
        <div className="hero-background">
          <img src={Pix} alt="Feast of Esther" />
        </div>
             
        <div className="home-hero-footer">
          <motion.div
            className="home-footer-content"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="home-title-column">
              <div className="event-badge">July 10-12, 2025</div>
              <h1>
                <span className="title-line">Welcome To</span>
                <span className="title-emphasis">Feast Of Esther</span>
              </h1>
              <div className="title-accent"></div>
            </div>
                     
            <div className="home-description-column">
              <p className="hero-verse">...the kingdom for such is a time as this, Esther 4:14b</p>
              <motion.button
                className="luxury-register-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/registration'}
              >
                <span className="button-text">Register Now</span>
                <span className="button-icon">→</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Hotel Booking Section - NEW */}
      <section className="hotel-booking-section">
        <Container>
          <div className="section-intro content-visible">
            <div className="section-label">Official Accommodation</div>
            <h2 className="section-heading">Reserve Your Stay</h2>
            <div className="heading-line gold"></div>
          </div>
               
          <motion.div
            className="hotel-card"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="hotel-card-content">
              <div className="hotel-image-container">
                <img 
                  src={hotelImage} 
                  alt="DoubleTree by Hilton Houston Westchase" 
                  className="hotel-image"
                  onClick={() => openLightbox(hotelImage, "DoubleTree by Hilton Houston Westchase")}
                  style={{ cursor: 'pointer' }}
                />
                <div className="hotel-badge">Official Hotel</div>
              </div>
                     
              <div className="hotel-details">
                <h3 className="hotel-name">DoubleTree by Hilton Houston Westchase</h3>
                <p className="hotel-address">10609 Westpark Drive, Houston, Texas 77042 USA</p>
                <div className="hotel-features">
                  <span className="feature"><i className="feature-icon">★</i>Conference Venue</span>
                  <span className="feature"><i className="feature-icon">★</i>Special Group Rate</span>
                  <span className="feature"><i className="feature-icon">★</i>Premium Accommodations</span>
                </div>
                <p className="hotel-description">
                  Experience comfort and convenience at our official hotel for Feast of Esther 2025. Enjoy special rates for our attendees when booking through the official link.
                </p>
                <div className="hotel-actions">
                  <motion.a
                    href={hotelBookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="book-now-button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>Book Your Room</span>
                    <i className="button-icon">→</i>
                  </motion.a>
                  <motion.button
                    className="copy-link-button"
                    onClick={copyBookingLink}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>Copy Booking Link</span>
                    <i className="copy-icon">📋</i>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* About Section */}
      <section className="mission-section">
        <Container>
          <div className="section-intro content-visible">
            <div className="section-label">Our Purpose</div>
            <h2 className="section-heading">Discover Our Mission</h2>
            <div className="heading-line"></div>
          </div>
                       
          <Row className="content-cards">
            <Col lg={4} md={6} className="card-column content-visible">
              <div className="luxury-card">
                <div className="card-top">
                  <div className="image-frame">
                    <img 
                      src={zip} 
                      alt="About Us" 
                      onClick={() => openLightbox(zip, "About Us")}
                      className="clickable-image"
                    />
                    <div className="image-zoom-icon">
                      <i className="fas fa-search-plus"></i>
                    </div>
                  </div>
                  <span className="card-tag">About</span>
                </div>
                <div className="card-body">
                  <h3 className="card-title">About Us</h3>
                  <p className="card-text">
                    Feast of Esther is an annual Feast organized by the wife
                    of the General Overseer of the Redeemed Christian church
                    of God Pastor (Mrs.) Folu Adeboye.
                  </p>
                  <a href="/about" className="text-link">
                    <span>Read More</span>
                    <i className="link-arrow">→</i>
                  </a>
                </div>
              </div>
            </Col>
            <Col lg={4} md={6} className="card-column scroll-reveal">
              <div className="luxury-card">
                <div className="card-top">
                  <div className="image-frame">
                    <img 
                      src={mummy} 
                      alt="The Visioner" 
                      onClick={() => openLightbox(mummy, "The Visioner")}
                      className="clickable-image"
                    />
                    <div className="image-zoom-icon">
                      <i className="fas fa-search-plus"></i>
                    </div>
                  </div>
                  <span className="card-tag">Leader</span>
                </div>
                <div className="card-body">
                  <h3 className="card-title">The Visioner</h3>
                  <p className="card-text">
                    Pastor Mrs Folu Adeboye is the wife of the General
                    Overseer of the Redeemed Christian Church of God (RCCG)
                    Worldwide.
                  </p>
                  <a href="/founder" className="text-link">
                    <span>Read More</span>
                    <i className="link-arrow">→</i>
                  </a>
                </div>
              </div>
            </Col>
            <Col lg={4} md={6} className="card-column scroll-reveal">
              <div className="luxury-card highlight">
                <div className="card-top">
                  <div className="image-frame">
                    <img 
                      src={save} 
                      alt="2025 Event" 
                      onClick={() => openLightbox(save, "2025 Event")}
                      className="clickable-image"
                    />
                    <div className="image-zoom-icon">
                      <i className="fas fa-search-plus"></i>
                    </div>
                  </div>
                  <span className="card-tag event">2025</span>
                </div>
                <div className="card-body">
                  <h3 className="card-title">Feast Of Esther 2025</h3>
                  <p className="card-text">
                    Feast of Esther Annual Conference<br />
                    <strong>Date:</strong> 10th – 12th July, 2025<br />
                    <strong>Venue:</strong> Double Tree by Hiltonn Westchase, 10609 Westpark Dr, Houston 77042<br />
                    <strong>Disney trip:</strong> Wednesday July 2025
                  </p>
                  <a href="/events" className="text-link">
                    <span>Read More</span>
                    <i className="link-arrow">→</i>
                  </a>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Vision Section */}
      <section className="vision-section">
        <div className="vision-parallax">
          <img src={pg} alt="Our Vision" />
        </div>
             
        <div className="vision-footer-container">
          <div className="vision-footer-content">
            <div className="vision-title-column">
              <div className="vision-badge">Our Purpose</div>
              <h2>Our Vision</h2>
              <div className="vision-accent"></div>
            </div>
                     
            <div className="vision-description-column">
              <p>
                To develop excellent Ministry Skills in women who are called to
                support and impact the church of God for nation building and
                stand as pillars in the house of God to accomplish great things
                for the kingdom.
              </p>
                               
              <div className="vision-actions">
                <button
                  className="vision-button"
                  onClick={() => window.location.href = '/about'}
                >
                  <span>Learn More About Our Mission</span>
                  <i className="arrow-icon">→</i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

            {/* Call To Action */}
            <section className="cta-block scroll-reveal">
        <Container>
          <div className="cta-wrapper">
            <div className="cta-box">
              <h2 className="cta-heading">Join Us at the Feast of Esther 2025</h2>
              <p className="cta-text">Be part of this transformative experience that combines spiritual growth, fellowship, and empowerment.</p>
              <div className="cta-actions">
                <button className="luxury-button primary" onClick={() => window.location.href = '/registration'}>
                  <span className="button-text">Register Now</span>
                  <span className="button-icon">→</span>
                </button>
                <button className="luxury-button secondary" onClick={() => window.location.href = '/donate'}>
                  <span className="button-text">Donate</span>
                  <span className="button-icon">→</span>
                </button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Home;
