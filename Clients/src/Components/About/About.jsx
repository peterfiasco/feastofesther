import React, { useEffect } from "react";
import "./About.css";
import imag from "../Images/FEASTOFESTHERIMAGES/3.jpeg";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";

function About() {
  // Fade-in animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const staggerItems = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="about-page">
      {/* Hero Section */}
      {/* Hero Section */}
<section className="about-hero">
  <div className="hero-background">
    <img src={imag} alt="Feast of Esther About" />
  </div>
  
  <div className="hero-footer-wrapper">
    <motion.div 
      className="hero-footer-content"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="hero-footer-left">
        <h1>About Feast of Esther</h1>
        <div className="title-accent"></div>
      </div>
      
      <div className="hero-footer-right">
        <p>
          A divine gathering of women in ministry, organized by Pastor (Mrs.) Folu Adeboye,
          wife of the General Overseer of the Redeemed Christian Church of God.
        </p>
        <motion.div 
          className="scroll-indicator"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <span>Discover Our Story</span>
          <i className="arrow-down">↓</i>
        </motion.div>
      </div>
    </motion.div>
  </div>
</section>


      {/* Main Content Section */}
      <section className="about-content">
        <Container>
          {/* Three Cards Row */}
          <Row className="mb-4">
            {/* Introduction Card */}
            <Col lg={4} md={12} className="mb-2">
              <motion.div
                className="content-card h-100"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeIn}
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  borderTop: '3px solid var(--primary)'
                }}
              >
                <div>
                  <div className="section-label">Welcome</div>
                  <h2 className="section-title">Our Journey</h2>
                  <div className="underline"></div>
                
                  <div className="paragraphs">
                    <p>
                      Feast of Esther is an annual divine assignment organized by Pastor (Mrs.) Folu Adeboye,
                      wife of the General Overseer of the Redeemed Christian Church of God.
                    </p>
                    <p>
                      Since its inception in February 2002, this gathering has grown from the Redemption Camp
                      Nigeria to reaching across Africa and Europe, impacting the lives of women in ministry.
                    </p>
                  </div>
                </div>
                <div style={{ marginTop: 'auto', paddingTop: '0px' }}>
                  <motion.div 
                    whileHover={{ y: -5 }}
                    style={{ textAlign: 'right', fontStyle: 'italic', color: 'var(--primary)' }}
                  >
                    "For such a time as this" - Esther 4:14
                  </motion.div>
                </div>
              </motion.div>
            </Col>

            {/* Who We Are Card */}
            <Col lg={4} md={12} className="mb-2">
              <motion.div
                className="content-card h-100"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeIn}
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderTop: '3px solid var(--accent)'
                }}
              >
                <div>
                  <div className="section-label">Our Foundation</div>
                  <h2 className="section-title">Who We Are</h2>
                  <div className="underline"></div>
               
                  <div className="paragraphs">
                    <motion.div
                      variants={staggerItems}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                    >
                      <motion.p variants={itemVariant}>
                        The Feast of Esther gathers women who are General Overseers or heads
                        of ministries, wives of General Overseers, Prelates, Arch Bishops, and Women Leaders 
                        across denominations.
                      </motion.p>
                   
                      <motion.p variants={itemVariant}>
                        This sacred gathering creates space for fellowship, prayer, renewal, and growth,
                        empowering women to stand in the gap for their churches, ministries, and nations.
                      </motion.p>
                    </motion.div>
                  </div>
                </div>

                <motion.div 
                  style={{ marginTop: 'auto', paddingTop: '0px' }}
                  whileHover={{ scale: 1.02 }}
                >
                  <p style={{ fontSize: '0.9rem', color: 'var(--gray-500)' }}>
                    Our global sisterhood spans: Ghana • Cote D'Ivoire • Zambia • Kenya • 
                    Malawi • Togo • Benin • South Africa • Cameroon • UK • Germany • Europe
                  </p>
                </motion.div>
              </motion.div>
            </Col>
           
            {/* Vision Card */}
            <Col lg={4} md={12} className="mb-2">
              <motion.div
                className="content-card h-100"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeIn}
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderTop: '3px solid var(--primary-light)'
                }}
              >
                <div>
                  <div className="section-label">Our Purpose</div>
                  <h2 className="section-title">Our Vision</h2>
                  <div className="underline"></div>
               
                  <div className="vision-block">
                    <p style={{ fontSize: '1.1rem', fontWeight: '500', fontStyle: 'italic', color: 'var(--primary)' }}>
                      "To develop excellent Ministry Skills in women who are called to support
                      and impact the church of God for nation building."
                    </p>
                    
                    <p style={{ marginTop: '20px' }}>
                      We empower women in ministry to stand as pillars in the house of God, 
                      equipping them to accomplish great things for the kingdom through:
                    </p>
                    
                    <ul style={{ listStyle: 'none', padding: '0', margin: '0px 0' }}>
                      <li style={{ padding: '6px 0', borderBottom: '1px dotted var(--gray-300)' }}>
                        ✦ Spiritual leadership development
                      </li>
                      <li style={{ padding: '6px 0', borderBottom: '1px dotted var(--gray-300)' }}>
                        ✦ Ministry skills enhancement
                      </li>
                      <li style={{ padding: '6px 0', borderBottom: '1px dotted var(--gray-300)' }}>
                        ✦ Prophetic intercession training
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </Col>
          </Row>

          {/* Mission Row */}
          <Row className="mb-4">
            <Col lg={12}>
              <motion.div
                className="content-card"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeIn}
                style={{ 
                  background: 'linear-gradient(135deg, rgba(57, 20, 99, 0.03), rgba(212, 175, 55, 0.05))',
                  borderLeft: '4px solid var(--accent)'
                }}
              >
                <div className="section-label">Our Goal</div>
                <h2 className="section-title">Our Mission</h2>
                <div className="underline"></div>

                <div className="mission-block">
                  <p>
                    To create a forum where female ministry leaders learn to:
                  </p>
                 
                  <Row>
                    <Col md={6}>
                      <motion.ul
                        className="mission-list"
                        variants={staggerItems}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        style={{ marginBottom: '0' }}
                      >
                        <motion.li
                          whileHover={{ x: 5 }}
                          variants={itemVariant}
                        >
                          Accomplish their divine calling in ministry
                        </motion.li>
                        <motion.li
                          whileHover={{ x: 5 }}
                          variants={itemVariant}
                        >
                          Stand in the gap for churches, ministries and nations
                        </motion.li>
                        <motion.li
                          whileHover={{ x: 5 }}
                          variants={itemVariant}
                        >
                          Build purposeful fellowship and spiritual connection
                        </motion.li>
                      </motion.ul>
                    </Col>
                    <Col md={6}>
                      <motion.ul
                        className="mission-list"
                        variants={staggerItems}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        style={{ marginTop: '0' }}
                      >
                        <motion.li
                          whileHover={{ x: 5 }}
                          variants={itemVariant}
                        >
                          Catalyze revival through effective church leadership
                        </motion.li>
                        <motion.li
                          whileHover={{ x: 5 }}
                          variants={itemVariant}
                        >
                          Ensure the maximum harvest of souls for the kingdom
                        </motion.li>
                      </motion.ul>
                    </Col>
                  </Row>
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>
     
      {/* Call to Action Section */}
      <section className="about-cta">
        <Container>
          <motion.div
            className="cta-container"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>Be Part of The Next Feast of Esther</h2>
            <p>Join us for a transformative experience of spiritual growth, fellowship, and kingdom empowerment</p>
            <motion.button
              className="cta-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/registration'}
            >
              Register Now
            </motion.button>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}

export default About;
