import React, { useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "./Leaders.css";
import img4 from "../Images/FEASTOFESTHERIMAGES/gallery/4.jpg";
import { motion } from "framer-motion";

const Leaders = () => {
  const [activeRegion, setActiveRegion] = useState("Texas");

  const chapters = {
    "Texas": ["Houston", "Dallas"],
    "Florida": ["Orlando", "Jacksonville", "Hollywood", "Tallahassee", "Sarasota"],
    "North Carolina": ["Durham", "Fayetteville", "Charlotte"],
    "Delaware": [],
    "New York / New Jersey": [],
    "Kentucky": ["Louisville"],
    "Maryland": [],
    "Georgia": ["Atlanta"],
    "Oregon": ["Salem"],
    "California": ["Oakland"],
    "The Caribbean": ["Jamaica"]
  };

  const handleRegionClick = (region) => {
    setActiveRegion(region);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="leaders-page">
      {/* Hero Section */}
      <div className="leader-hero-section">
        <div className="hero-pattern-overlay"></div>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="leader-title-container text-center"
          >
            <h1 className="leader-title">Our Leadership</h1>
            <div className="title-underline mx-auto"></div>
          </motion.div>
          
          <Row className="leader-profile align-items-stretch">
            <Col lg={5} md={6} className="leader-image-col">
              <motion.div 
                className="leader-image-container full-height"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                <img src={img4} alt="Pastor Mrs. Grace Okonrende" className="leader-image" />
                <div className="leader-image-accent top"></div>
                <div className="leader-image-accent bottom"></div>
              </motion.div>
            </Col>
            
            <Col lg={7} md={6} className="leader-content">
              <motion.div
                className="leader-info"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h2 className="main-leader-name">Pastor Mrs. Grace Okonrende</h2>
                <div className="leader-titles">
                  <span className="leader-title-badge">Country Coordinator Feast of Esther USA</span>
                  <span className="leader-title-badge">Continental Evangelist RCCG America</span>
                </div>
                
                <motion.div 
                  className="leader-bio-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <p>
                    Pastor Grace Okonrende is a dynamic evangelist, and a Deliverance Minister, herself and her husband, are gifted and experienced marriage counselors. She has been serving the Lord from her youthful days.
                  </p>
                  <p>
                    She was used by the Lord to pioneer several churches in Nigeria, UK, and was the person used by God to take RCCG to the Republic of Ireland. She started the first RCCG Yoruba/English Church(Apata Irapada) in London, England.
                  </p>
                  <p>
                    The Lord established RCCG in Sacramento, Oakland, and Stockton, California through Pastor Grace and her husband Pastor Ade. She co-pastors the Pavilion of Redemption in Sugarland, Texas, a Branch of The Redeemed Christian Church of God.
                  </p>
                  <p>
                    Pastor Grace has been used mightily by God in the area of deliverance in many nations of the world. Several men and women have testified of the goodness of God in their life through her ministry. She was recognized, honored, and awarded the Most Outstanding Female RCCG NA Leader in 2014 by WIM NA.
                  </p>
                  <p>
                    She was promoted at the 2016 NA Convention as the First Female Regional Evangelist in RCCG World Wide, and she was also a member of the Governing body of RCCG NA. In 2021, she was promoted as the First Female Continental Officer: Evangelism.
                  </p>
                  <p>
                    Presently, she planted five churches in Colombia between 2022 and 2023. She is presently at Sint Maarten Island, planting a Parish of RCCG. The church started last year 2024. She is happily married to Pastor Ade Okonrende, and they are blessed with four children.
                  </p>
                </motion.div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Chapters Section */}
      <div className="chapters-section">
        <Container>
          <motion.div
            className="section-title-container"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="section-title">Our Chapters</h2>
            <div className="title-underline"></div>
            <p className="section-subtitle">Explore our presence across the United States and beyond</p>
          </motion.div>

          <div className="chapters-container">
            <div className="chapter-map">
              <motion.div 
                className="map-container"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                <div className="map-visualization">
                  {Object.keys(chapters).map((region, index) => (
                    <motion.div
                      key={index}
                      className={`map-region ${activeRegion === region ? 'active' : ''}`}
                      onClick={() => handleRegionClick(region)}
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <span className="region-dot"></span>
                      <span className="region-name">{region}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
            
            <Row className="chapter-details-row">
              <Col md={12}>
                <motion.div 
                  className="chapter-details"
                  key={activeRegion}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="active-region-header">
                    <h3 className="region-title">{activeRegion}</h3>
                    <span className="location-count">
                      {chapters[activeRegion].length} {chapters[activeRegion].length === 1 ? 'Location' : 'Locations'}
                    </span>
                  </div>
                  
                  <Row className="chapter-locations">
                    {chapters[activeRegion].length > 0 ? (
                      chapters[activeRegion].map((location, index) => (
                        <Col key={index} md={6} lg={4} xl={3} className="mb-4">
                          <motion.div
                            className="chapter-card-wrapper"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                          >
                            <Card className="chapter-card">
                              <Card.Body>
                                <div className="location-icon">
                                  <i className="fas fa-map-marker-alt"></i>
                                </div>
                                <Card.Title>{location}</Card.Title>
                                <div className="card-shine"></div>
                              </Card.Body>
                            </Card>
                          </motion.div>
                        </Col>
                      ))
                    ) : (
                      <Col className="no-locations">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <div className="coming-soon-message">
                            <i className="fas fa-seedling coming-soon-icon"></i>
                            <p>{activeRegion}</p>
                          </div>
                        </motion.div>
                      </Col>
                    )}
                  </Row>
                </motion.div>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Leaders;
