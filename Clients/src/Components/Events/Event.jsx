import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Toast } from "react-bootstrap";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./Event.css";

// Images
import heroImage from "../Images/FEASTOFESTHERIMAGES/Main2.jpg";
import flyerImage from "../Images/FEASTOFESTHERIMAGES/flyer1.jpg";
// Add the hotel image import
import hotelImage from "../Images/FEASTOFESTHERIMAGES/7.jpg"; // You need to add this image

const Event = () => {
  const [showToast, setShowToast] = useState(false);
  const hotelBookingUrl = "https://www.hilton.com/en/book/reservation/rooms/?ctyhocn=IAHWEDT&arrivalDate=2025-07-09&departureDate=2025-07-12&groupCode=CDTFOE&room1NumAdults=1&cid=OM%2CWW%2CHILTONLINK%2CEN%2CDirectLink";
  
  // Animation variants
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const copyBookingLink = () => {
    navigator.clipboard.writeText(hotelBookingUrl).then(() => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    });
  };
  
  const scheduleItems = [
    {
      day: "Day 1",
      date: "July 10, 2025",
      title: "Welcome Reception",
      description: "Opening ceremony, worship service, and fellowship dinner"
    },
    {
      day: "Day 2",
      date: "July 10, 2025",
      title: "Leadership Workshop",
      description: "Workshops, panel discussions, and prophetic sessions"
    },
    {
      day: "Day 3",
      date: "July 11, 2025",
      title: "Ministry Empowerment",
      description: "Training, group activities, and special prayer service"
    },
    {
      day: "Day 4",
      date: "July 12, 2025",
      title: "Closing Celebration",
      description: "Final service, testimonies, and commissioning"
    }
  ];

  return (
    <div className="event-page">
      {/* Toast Notification */}
      <div className="toast-container">
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide>
          <Toast.Body>Booking link copied to clipboard!</Toast.Body>
        </Toast>
      </div>
      
      {/* Hero Section */}
      <section className="event-hero">
        <div className="hero-background">
          <img src={heroImage} alt="Feast of Esther Event" />
        </div>
        
        <div className="event-hero-footer">
          <motion.div
            className="event-footer-content"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="event-info-column">
              <div className="event-badge">July 10-12, 2025</div>
              <h1>FEAST OF ESTHER 2025</h1>
              <div className="title-accent"></div>
            </div>
                
            <div className="event-description-column">
              <p>
                An exclusive forum for the first lady in ministry & Christian organizations.
                Join us for this transformative gathering of women in leadership.
              </p>
                    
              <motion.div
                className="register-button-container"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  className="hero-register-button"
                  onClick={() => window.location.href = '/registration'}
                >
                  Register Now <span className="button-arrow">→</span>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Event Details Section */}
      <section className="event-details">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="details-container"
          >
            <Row className="align-items-center">
              <Col lg={6} md={6} className="mb-4 mb-md-0">
                <motion.div
                  className="event-flyer"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                >
                  <img src={flyerImage} alt="Event Flyer" className="img-fluid" />
                  <div className="flyer-overlay">
                    <div className="overlay-text">Official Event Flyer</div>
                  </div>
                </motion.div>
              </Col>
                        
              <Col lg={6} md={6}>
                <motion.div
                  className="event-info"
                  variants={fadeInUp}
                >
                  <div className="section-label">Event Information</div>
                  <h2>Standing On My Watch</h2>
                  <p className="theme-reference">Habakkuk 2:1</p>
                                
                  <div className="event-details-grid">
                    <div className="detail-item">
                      <div className="detail-icon">
                        <i className="far fa-calendar-alt"></i>
                      </div>
                      <div className="detail-content">
                        <h4>Date</h4>
                        <p>July 10-12, 2025</p>
                      </div>
                    </div>
                                    
                    <div className="detail-item">
                      <div className="detail-icon">
                        <i className="fas fa-map-marker-alt"></i>
                      </div>
                      <div className="detail-content">
                        <h4>Venue</h4>
                        <p>Double Tree by Hiltonn Westchase,<br />10609 Westpark Dr, Houston 77042</p>
                      </div>
                    </div>
                                    
                    <div className="detail-item">
                      <div className="detail-icon">
                        <i className="fas fa-users"></i>
                      </div>
                      <div className="detail-content">
                        <h4>Who Should Attend</h4>
                        <p>Women in ministry leadership, pastors' wives, and ministry leaders</p>
                      </div>
                    </div>
                  </div>
                                
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="register-button-container"
                  >
                    <Link to="/registration" className="register-button">
                      Register for this Event
                    </Link>
                  </motion.div>
                </motion.div>
              </Col>
            </Row>
          </motion.div>
        </Container>
      </section>
      
      {/* Hotel Booking Section - NEW */}
      <section className="hotel-accommodation-section">
        <Container>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="section-header"
          >
            <div className="elegant-divider">
              <span className="divider-icon">✦</span>
            </div>
            <h2 className="accommodation-title">Official Conference Hotel</h2>
            <p className="accommodation-subtitle">Experience comfort and elegance at our designated hotel</p>
          </motion.div>
          
          <motion.div
            className="hotel-showcase"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Row className="align-items-stretch">
              <Col lg={7} md={12} className="mb-4 mb-lg-0">
                <motion.div 
                  className="hotel-presentation"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="hotel-image-wrapper">
                    <img src={hotelImage} alt="DoubleTree by Hilton Houston Westchase" className="hotel-showcase-image" />
                    <div className="hotel-image-overlay">
                      <span className="hotel-brand-badge">HILTON</span>
                    </div>
                  </div>
                  
                  <div className="hotel-gallery-indicators">
                    <span className="indicator active"></span>
                    <span className="indicator"></span>
                    <span className="indicator"></span>
                  </div>
                </motion.div>
              </Col>
              
              <Col lg={5} md={12}>
                <div className="hotel-information">
                  <div className="hotel-name-wrapper">
                    <motion.h3 
                      className="hotel-name"
                      initial={{ x: 20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      viewport={{ once: true }}
                    >
                      DoubleTree by Hilton
                      <span className="hotel-location">Houston Westchase</span>
                    </motion.h3>
                  </div>
                  
                  <motion.div 
                    className="hotel-rating"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    viewport={{ once: true }}
                  >
                    <span className="star">★</span>
                    <span className="star">★</span>
                    <span className="star">★</span>
                    <span className="star">★</span>
                    <span className="star-empty">★</span>
                    <span className="rating-text">Conference Venue</span>
                  </motion.div>
                  
                  <motion.div 
                    className="hotel-address"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <i className="fas fa-map-marker-alt address-icon"></i>
                    <span className="address-text">10609 Westpark Drive, Houston, Texas 77042 USA</span>
                  </motion.div>
                  
                  <motion.div 
                    className="hotel-amenities"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <div className="amenity-item">
                      <i className="fas fa-wifi amenity-icon"></i>
                      <span className="amenity-text">Free WiFi</span>
                    </div>
                    <div className="amenity-item">
                      <i className="fas fa-parking amenity-icon"></i>
                      <span className="amenity-text">Parking</span>
                    </div>
                    <div className="amenity-item">
                      <i className="fas fa-utensils amenity-icon"></i>
                      <span className="amenity-text">Restaurant</span>
                    </div>
                    <div className="amenity-item">
                      <i className="fas fa-swimming-pool amenity-icon"></i>
                      <span className="amenity-text">Pool</span>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    className="reservation-notice"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    viewport={{ once: true }}
                  >
                    <p>Special group rates available for Feast of Esther attendees when booking through our official link below.</p>
                  </motion.div>
                  
                  <motion.div
                    className="booking-actions"
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    viewport={{ once: true }}
                  >
                    <motion.a
                      href={hotelBookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="book-hotel-button"
                      whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Book Your Stay
                      <i className="fas fa-arrow-right button-icon"></i>
                    </motion.a>
                    
                    <motion.button
                      className="copy-booking-link"
                      onClick={copyBookingLink}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <i className="fas fa-copy copy-icon"></i>
                      Copy Link
                    </motion.button>
                  </motion.div>
                </div>
              </Col>
            </Row>
          </motion.div>
        </Container>
      </section>

            {/* Event Schedule Section */}
            <section className="event-schedule">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
            className="section-heading"
          >
            <h2>Event Schedule</h2>
            <div className="heading-underline"></div>
            <p className="section-subheading">
              Join us for four days of inspiration, teaching, fellowship, and spiritual growth
            </p>
          </motion.div>
                
          <div className="schedule-timeline">
            {scheduleItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
              >
                <div className="timeline-content">
                  <div className="day-label">{item.day}</div>
                  <h3>{item.title}</h3>
                  <div className="date">{item.date}</div>
                  <p>{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="event-cta">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="cta-container"
          >
            <h2>Ready to Join Us?</h2>
            <p>Please ensure you complete your registration. For inquiries, visit our contact page.</p>
            <div className="cta-buttons">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/registration" className="cta-button primary">
                  Register Now
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/contact" className="cta-button secondary">
                  Contact Us
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
};

export default Event;
