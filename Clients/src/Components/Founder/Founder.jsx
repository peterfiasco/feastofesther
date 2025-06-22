import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import "./Founder.css";

// Images
import heroImage from "../Images/FEASTOFESTHERIMAGES/Main.jpg";
import angelImage from "../Images/FEASTOFESTHERIMAGES/angels.jpg";
import mummyImage from "../Images/FEASTOFESTHERIMAGES/mummy.jpg";

const Founder = () => {
  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 } 
    }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="founder-page">
      {/* Hero Section */}
<section className="founder-hero">
  <div className="hero-background">
    <img src={heroImage} alt="Pastor Mrs. Folu Adeboye" />
  </div>
  
  <div className="hero-footer-container">
    <motion.div 
      className="hero-footer-content"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="hero-title-area">
        <div className="title-badge">The Visionary</div>
        <h1>Pastor Mrs. Folu Adeboye</h1>
        <div className="title-accent"></div>
      </div>
      
      <div className="hero-description-area">
        <p>
          Wife of the General Overseer of the Redeemed Christian Church of God (RCCG) Worldwide,
          and visionary founder of the Feast of Esther.
        </p>
        <motion.div 
          className="explore-link"
          whileHover={{ x: 5 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <span>Explore Her Legacy</span>
          <i className="arrow-right">→</i>
        </motion.div>
      </div>
    </motion.div>
  </div>
</section>


      {/* Biography Section */}
      <section className="founder-biography">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn}
            className="section-heading"
          >
            <h2>The Visionary</h2>
            <div className="heading-underline"></div>
          </motion.div>

          <Row className="biography-content">
            <Col lg={8} md={7} className="biography-text">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={staggerChildren}
                className="text-container"
              >
                <motion.p variants={fadeIn}>
                  Pastor Mrs Folu Adeboye is the wife of the General Overseer
                  of the Redeemed Christian Church of God (RCCG) Worldwide.
                  She's a Mother, a mentor, a teacher and a woman in the
                  ministry. Over the years she has been noted for efficiency,
                  effectiveness, excellency and balancing of roles.
                </motion.p>
                
                <motion.p variants={fadeIn}>
                  In 1981, Pastor Mrs. Adeboye took up the Children Sunday
                  School with a few teachers. And she wrote the Sunday school
                  manual now know as zeal from 1981-1999. Presently, Teachers'
                  Conferences are hosted annually to give teachers induction
                  course, charge them for the task ahead is waxing stronger
                  and growing higher on a daily basis.
                </motion.p>
                
                <motion.p variants={fadeIn}>
                  In 1981, Pastor E. A. Adeboye set the pace for the
                  establishment of the formal educational arm of CRM. Mummy
                  G.O. armed with her 15 years teaching experience took up the
                  challenge. Today, there are over fifty-eight (58)
                  nursery/primary schools in twenty-three states in Nigeria,
                  over six RCCG Secondary schools, one science academy, and
                  the Redeemers University for Nations (RUN). Pastor (Mrs.)
                  Folu Adeboye is the Vice President of CRM, Education under
                  whose leadership the school of Disciple falls.
                </motion.p>
              </motion.div>
            </Col>

            <Col lg={4} md={5} className="biography-image">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="image-container"
              >
                <img src={angelImage} alt="Ministry Impact" className="profile-image" />
                <div className="image-caption">Ministry Impact</div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Legacy Section */}
      <section className="founder-legacy">
        <Container>
          <div className="legacy-portrait">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="portrait-container"
            >
              <img src={mummyImage} alt="Pastor Mrs. Folu Adeboye" />
            </motion.div>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="legacy-cards"
          >
            <Row>
              <Col lg={4} md={4} sm={12} className="mb-4">
                <motion.div 
                  className="legacy-card"
                  variants={fadeIn}
                  whileHover={{ y: -10, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                >
                  <div className="card-content">
                    <h3 className="card-title">Global Impact</h3>
                    <div className="card-divider"></div>
                    <p>
                      The school is well spread in all states of Nigeria
                      and has spread to many countries of the world
                      especially along West Africa, Europe, UK and
                      Ireland, Hong Kong and North America to mention a
                      few.
                    </p>
                    <p>
                      Mummy GO is in charge of Women Affairs. She hosts
                      the annual Women in Ministry program for all female
                      ministers in the RCCG all over the world. She's the
                      President of a welfare ministry called certain women
                      in Nigeria.
                    </p>
                  </div>
                </motion.div>
              </Col>

              <Col lg={4} md={4} sm={12} className="mb-4">
                <motion.div 
                  className="legacy-card"
                  variants={fadeIn}
                  whileHover={{ y: -10, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                >
                  <div className="card-content">
                    <h3 className="card-title">Mission Outreach</h3>
                    <div className="card-divider"></div>
                    <p>
                      Her heart of compassion drove her to establish some
                      mission outreaches. She established African missions
                      which seek to promote the spread of the gospel all
                      over the world; promote the development of
                      sustainable holistic programs all over the world;
                      and also to promote services that will improve the
                      quality of life of children, youth, and families all
                      over the world.
                    </p>
                  </div>
                </motion.div>
              </Col>

              <Col lg={4} md={4} sm={12} className="mb-4">
                <motion.div 
                  className="legacy-card"
                  variants={fadeIn}
                  whileHover={{ y: -10, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                >
                  <div className="card-content">
                    <h3 className="card-title">Rehabilitation Ministry</h3>
                    <div className="card-divider"></div>
                    <p>
                      She established the habitation of hope which is the
                      home for rehabilitation of boys taken off the
                      streets and to give them a future and a hope in
                      Christ. These children, who lived and slept on the
                      beach, were involved in petty armed robbery, sale
                      and use of drugs. In addition to the academic
                      education, the school also gives vocational training.
                    </p>
                  </div>
                </motion.div>
              </Col>
            </Row>
          </motion.div>
        </Container>
      </section>
    </div>
  );
};

export default Founder;
