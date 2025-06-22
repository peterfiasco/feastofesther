import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Form, Button, Card, InputGroup } from "react-bootstrap";
import { motion } from "framer-motion";
import axios from "axios";
import { loadStripe } from '@stripe/stripe-js';
import { stripePublicKey } from '../../utils/stripeConfig';
import { paypalClientId } from '../../utils/paypalConfig';

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.feastofestherna.com/api/v1'
  : 'http://localhost:4000/api/v1';

const stripePromise = loadStripe(stripePublicKey);

const DonatePage = () => {
  // Refs for form fields
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const amountRef = useRef(null);
  const customAmountRef = useRef(null);

  // State for donation form
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    amount: "",
    customAmount: ""
  });

  // UI states
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('stripe');

  // Predefined donation amounts
  const donationAmounts = [25, 50, 100, 250, 500];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle amount selection
  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setFormData({
      ...formData,
      amount: amount.toString(),
      customAmount: ""
    });
    
    // Clear any errors for amount
    setErrors({
      ...errors,
      amount: ""
    });
  };

  // Handle custom amount input - only allow numeric input
  const handleCustomAmountChange = (e) => {
    const inputValue = e.target.value;
    // Remove the $ sign if present, then filter out non-numeric characters
    const numericValue = inputValue.replace(/[$,]/g, '');
    
    // Only proceed if the value is numeric or empty
    if (numericValue === '' || /^\d*\.?\d*$/.test(numericValue)) {
      setSelectedAmount(null);
      setFormData({
        ...formData,
        customAmount: numericValue,
        amount: numericValue
      });
      
      // Validate the amount
      if (numericValue && (isNaN(Number(numericValue)) || Number(numericValue) <= 0)) {
        setErrors({
          ...errors,
          amount: "Please enter a valid amount"
        });
      } else {
        setErrors({
          ...errors,
          amount: ""
        });
      }
    }
  };

  // Validation function
  const validateField = (name, value) => {
    let error = "";
    
    switch (name) {
      case "firstName":
      case "lastName":
        if (!value.trim()) error = "This field is required";
        else if (value.trim().length < 2) error = "Must be at least 2 characters";
        break;
      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
          error = "Please enter a valid email address";
        }
        break;
      case "phone":
        if (!value.trim()) {
          error = "Phone number is required";
        } else if (!/^[0-9+\-\s()]{10,15}$/.test(value)) {
          error = "Please enter a valid phone number";
        }
        break;
      case "amount":
        if (!value || Number(value) <= 0) {
          error = "Please select or enter a valid amount";
        }
        break;
      default:
        break;
    }
    
    return error;
  };

  // Form change handler
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

  // Form blur handler
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  // Scroll to the first error field
  const scrollToFirstError = (fieldErrors) => {
    const fieldNames = Object.keys(fieldErrors).filter(key => fieldErrors[key]);
    
    if (fieldNames.length > 0) {
      const firstFieldName = fieldNames[0];
      
      // Get the reference to the field
      let fieldRef;
      switch (firstFieldName) {
        case 'firstName':
          fieldRef = firstNameRef;
          break;
        case 'lastName':
          fieldRef = lastNameRef;
          break;
        case 'email':
          fieldRef = emailRef;
          break;
        case 'phone':
          fieldRef = phoneRef;
          break;
        case 'amount':
          fieldRef = selectedAmount ? amountRef : customAmountRef;
          break;
        default:
          break;
      }
      
      // Scroll to the field
      if (fieldRef && fieldRef.current) {
        fieldRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center'
        });
        // Focus the field
        fieldRef.current.focus();
      }
    }
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    // Check if amount is selected or entered
    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = "Please select or enter a valid amount";
      isValid = false;
    }
    
    // Validate all fields
    Object.keys(formData).forEach(key => {
      if (key !== "customAmount") { // Skip validating customAmount separately
        const error = validateField(key, formData[key]);
        if (error) {
          newErrors[key] = error;
          isValid = false;
        }
      }
    });
    
    setErrors(newErrors);

    // If there are errors, scroll to the first error field
    if (!isValid) {
      setTimeout(() => {
        scrollToFirstError(newErrors);
      }, 100);
    }

    return isValid;
  };

  // Form submission handler
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
      
      try {
        // First create the donation record
        const donationResponse = await axios.post(`${API_URL}/create-donation`, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          amount: formData.amount,
          paymentMethod: paymentMethod
        });
        
        if (donationResponse.data.success) {
          const donationId = donationResponse.data.donationId;
          
          if (paymentMethod === 'stripe') {
            // Process with Stripe
            const sessionResponse = await axios.post(`${API_URL}/create-contribution-session`, {
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              phone: formData.phone,
              amount: formData.amount,
              donationId: donationId
            });
            
            // Redirect to Stripe checkout
            window.location.href = sessionResponse.data.url;
          } else if (paymentMethod === 'paypal') {
            // Process with PayPal
            const paypalResponse = await axios.post(`${API_URL}/create-paypal-order`, {
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              phone: formData.phone,
              amount: formData.amount,
              donationId: donationId
            });
            
            // Redirect to PayPal checkout
            window.location.href = paypalResponse.data.url;
          } else if (paymentMethod === 'zelle') {
            // Handle Zelle payment
            setSubmitStatus({
              type: "success",
              message: `Thank you! Please send ${formData.amount} via Zelle to rccgnafoe@gmail.com with memo "Donation - ${formData.firstName} ${formData.lastName}". We'll confirm your donation within 24 hours.`
            });
          }
        } else {
          throw new Error(donationResponse.data.message || "Failed to process contribution");
        }
      } catch (error) {
        console.error("Contribution error:", error);
        
        setSubmitStatus({
          type: "danger",
          message: error.message || "Failed to process contribution. Please try again."
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  // Styles for the component
  const styles = {
    pageContainer: {
      paddingTop: "120px",
      paddingBottom: "80px",
    },
    formContainer: {
      background: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)",
      borderRadius: "16px",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
      padding: "50px",
      marginBottom: "80px",
      position: "relative",
      overflow: "hidden",
    },
    formHeader: {
      textAlign: "center",
      marginBottom: "40px",
      position: "relative",
    },
    title: {
      color: "#c80e91",
      fontSize: "2.8rem",
      fontWeight: "700",
      marginBottom: "15px",
    },
    titleUnderline: {
      height: "3px",
      width: "80px",
      background: "linear-gradient(to right, #c80e91, #ff6ec4)",
      margin: "0 auto 20px",
    },
    subtitle: {
      color: "#666",
      fontSize: "1.2rem",
      maxWidth: "700px",
      margin: "0 auto",
      lineHeight: "1.6",
    },
    paymentMethodButton: {
      border: "2px solid #c80e91",
      borderRadius: "10px",
      padding: "15px 25px",
      fontSize: "1.1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      background: "white",
      color: "#c80e91",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexGrow: 1
    },
    selectedPaymentMethod: {
      background: "#c80e91",
      color: "white",
    },
    
    formSection: {
      marginTop: "40px",
    },
    sectionHeader: {
      color: "#c80e91",
      fontSize: "1.4rem",
      fontWeight: "600",
      marginBottom: "25px",
      paddingBottom: "10px",
      borderBottom: "1px solid rgba(200, 14, 145, 0.2)",
    },
    amountContainer: {
      display: "flex",
      flexWrap: "wrap",
      gap: "15px",
      marginBottom: "30px",
    },
    amountButton: {
      border: "2px solid #c80e91",
      borderRadius: "10px",
      padding: "15px 25px",
      fontSize: "1.1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      background: "white",
      color: "#c80e91",
      minWidth: "100px",
      textAlign: "center",
    },
    selectedAmount: {
      background: "#c80e91",
      color: "white",
    },
    customAmountInput: {
      padding: "15px",
      paddingLeft: "30px", // Add more padding for the $ symbol
      borderRadius: "10px",
      border: "2px solid #c80e91",
      fontSize: "1.1rem",
      width: "100%",
      marginTop: "15px",
    },
    formControl: {
      padding: "15px",
      borderRadius: "10px",
      border: "2px solid rgba(200, 14, 145, 0.3)",
      fontSize: "1rem",
      marginBottom: "20px",
      transition: "all 0.3s ease",
    },
    formLabel: {
      fontSize: "1rem",
      fontWeight: "600",
      color: "#333",
      marginBottom: "10px",
    },
    errorMessage: {
      color: "#d9534f",
      fontSize: "0.9rem",
      marginTop: "-15px",
      marginBottom: "20px",
    },
    submitButton: {
      background: "linear-gradient(135deg, #c80e91 0%, #ff6ec4 100%)",
      color: "white",
      border: "none",
      borderRadius: "10px",
      padding: "15px 30px",
      fontSize: "1.2rem",
      fontWeight: "600",
      marginTop: "20px",
      width: "100%",
      transition: "all 0.3s ease",
      cursor: "pointer",
    },
    loadingSpinner: {
      marginRight: "10px",
    },
    statusAlert: {
      marginTop: "20px",
      padding: "15px",
      borderRadius: "10px",
      textAlign: "center",
    },
    backgroundDecoration: {
      position: "absolute",
      width: "300px",
      height: "300px",
      borderRadius: "50%",
      background: "rgba(200, 14, 145, 0.05)",
      zIndex: "-1",
    },
    decorationTop: {
      top: "-150px",
      right: "-150px",
    },
    decorationBottom: {
      bottom: "-150px",
      left: "-150px",
    },
    infoCard: {
      backgroundColor: "rgba(200, 14, 145, 0.05)",
      borderRadius: "16px",
      padding: "30px",
      marginBottom: "30px",
      border: "1px solid rgba(200, 14, 145, 0.1)",
    },
    infoIcon: {
      fontSize: "2.5rem",
      color: "#c80e91",
      marginBottom: "15px",
    },
    infoTitle: {
      color: "#c80e91",
      fontSize: "1.4rem",
      fontWeight: "600",
      marginBottom: "15px",
    },
    infoText: {
      color: "#666",
      fontSize: "1rem",
      lineHeight: "1.6",
    },
    dollarSign: {
      position: "absolute",
      left: "15px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#c80e91",
      fontSize: "1.1rem",
      fontWeight: "bold",
      pointerEvents: "none"
    }
  };
  
  return (
    <Container fluid style={styles.pageContainer}>
      <Row className="justify-content-center">
        <Col lg={8} md={10} xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={styles.formContainer}
          >
            {/* Background decorations */}
            <div
              style={{ ...styles.backgroundDecoration, ...styles.decorationTop }}
            />
            <div
              style={{ ...styles.backgroundDecoration, ...styles.decorationBottom }}
            />
            
            {/* Form header */}
            <div style={styles.formHeader}>
              <h1 style={styles.title}>Support Our Ministry</h1>
              <div style={styles.titleUnderline}></div>
              <p style={styles.subtitle}>
                Your generous contribution helps us continue our mission and make a difference in the lives of many.
                Every gift, no matter the size, brings us closer to our goals.
              </p>
            </div>
            
            {/* Donation form */}
            <Form onSubmit={handleSubmit}>
              {/* Donation Amount Section */}
              <div style={styles.formSection} ref={amountRef}>
                <h3 style={styles.sectionHeader}>Select Contribution Amount</h3>
                
                <div style={styles.amountContainer}>
                  {donationAmounts.map((amount) => (
                    <div
                      key={amount}
                      style={{
                        ...styles.amountButton,
                        ...(selectedAmount === amount ? styles.selectedAmount : {}),
                      }}
                      onClick={() => handleAmountSelect(amount)}
                    >
                      ${amount}
                    </div>
                  ))}
                </div>
                
                <Form.Group>
                  <Form.Label style={styles.formLabel}>Or enter custom amount:</Form.Label>
                  <div style={{ position: "relative" }}>
                    <Form.Control
                      type="text"
                      name="customAmount"
                      value={formData.customAmount}
                      onChange={handleCustomAmountChange}
                      placeholder="Enter amount"
                      style={styles.customAmountInput}
                      ref={customAmountRef}
                    />
                    <div style={styles.dollarSign}>$</div>
                  </div>
                  {touched.amount && errors.amount && (
                    <div style={styles.errorMessage}>{errors.amount}</div>
                  )}
                </Form.Group>
              </div>

              {/* Payment Method Section */}
              <div style={styles.formSection}>
                <h3 style={styles.sectionHeader}>Select Payment Method</h3>
                
                <div style={{display: 'flex', gap: '15px', marginBottom: '20px'}}>
                  <div
                    onClick={() => setPaymentMethod('stripe')}
                    style={{
                      ...styles.paymentMethodButton,
                      ...(paymentMethod === 'stripe' ? styles.selectedPaymentMethod : {})
                    }}
                  >
                    <i className="fab fa-cc-stripe" style={{marginRight: '10px'}}></i>
                    Credit Card (Stripe)
                  </div>
                  
                  <div
                    onClick={() => setPaymentMethod('paypal')}
                    style={{
                      ...styles.paymentMethodButton,
                      ...(paymentMethod === 'paypal' ? styles.selectedPaymentMethod : {})
                    }}
                  >
                    <i className="fab fa-paypal" style={{marginRight: '10px'}}></i>
                    PayPal
                  </div>
                  
                  <div
                    onClick={() => setPaymentMethod('zelle')}
                    style={{
                      ...styles.paymentMethodButton,
                      ...(paymentMethod === 'zelle' ? styles.selectedPaymentMethod : {})
                    }}
                  >
                    <div style={{
                      backgroundColor: '#6c1fff',
                      color: 'white',
                      width: '20px',
                      height: '20px',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      marginRight: '10px'
                    }}>
                      Z
                    </div>
                    Zelle
                  </div>
                </div>
              </div>

              {/* Personal Information Section */}
              <div style={styles.formSection}>
                <h3 style={styles.sectionHeader}>Your Information</h3>
                
                <Row>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label style={styles.formLabel}>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Your first name"
                        style={styles.formControl}
                        ref={firstNameRef}
                      />
                      {touched.firstName && errors.firstName && (
                        <div style={styles.errorMessage}>{errors.firstName}</div>
                      )}
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label style={styles.formLabel}>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Your last name"
                        style={styles.formControl}
                        ref={lastNameRef}
                      />
                      {touched.lastName && errors.lastName && (
                        <div style={styles.errorMessage}>{errors.lastName}</div>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label style={styles.formLabel}>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Your email address"
                        style={styles.formControl}
                        ref={emailRef}
                      />
                      {touched.email && errors.email && (
                        <div style={styles.errorMessage}>{errors.email}</div>
                      )}
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label style={styles.formLabel}>Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Your phone number"
                        style={styles.formControl}
                        ref={phoneRef}
                      />
                      {touched.phone && errors.phone && (
                        <div style={styles.errorMessage}>{errors.phone}</div>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
              </div>
              
              {/* Submit Button */}
              <Button 
                type="submit" 
                style={styles.submitButton} 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm" style={styles.loadingSpinner} role="status" aria-hidden="true"></span>
                    Processing...
                  </>
                ) : (
                  `Contribute $${formData.amount || '0'} via ${paymentMethod === 'stripe' ? 'Credit Card' : 'PayPal'}`
                )}
              </Button>
              
              {/* Status message */}
              {submitStatus && (
                <div
                  style={{
                    ...styles.statusAlert,
                    backgroundColor: submitStatus.type === "danger" ? "#f8d7da" : "#d4edda",
                    color: submitStatus.type === "danger" ? "#721c24" : "#155724",
                  }}
                >
                  {submitStatus.message}
                </div>
              )}
            </Form>
          </motion.div>
        </Col>
      </Row>
      
      {/* Information Cards */}
      <Row className="justify-content-center">
        <Col lg={8} md={10} xs={12}>
          <Row>
            <Col md={4} sm={12}>
              <Card style={styles.infoCard}>
                <Card.Body className="text-center">
                  <i className="fas fa-hand-holding-heart" style={styles.infoIcon}></i>
                  <h4 style={styles.infoTitle}>Make a Difference</h4>
                  <p style={styles.infoText}>
                    Your contributions help us reach more people and expand our ministry initiatives.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4} sm={12}>
              <Card style={styles.infoCard}>
                <Card.Body className="text-center">
                  <i className="fas fa-shield-alt" style={styles.infoIcon}></i>
                  <h4 style={styles.infoTitle}>Secure Payment</h4>
                  <p style={styles.infoText}>
                    All transactions are processed securely through Stripe's encrypted payment system.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4} sm={12}>
              <Card style={styles.infoCard}>
                <Card.Body className="text-center">
                  <i className="fas fa-heart" style={styles.infoIcon}></i>
                  <h4 style={styles.infoTitle}>Thank You</h4>
                  <p style={styles.infoText}>
                    We are grateful for your generosity and continued support of our mission.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default DonatePage;
