import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faTiktok,
  faFacebook,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import {
  faPhone,
  faEnvelope,
  faGlobe,
  faMapMarkerAlt,
  faCheckCircle,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const Contact = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [hoverSocial, setHoverSocial] = useState(null);

  // Validation function
  const validateField = (name, value) => {
    let error = "";
    
    switch (name) {
      case "name":
        if (!value.trim()) error = "Name is required";
        break;
      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = "Email is invalid";
        }
        break;
      case "message":
        if (!value.trim()) error = "Message is required";
        else if (value.trim().length < 10) error = "Message must be at least 10 characters";
        break;
      default:
        break;
    }
    
    return error;
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Mark field as touched
    if (!touched[name]) {
      setTouched({ ...touched, [name]: true });
    }
    
    // Validate on change
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Set all fields as touched
    const allTouched = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
    
    if (validateForm()) {
      setIsSubmitting(true);
      setSubmitStatus(null);
      
      try {
        const response = await axios.post(
          "https://nodejs.feastofestherna.com/api/v1/send-email",
          formData
        );
        
        setSubmitStatus({ 
          type: "success", 
          message: "Thank you for your message! We'll get back to you soon." 
        });
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          message: "",
        });
        
        setTouched({});
      } catch (error) {
        console.error("Submission error:", error);
        setSubmitStatus({ 
          type: "error", 
          message: "There was an error sending your message. Please try again." 
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Social media links
  const socialLinks = [
    { 
      icon: faInstagram, 
      url: "https://www.instagram.com/feast_of_esther_na",
      color: "#E1306C",
      label: "Instagram"
    },
    { 
      icon: faTiktok, 
      url: "https://www.tiktok.com/@feastofestherna",
      color: "#000000",
      label: "TikTok"
    },
    { 
      icon: faFacebook, 
      url: "https://www.facebook.com/groups/feastofestherna/",
      color: "#4267B2",
      label: "Facebook"
    },
    { 
      icon: faYoutube, 
      url: "https://www.youtube.com/@feastofesther5437",
      color: "#FF0000",
      label: "YouTube"
    }
  ];

  // Contact info items
  const contactInfo = [
    {
      icon: faMapMarkerAlt,
      text: "15227 Old Richmond RD Sugar land, Tx 77498",
      color: "#c80e91"
    },
    {
      icon: faPhone,
      text: "+1(919)885-9765  or  +1(832) 372-0860",
      color: "#c80e91"
    },
    {
      icon: faEnvelope,
      text: "feastofesthernc@gmail.com",
      color: "#c80e91"
    },
    {
      icon: faGlobe,
      text: "www.feastofestherna.com",
      color: "#c80e91"
    }
  ];

  // Styles
  const styles = {
    pageContainer: {
      background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
      padding: "180px 0",
      minHeight: "100vh",
      position: "relative",
      overflow: "hidden",
    },
    shapeDivider: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      overflow: "hidden",
      lineHeight: 0,
      zIndex: 1,
    },
    shapeFill: {
      fill: "rgba(200, 14, 145, 0.1)",
    },
    contentContainer: {
      position: "relative",
      zIndex: 2,
    },
    contactCard: {
      background: "white",
      borderRadius: "16px",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
      marginBottom: "30px",
    },
    formSection: {
      padding: "40px",
      background: "linear-gradient(135deg, #c80e91 0%, #ff6ec4 100%)",
      color: "white",
      borderRadius: "16px 0 0 16px",
    },
    infoSection: {
      padding: "40px",
      background: "white",
      borderRadius: "0 16px 16px 0",
    },
    formTitle: {
      fontSize: "2.2rem",
      fontWeight: "700",
      marginBottom: "30px",
      textAlign: "center",
      textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    infoTitle: {
      fontSize: "1.8rem",
      fontWeight: "700",
      marginBottom: "30px",
      textAlign: "center",
      color: "#c80e91",
      position: "relative",
    },
    titleUnderline: {
      height: "3px",
      width: "60px",
      background: "#c80e91",
      margin: "0 auto 20px",
    },
    formGroup: {
      marginBottom: "25px",
    },
    label: {
      color: "white",
      fontWeight: "600",
      marginBottom: "8px",
      fontSize: "0.95rem",
      display: "block",
    },
    input: {
      padding: "15px",
      borderRadius: "8px",
      border: "none",
      transition: "all 0.3s ease",
      fontSize: "1rem",
      width: "100%",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    },
    inputFocus: {
      backgroundColor: "white",
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
    },
    inputError: {
      borderLeft: "4px solid #e74c3c",
      backgroundColor: "rgba(231, 76, 60, 0.05)",
    },
    errorText: {
      color: "#fff",
      fontSize: "0.85rem",
      marginTop: "5px",
      paddingLeft: "5px",
      backgroundColor: "rgba(231, 76, 60, 0.7)",
      padding: "5px 10px",
      borderRadius: "4px",
    },
    textarea: {
      minHeight: "150px",
      resize: "vertical",
    },
    submitButton: {
      background: "white",
      color: "#c80e91",
      border: "none",
      borderRadius: "30px",
      padding: "15px 40px",
      fontSize: "1.1rem",
      fontWeight: "600",
      cursor: "pointer",
      display: "block",
      margin: "30px auto 0",
      minWidth: "200px",
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
      transition: "all 0.3s ease",
    },
    submitButtonHover: {
      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
      transform: "translateY(-2px)",
    },
    submitButtonDisabled: {
      opacity: 0.7,
      cursor: "not-allowed",
      boxShadow: "none",
    },
    infoCard: {
      background: "#f8f9fa",
      borderRadius: "12px",
      padding: "25px",
      marginBottom: "25px",
      boxShadow: "0 3px 10px rgba(0, 0, 0, 0.05)",
    },
    infoCardTitle: {
      fontSize: "1.2rem",
      fontWeight: "600",
      color: "#c80e91",
      marginBottom: "15px",
    },
    infoCardText: {
      color: "#555",
      lineHeight: "1.6",
    },
    contactItem: {
      display: "flex",
      alignItems: "center",
      marginBottom: "20px",
      padding: "15px",
      borderRadius: "8px",
      transition: "all 0.3s ease",
      backgroundColor: "#f8f9fa",
    },
    contactItemHover: {
      backgroundColor: "#f0f0f0",
      transform: "translateX(5px)",
    },
    contactIcon: {
      width: "50px",
      height: "50px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginRight: "15px",
      color: "white",
      background: "linear-gradient(135deg, #c80e91 0%, #ff6ec4 100%)",
      boxShadow: "0 4px 10px rgba(200, 14, 145, 0.3)",
    },
    contactText: {
      color: "#333",
      fontSize: "0.95rem",
    },
    socialContainer: {
      display: "flex",
      justifyContent: "center",
      marginTop: "30px",
    },
    socialLink: {
      width: "50px",
      height: "50px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 10px",
      color: "white",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      transition: "all 0.3s ease",
      position: "relative",
    },
    socialLinkHover: {
      transform: "translateY(-5px)",
      boxShadow: "0 8px 15px rgba(0, 0, 0, 0.2)",
    },
    socialTooltip: {
      position: "absolute",
      bottom: "-30px",
      left: "50%",
      transform: "translateX(-50%)",
      backgroundColor: "#333",
      color: "white",
      padding: "5px 10px",
      borderRadius: "4px",
      fontSize: "0.8rem",
      whiteSpace: "nowrap",
    },
    statusMessage: {
      padding: "15px",
      borderRadius: "8px",
      marginTop: "20px",
      textAlign: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    statusIcon: {
      marginRight: "10px",
      fontSize: "1.2rem",
    },
    successMessage: {
      backgroundColor: "rgba(46, 204, 113, 0.2)",
      color: "#27ae60",
      border: "1px solid #27ae60",
    },
    errorMessage: {
      backgroundColor: "rgba(231, 76, 60, 0.2)",
      color: "#e74c3c",
      border: "1px solid #e74c3c",
    },
    mapContainer: {
      height: "200px",
      borderRadius: "12px",
      overflow: "hidden",
      marginTop: "30px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    },
    spinnerContainer: {
      display: "inline-block",
      marginRight: "10px",
    },
    mobileAdjust: {
      '@media (max-width: 768px)': {
        borderRadius: "16px 16px 0 0",
      }
    },
    infoMobileAdjust: {
      '@media (max-width: 768px)': {
        borderRadius: "0 0 16px 16px",
      }
    },
    followText: {
      fontSize: "1.2rem",
      fontWeight: "600",
      color: "#c80e91",
      marginBottom: "20px",
      textAlign: "center",
    },
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.shapeDivider}>
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" style={styles.shapeFill}></path>
        </svg>
      </div>
      
      <Container style={styles.contentContainer}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Row className="justify-content-center">
            <Col lg={10}>
              <Row className="g-0" style={styles.contactCard}>
                {/* Form Section */}
                <Col md={6} style={{...styles.formSection, ...styles.mobileAdjust}}>
                  <h2 style={styles.formTitle}>Get In Touch</h2>
                  <div style={styles.titleUnderline}></div>
                  
                  <Form onSubmit={handleSubmit}>
                    <Form.Group style={styles.formGroup}>
                      <Form.Label style={styles.label}>Your Name</Form.Label>
                      <motion.div whileTap={{ scale: 0.98 }}>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          style={{
                            ...styles.input,
                            ...(touched.name && errors.name ? styles.inputError : {}),
                            ...(document.activeElement?.name === "name" ? styles.inputFocus : {})
                          }}
                          placeholder="Enter your name"
                        />
                      </motion.div>
                      {touched.name && errors.name && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          style={styles.errorText}
                        >
                          {errors.name}
                        </motion.div>
                      )}
                    </Form.Group>
                    
                    <Form.Group style={styles.formGroup}>
                      <Form.Label style={styles.label}>Your Email</Form.Label>
                      <motion.div whileTap={{ scale: 0.98 }}>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          style={{
                            ...styles.input,
                            ...(touched.email && errors.email ? styles.inputError : {}),
                            ...(document.activeElement?.name === "email" ? styles.inputFocus : {})
                          }}
                          placeholder="Enter your email address"
                        />
                      </motion.div>
                      {touched.email && errors.email && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          style={styles.errorText}
                        >
                          {errors.email}
                        </motion.div>
                      )}
                    </Form.Group>
                    
                    <Form.Group style={styles.formGroup}>
                      <Form.Label style={styles.label}>Your Message</Form.Label>
                      <motion.div whileTap={{ scale: 0.98 }}>
                        <Form.Control
                          as="textarea"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          style={{
                            ...styles.input,
                            ...styles.textarea,
                            ...(touched.message && errors.message ? styles.inputError : {}),
                            ...(document.activeElement?.name === "message" ? styles.inputFocus : {})
                          }}
                          placeholder="What would you like to tell us?"
                        />
                      </motion.div>
                      {touched.message && errors.message && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          style={styles.errorText}
                        >
                          {errors.message}
                        </motion.div>
                      )}
                    </Form.Group>
                    
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={!isSubmitting ? { scale: 1.05 } : {}}
                      whileTap={!isSubmitting ? { scale: 0.95 } : {}}
                      style={{
                        ...styles.submitButton,
                        ...(isSubmitting ? styles.submitButtonDisabled : {})
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <span style={styles.spinnerContainer}>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                            />
                          </span>
                          Sending...
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </motion.button>
                    
                    <AnimatePresence>
                      {submitStatus && (
                        <motion.div
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          style={{
                            ...styles.statusMessage,
                            ...(submitStatus.type === "success" ? styles.successMessage : styles.errorMessage)
                          }}
                        >
                          <FontAwesomeIcon
                            icon={submitStatus.type === "success" ? faCheckCircle : faExclamationCircle}
                            style={styles.statusIcon}
                          />
                          {submitStatus.message}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Form>
                </Col>
                
                {/* Info Section */}
                <Col md={6} style={{...styles.infoSection, ...styles.infoMobileAdjust}}>
                  <h2 style={styles.infoTitle}>Contact Information</h2>
                  <div style={styles.titleUnderline}></div>
                  
                  <div style={styles.infoCard}>
                    <h3 style={styles.infoCardTitle}>About Feast of Esther</h3>
                    <p style={styles.infoCardText}>
                      Feast of Esther is an annual Feast organized by the wife of
                      the General Overseer of the Redeemed Christian church of God
                      Pastor (Mrs.) Folu Adeboye. It is a vision and a divine
                      assignment given by God.
                    </p>
                  </div>
                  
                  {contactInfo.map((item, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ x: 5 }}
                      style={styles.contactItem}
                    >
                      <div style={styles.contactIcon}>
                        <FontAwesomeIcon icon={item.icon} />
                      </div>
                      <div style={styles.contactText}>{item.text}</div>
                    </motion.div>
                  ))}
                  
                  <div style={styles.followText}>Follow Us</div>
                  <div style={styles.socialContainer}>
                    {socialLinks.map((social, index) => (
                      <motion.a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ y: -5 }}
                        onMouseEnter={() => setHoverSocial(index)}
                        onMouseLeave={() => setHoverSocial(null)}
                        style={{
                          ...styles.socialLink,
                          background: social.color,
                        }}
                      >
                        <FontAwesomeIcon icon={social.icon} size="lg" />
                        {hoverSocial === index && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={styles.socialTooltip}
                          >
                            {social.label}
                          </motion.div>
                        )}
                      </motion.a>
                    ))}
                  </div>
                  
                  <div style={styles.mapContainer}>
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3467.5762660333193!2d-95.6404863!3d29.6434183!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640e7f76ba8fb7f%3A0x621c1b0e41a1a14d!2s15227%20Old%20Richmond%20Rd%2C%20Sugar%20Land%2C%20TX%2077498!5e0!3m2!1sen!2sus!4v1658850023456!5m2!1sen!2sus"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Feast of Esther Location"
                    ></iframe>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </motion.div>
      </Container>
    </div>
  );
};

export default Contact;
