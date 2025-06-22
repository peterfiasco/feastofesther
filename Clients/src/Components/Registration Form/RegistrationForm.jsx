import React, { useState, useEffect, useCallback, useRef } from "react";
import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { loadStripe } from '@stripe/stripe-js';
import { stripePublicKey, registrationFeeAmount } from '../../utils/stripeConfig';
import { createPaymentSession } from '../../services/stripeService';
import { createPayPalOrder, capturePayPalOrder } from '../../services/paypalService';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { paypalClientId } from '../../utils/paypalConfig';

// Debounce utility function
const useDebounce = (callback, delay) => {
  const [debounceTimer, setDebounceTimer] = useState(null);

  const debouncedCallback = useCallback((...args) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    const newTimer = setTimeout(() => {
      callback(...args);
    }, delay);
    
    setDebounceTimer(newTimer);
  }, [callback, delay, debounceTimer]);

  return debouncedCallback;
};

const RegistrationForm = () => {
  const stripePromise = loadStripe(stripePublicKey);
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [hoverSubmit, setHoverSubmit] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paypalButtonsRendered, setPaypalButtonsRendered] = useState(false);
  const [paymentInProgress, setPaymentInProgress] = useState(false);
  const [lastPaymentAttempt, setLastPaymentAttempt] = useState(null);
  
  // Refs for form fields to enable auto-focus on validation errors
  const fieldRefs = {
    firstname: useRef(null),
    lastname: useRef(null),
    email: useRef(null),
    phonenumber: useRef(null),
    streetaddress: useRef(null),
    apartment: useRef(null),
    city: useRef(null),
    zippostalcode: useRef(null),
    country: useRef(null),
    nameofchurch: useRef(null),
    positioninminstry: useRef(null),
    titleofoffice: useRef(null),
    husbandname: useRef(null),
    tshirtsize: useRef(null),
    eventId: useRef(null),
    paymentMethod: useRef(null)
  };
  const events = [
    { id: "1", name: "Feast of Esther 2025 - Houston", date: "2025-07-10" },
    
  ];
  
  const countries = [
    "USA", "Canada", "Australia", "United Kingdom", "Germany", "France",
    "Japan", "China", "India", "Brazil", "Europe", "England", "South Korea",
    "Taiwan", "Vietnam", "Thailand", "Philippines", "Indonesia", "Malaysia",
    "Singapore", "Hong Kong", "Russia", "Mexico", "South Africa", "Nigeria", "Other"
  ];
  
  const tshirt = ["S", "M", "L", "XL", "XXL", "XXXL", "XXXXL", "XXXXXL"];
  
  const handlePayPalRedirect = async () => {
    // Prevent multiple payment attempts
    if (paymentInProgress) {
      console.log("Payment already in progress, ignoring duplicate request");
      return;
    }

    const now = Date.now();
    if (lastPaymentAttempt && (now - lastPaymentAttempt) < 5000) {
      console.log("Payment attempt too soon after last attempt, ignoring");
      return;
    }

    setPaymentInProgress(true);
    setIsProcessingPayment(true);
    setLastPaymentAttempt(now);
      
    try {
      // Create a registration first if not already created
      if (!registrationId) {
        const result = await submitRegistration(formData);
        if (!result.success) {
          throw new Error(result.message || "Registration failed");
        }
        setRegistrationId(result.data.id);
      }
  
      // Create an order on your backend
      const response = await axios.post(`${API_URL}/create-paypal-orders`, {
        registrationId: registrationId,
        firstName: formData.firstname,
        lastName: formData.lastname,
        email: formData.email,
        amount: registrationFeeAmount / 100, // Convert cents to dollars for PayPal
        currency: 'USD',
        returnUrl: `${window.location.origin}/registration-success?source=paypal`,
        cancelUrl: `${window.location.origin}/register?status=canceled`
      });
          
      if (response.data.success && response.data.approvalUrl) {
        // Redirect to PayPal
        window.location.href = response.data.approvalUrl;
      } else {
        throw new Error(response.data.message || "Failed to create PayPal order");
      }
    } catch (error) {
      console.error("PayPal error:", error);
      setSubmitStatus({
        type: "danger",
        message: error.message || "Failed to process PayPal payment. Please try again."
      });
    } finally {
      setIsProcessingPayment(false);
      setPaymentInProgress(false);
    }
  };  


    const creditCardIcon = "https://cdn-icons-png.flaticon.com/512/196/196578.png";
    const paypalIcon = "https://cdn-icons-png.flaticon.com/512/174/174861.png";
  // Form state
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phonenumber: "",
    streetaddress: "",
    apartment: "",
    city: "",
    zippostalcode: "",
    country: "",
    nameofchurch: "",
    positioninminstry: "",
    titleofoffice: "",
    husbandname: "",
    tshirtsize: "",
    eventId: "",
    paymentMethod: "", // New field for payment method selection
  });
  
  // UI states
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [activeSection, setActiveSection] = useState(1);
  const [hoverButton, setHoverButton] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [registrationId, setRegistrationId] = useState(null);
  
  const API_URL = process.env.NODE_ENV === 'production'
    ? 'https://api.feastofestherna.com/api/v1'
    : 'http://localhost:4000/api/v1';
  
  // Function to submit registration data
  const submitRegistration = async (formData) => {
    try {
      const response = await axios.post(`${API_URL}/create-registration`, formData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };
  
  // Validation function
  const validateField = (name, value) => {
    let error = "";
    
    switch (name) {
      case "firstname":
      case "lastname":
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
      case "phonenumber":
        if (!value.trim()) {
          error = "Phone number is required";
        } else if (!/^[0-9+\-\s()]{10,15}$/.test(value)) {
          error = "Please enter a valid phone number";
        }
        break;
      case "streetaddress":
        if (!value.trim()) error = "Street address is required";
        break;
      case "city":
        if (!value.trim()) error = "City is required";
        break;
      case "zippostalcode":
        if (!value.trim()) error = "ZIP/Postal code is required";
        else if (!/^[a-zA-Z0-9\s-]{4,10}$/.test(value)) {
          error = "Please enter a valid postal code";
        }
        break;
      case "country":
        if (!value || value === "Select Country") error = "Please select a country";
        break;
      case "nameofchurch":
        if (!value.trim()) error = "Church name is required";
        break;
      case "tshirtsize":
        if (!value || value === "Select TShirt size") error = "Please select a t-shirt size";
        break;
      case "paymentMethod":
        if (activeSection === 4 && !value) error = "Please select a payment method";
        break;
      default:
        break;
    }
    
    return error;
  };
  
  // Function to focus on first error field
  const focusFirstErrorField = (errors) => {
    const errorFields = Object.keys(errors).filter(key => errors[key]);
    if (errorFields.length > 0) {
      const firstErrorField = errorFields[0];
      const fieldRef = fieldRefs[firstErrorField];
      if (fieldRef && fieldRef.current) {
        fieldRef.current.focus();
        fieldRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }
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
    
    // Focus on first error field if validation fails
    if (!isValid) {
      setTimeout(() => focusFirstErrorField(newErrors), 100);
    }
    
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
    
    // Only proceed with payment if on payment section (section 4)
    if (activeSection === 4) {
      handlePayment();
      return;
    }

    // Set all fields as touched
    const allTouched = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        console.log("Submitting registration with data:", formData);
        const result = await submitRegistration(formData);
        
        console.log("Registration response:", result);
        
        if (result.success) {
          setRegistrationId(result.data.id);
          // Move to review section
          setActiveSection(4);
        } else {
          throw new Error(result.message || "Registration failed");
        }
      } catch (error) {
        console.error("Registration error:", error);
        
        setSubmitStatus({
          type: "danger",
          message: error.message || "Registration failed. Please try again."
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  // Handle payment method selection and processing
  // Update your handlePaymentMethodChange function
const handlePaymentMethodChange = (e) => {
  const method = e.target.value;
  setPaymentMethod(method);
  
  setFormData({
    ...formData,
    paymentMethod: method
  });
  
  // Clear any payment-related errors
  setErrors({
    ...errors,
    paymentMethod: ""
  });
};

  
  const handlePayment = async () => {
    // Prevent multiple payment attempts
    if (paymentInProgress) {
      console.log("Payment already in progress, ignoring duplicate request");
      return;
    }

    if (!formData.paymentMethod) {
      setErrors({
        ...errors,
        paymentMethod: "Please select a payment method"
      });
      return;
    }

    const now = Date.now();
    if (lastPaymentAttempt && (now - lastPaymentAttempt) < 5000) {
      console.log("Payment attempt too soon after last attempt, ignoring");
      return;
    }
    
    setPaymentInProgress(true);
    setIsProcessingPayment(true);
    setLastPaymentAttempt(now);
    
    try {
      if (formData.paymentMethod === "stripe") {
        // Process Stripe payment
        const stripe = await stripePromise;
        
        // Send only the data needed for payment
        const result = await createPaymentSession(formData);
        
        if (result.success && result.sessionId) {
          // Redirect to Stripe Checkout
          await stripe.redirectToCheckout({
            sessionId: result.sessionId
          });
        } else {
          throw new Error(result.message || "Payment setup failed");
        }
      } 
      // PayPal is handled by the PayPal buttons component
    } catch (error) {
      console.error("Payment error:", error);
      setSubmitStatus({
        type: "danger",
        message: error.message || "Payment setup failed. Please try again."
      });
    } finally {
      setIsProcessingPayment(false);
      setPaymentInProgress(false);
    }
  };
  
  
  const onPayPalApprove = async (data) => {
    // Prevent multiple approvals
    if (paymentInProgress) {
      console.log("Payment already being processed, ignoring duplicate approval");
      return;
    }

    setPaymentInProgress(true);
    
    try {
      window.location.href = `/registration-success?order_id=${data.orderID}&source=paypal`;
    } catch (error) {
      console.error("PayPal approval error:", error);
      setSubmitStatus({
        type: "danger",
        message: error.message || "PayPal payment process failed. Please try again."
      });
      setPaymentInProgress(false);
      setIsProcessingPayment(false);
    }
  };
  
  // Add a helper function to reset the form
  const resetForm = () => {
    setFormData({
      firstname: "",
      lastname: "",
      email: "",
      phonenumber: "",
      streetaddress: "",
      apartment: "",
      city: "",
      zippostalcode: "",
      country: "",
      nameofchurch: "",
      positioninminstry: "",
      titleofoffice: "",
      husbandname: "",
      tshirtsize: "",
      eventId: "",
      paymentMethod: "",
    });
    
    // Reset touched state
    setTouched({});
    
    // Go back to first section
    setActiveSection(1);
  };
  
  // Navigate between form sections
  const nextSection = () => {
    if (activeSection < 4) {
      setActiveSection(activeSection + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const prevSection = () => {
    if (activeSection > 1) {
      setActiveSection(activeSection - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Check if current section is valid before proceeding
  const validateSection = (section) => {
    let isValid = true;
    const fieldsToValidate = section === 1
      ? ['firstname', 'lastname', 'email', 'phonenumber']
      : section === 2
        ? ['streetaddress', 'city', 'zippostalcode', 'country']
        : section === 3
          ? ['nameofchurch', 'tshirtsize']
          : section === 4
            ? ['paymentMethod']
            : [];
    
    const newErrors = { ...errors };
    const newTouched = { ...touched };
    
    fieldsToValidate.forEach(field => {
      newTouched[field] = true;
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    setTouched(newTouched);
    
    // Focus on first error field if validation fails
    if (!isValid) {
      setTimeout(() => focusFirstErrorField(newErrors), 100);
    }
    
    return isValid;
  };
  
  const handleNext = () => {
    if (validateSection(activeSection)) {
      nextSection();
    }
  };
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Styles
  const styles = {
    formContainer: {
      background: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)",
      borderRadius: "16px",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
      marginTop: "120px",
      paddingTop: "50px",
      paddingBottom: "80px",
      paddingLeft: "50px",
      paddingRight: "50px",
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
      fontSize: "2.5rem",
      fontWeight: "700",
      marginBottom: "15px",
    },
    titleUnderline: {
      height: "3px",
      width: "80px",
      background: "linear-gradient(to right, #c80e91, #ff6ec4)",
      margin: "0 auto 10px",
    },
    subtitle: {
      color: "#666",
      fontSize: "1.1rem",
    },
    sectionHeader: {
      color: "#c80e91",
      fontSize: "1.3rem",
      fontWeight: "600",
      marginBottom: "25px",
      paddingBottom: "10px",
      borderBottom: "1px solid rgba(200, 14, 145, 0.2)",
    },
    formGroup: {
      marginBottom: "25px",
    },
    label: {
      color: "#555",
      fontWeight: "600",
      marginBottom: "8px",
      fontSize: "0.95rem",
    },
    input: {
      padding: "12px 15px",
      borderRadius: "8px",
      border: "1px solid #ddd",
      transition: "all 0.3s ease",
      fontSize: "1rem",
      width: "100%",
      backgroundColor: "#f9f9f9",
    },
    inputFocus: {
      border: "1px solid #c80e91",
      boxShadow: "0 0 0 3px rgba(200, 14, 145, 0.1)",
      backgroundColor: "#fff",
    },
    inputError: {
      border: "1px solid #e74c3c",
      backgroundColor: "rgba(231, 76, 60, 0.05)",
    },
    errorText: {
      color: "#e74c3c",
      fontSize: "0.85rem",
      marginTop: "5px",
      paddingLeft: "5px",
    },
    submitButton: {
      background: "linear-gradient(to right, #c80e91, #ff6ec4)",
      color: "white",
      border: "none",
      borderRadius: "30px",
      padding: "15px 40px",
      fontSize: "1.1rem",
      fontWeight: "600",
      cursor: "pointer",
      display: "block",
      margin: "40px auto 0",
      minWidth: "200px",
      boxShadow: "0 5px 15px rgba(200, 14, 145, 0.3)",
      transition: "all 0.3s ease",
    },
    submitButtonHover: {
      boxShadow: "0 8px 20px rgba(200, 14, 145, 0.4)",
      transform: "translateY(-2px)",
    },
    submitButtonDisabled: {
      background: "#ccc",
      cursor: "not-allowed",
      boxShadow: "none",
    },
    loadingSpinner: {
      width: "20px",
      height: "20px",
      border: "3px solid rgba(255, 255, 255, 0.3)",
      borderRadius: "50%",
      borderTopColor: "white",
      animation: "spin 1s linear infinite",
      margin: "0 auto",
    },
    navigationButtons: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "30px",
    },
    navButton: {
      background: "transparent",
      color: "#c80e91",
      border: "2px solid #c80e91",
      borderRadius: "30px",
      padding: "10px 25px",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    navButtonHover: {
      background: "rgba(200, 14, 145, 0.1)",
    },
    progressBar: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "40px",
      position: "relative",
    },
    progressLine: {
      position: "absolute",
      top: "15px",
      left: "0",
      height: "3px",
      background: "#ddd",
      width: "100%",
      zIndex: "1",
    },
    progressLineActive: {
      position: "absolute",
      top: "15px",
      left: "0",
      height: "3px",
      background: "linear-gradient(to right, #c80e91, #ff6ec4)",
      width: activeSection === 1 ? "0%" : activeSection === 2 ? "33%" : activeSection === 3 ? "66%" : "100%",
      zIndex: "2",
      transition: "width 0.5s ease",
    },
    progressStep: {
      width: "30px",
      height: "30px",
      borderRadius: "50%",
      background: "#ddd",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontWeight: "bold",
      position: "relative",
      zIndex: "3",
    },
    progressStepActive: {
      background: "linear-gradient(to right, #c80e91, #ff6ec4)",
      boxShadow: "0 0 10px rgba(200, 14, 145, 0.5)",
    },
    progressStepCompleted: {
      background: "#c80e91",
    },
    alertContainer: {
      marginTop: "30px",
    },
    formSection: {
      display: activeSection === 1 ? "block" : "none",
    },
    formSection2: {
      display: activeSection === 2 ? "block" : "none",
    },
    formSection3: {
      display: activeSection === 3 ? "block" : "none",
    },
    formSection4: {
      display: activeSection === 4 ? "block" : "none",
    },
    reviewCard: {
      border: "1px solid rgba(200, 14, 145, 0.2)",
      borderRadius: "10px",
      padding: "20px",
      marginBottom: "30px",
      backgroundColor: "rgba(255, 255, 255, 0.7)",
    },
    reviewItem: {
      display: "flex",
      marginBottom: "10px",
      borderBottom: "1px solid #eee",
      paddingBottom: "10px",
    },
    reviewLabel: {
      fontWeight: "600",
      width: "180px",
      color: "#555",
    },
    reviewValue: {
      flex: 1,
    },
    paymentMethodContainer: {
      marginTop: "30px",
      marginBottom: "30px",
    },
    paymentOption: {
      padding: "15px",
      border: "1px solid #ddd",
      borderRadius: "10px",
      marginBottom: "20px",
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    paymentOptionSelected: {
      border: "2px solid #c80e91",
      backgroundColor: "rgba(200, 14, 145, 0.05)",
    },
    paymentIcon: {
      marginRight: "15px",
      width: "50px",
      height: "30px",
      objectFit: "contain",
    },
    paypalButtonContainer: {
      width: "100%",
      maxWidth: "400px",
      margin: "30px auto",
      position: "relative",
    }
  };
  
  return (
    <Container style={{ padding: "0px 0px" }}>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={styles.formContainer}
    >
        <div style={styles.formHeader}>
          <h1 style={styles.title}>Registration Form</h1>
          <div style={styles.titleUnderline}></div>
          <p style={styles.subtitle}>Join us for the Feast of Esther 2025</p>
        </div>
        
        {/* Progress Bar */}
        <div style={styles.progressBar}>
          <div style={styles.progressLine}></div>
          <div style={styles.progressLineActive}></div>
          
          <div style={{
            ...styles.progressStep,
            ...(activeSection >= 1 ? styles.progressStepActive : {}),
          }}>1</div>
          
          <div style={{
            ...styles.progressStep,
            ...(activeSection >= 2 ? styles.progressStepActive : {}),
          }}>2</div>
          
          <div style={{
            ...styles.progressStep,
            ...(activeSection >= 3 ? styles.progressStepActive : {}),
          }}>3</div>
          
          <div style={{
            ...styles.progressStep,
            ...(activeSection >= 4 ? styles.progressStepActive : {}),
          }}>4</div>
        </div>
        
        <AnimatePresence>
          {/* Success message display */}
          {submitStatus && submitStatus.type === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                marginTop: '30px',
                textAlign: 'center',
                padding: '30px',
                borderRadius: '10px',
                background: 'rgba(40, 167, 69, 0.1)',
                border: '1px solid rgba(40, 167, 69, 0.3)'
              }}
            >
              <h3 style={{ color: '#28a745', marginBottom: '15px' }}>
                Registration Successful!
              </h3>
              <p style={{ fontSize: '1.1rem' }}>
                Thank you for registering for the Feast of Esther 2025. We've received your information and will be in touch soon.
              </p>
              <Button
                onClick={() => window.location.href = '/donate'}
                style={{
                  background: 'linear-gradient(to right, #28a745, #20c997)',
                  border: 'none',
                  borderRadius: '30px',
                  padding: '10px 30px',
                  marginTop: '15px'
                }}
              >
                Do you want to make a donation?
              </Button>
            </motion.div>
          )}
          
          {/* Error message display */}
          {submitStatus && submitStatus.type === "danger" && (
            <Alert variant="danger" style={{ marginBottom: '30px' }}>
              {submitStatus.message}
            </Alert>
          )}
        </AnimatePresence>
        
        <Form onSubmit={handleSubmit}>
          {/* Section 1: Personal Information */}
          <div style={styles.formSection}>
            <h3 style={styles.sectionHeader}>Personal Information</h3>
            <Row>
              <Col sm={12} md={6}>
                <Form.Group style={styles.formGroup}>
                  <Form.Label style={styles.label}>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    ref={fieldRefs.firstname}
                    style={{
                      ...styles.input,
                      ...(touched.firstname && errors.firstname ? styles.inputError : {}),
                      ...(document.activeElement?.name === "firstname" ? styles.inputFocus : {})
                    }}
                  />
                  {touched.firstname && errors.firstname && (
                    <div style={styles.errorText}>{errors.firstname}</div>
                  )}
                </Form.Group>
              </Col>
              <Col sm={12} md={6}>
                <Form.Group style={styles.formGroup}>
                  <Form.Label style={styles.label}>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    ref={fieldRefs.lastname}
                    style={{
                      ...styles.input,
                      ...(touched.lastname && errors.lastname ? styles.inputError : {}),
                      ...(document.activeElement?.name === "lastname" ? styles.inputFocus : {})
                    }}
                  />
                  {touched.lastname && errors.lastname && (
                    <div style={styles.errorText}>{errors.lastname}</div>
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={12} md={6}>
                <Form.Group style={styles.formGroup}>
                  <Form.Label style={styles.label}>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    ref={fieldRefs.email}
                    style={{
                      ...styles.input,
                      ...(touched.email && errors.email ? styles.inputError : {}),
                      ...(document.activeElement?.name === "email" ? styles.inputFocus : {})
                    }}
                  />
                  {touched.email && errors.email && (
                    <div style={styles.errorText}>{errors.email}</div>
                  )}
                </Form.Group>
              </Col>
              <Col sm={12} md={6}>
                <Form.Group style={styles.formGroup}>
                  <Form.Label style={styles.label}>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="phonenumber"
                    value={formData.phonenumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    ref={fieldRefs.phonenumber}
                    style={{
                      ...styles.input,
                      ...(touched.phonenumber && errors.phonenumber ? styles.inputError : {}),
                      ...(document.activeElement?.name === "phonenumber" ? styles.inputFocus : {})
                    }}
                  />
                  {touched.phonenumber && errors.phonenumber && (
                    <div style={styles.errorText}>{errors.phonenumber}</div>
                  )}
                </Form.Group>
              </Col>
            </Row>
            <div style={styles.navigationButtons}>
              <div></div> {/* Empty div for spacing */}
              <Button
                type="button"
                onClick={handleNext}
                onMouseEnter={() => setHoverButton(true)}
                onMouseLeave={() => setHoverButton(false)}
                style={{
                  ...styles.navButton,
                  ...(hoverButton ? styles.navButtonHover : {})
                }}
              >
                Next <span style={{ marginLeft: "5px" }}>→</span>
              </Button>
            </div>
          </div>
          
          {/* Section 2: Address Information */}
          <div style={styles.formSection2}>
            <h3 style={styles.sectionHeader}>Address Information</h3>
            <Row>
              <Col sm={12} md={6}>
                <Form.Group style={styles.formGroup}>
                  <Form.Label style={styles.label}>Street Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="streetaddress"
                    value={formData.streetaddress}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    ref={fieldRefs.streetaddress}
                    style={{
                      ...styles.input,
                      ...(touched.streetaddress && errors.streetaddress ? styles.inputError : {}),
                      ...(document.activeElement?.name === "streetaddress" ? styles.inputFocus : {})
                    }}
                  />
                  {touched.streetaddress && errors.streetaddress && (
                    <div style={styles.errorText}>{errors.streetaddress}</div>
                  )}
                </Form.Group>
              </Col>
              <Col sm={12} md={6}>
                <Form.Group style={styles.formGroup}>
                  <Form.Label style={styles.label}>Apartment/Suite</Form.Label>
                  <Form.Control
                    type="text"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{
                      ...styles.input,
                      ...(touched.apartment && errors.apartment ? styles.inputError : {}),
                      ...(document.activeElement?.name === "apartment" ? styles.inputFocus : {})
                    }}
                  />
                  {touched.apartment && errors.apartment && (
                    <div style={styles.errorText}>{errors.apartment}</div>
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={12} md={6}>
                <Form.Group style={styles.formGroup}>
                  <Form.Label style={styles.label}>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    ref={fieldRefs.city}
                    style={{
                      ...styles.input,
                      ...(touched.city && errors.city ? styles.inputError : {}),
                      ...(document.activeElement?.name === "city" ? styles.inputFocus : {})
                    }}
                  />
                  {touched.city && errors.city && (
                    <div style={styles.errorText}>{errors.city}</div>
                  )}
                </Form.Group>
              </Col>
              <Col sm={12} md={6}>
                <Form.Group style={styles.formGroup}>
                  <Form.Label style={styles.label}>ZIP/Postal Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="zippostalcode"
                    value={formData.zippostalcode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{
                      ...styles.input,
                      ...(touched.zippostalcode && errors.zippostalcode ? styles.inputError : {}),
                      ...(document.activeElement?.name === "zippostalcode" ? styles.inputFocus : {})
                    }}
                  />
                  {touched.zippostalcode && errors.zippostalcode && (
                    <div style={styles.errorText}>{errors.zippostalcode}</div>
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
                <Form.Group style={styles.formGroup}>
                  <Form.Label style={styles.label}>Country</Form.Label>
                  <Form.Control
                    as="select"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    ref={fieldRefs.country}
                    style={{
                      ...styles.input,
                      ...(touched.country && errors.country ? styles.inputError : {}),
                      ...(document.activeElement?.name === "country" ? styles.inputFocus : {})
                    }}
                  >
                    <option>Select Country</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </Form.Control>
                  {touched.country && errors.country && (
                    <div style={styles.errorText}>{errors.country}</div>
                  )}
                </Form.Group>
              </Col>
            </Row>
            <div style={styles.navigationButtons}>
              <Button
                type="button"
                onClick={prevSection}
                onMouseEnter={() => setHoverButton(true)}
                onMouseLeave={() => setHoverButton(false)}
                style={{
                  ...styles.navButton,
                  ...(hoverButton ? styles.navButtonHover : {})
                }}
              >
                <span style={{ marginRight: "5px" }}>←</span> Previous
              </Button>
              <Button
                type="button"
                onClick={handleNext}
                onMouseEnter={() => setHoverButton(true)}
                onMouseLeave={() => setHoverButton(false)}
                style={{
                  ...styles.navButton,
                  ...(hoverButton ? styles.navButtonHover : {})
                }}
              >
                Next <span style={{ marginLeft: "5px" }}>→</span>
              </Button>
            </div>
          </div>
          
          {/* Section 3: Church & Event Information */}
          <div style={styles.formSection3}>
            <h3 style={styles.sectionHeader}>Church & Event Information</h3>
            <Row>
              <Col sm={12} md={6}>
                <Form.Group style={styles.formGroup}>
                  <Form.Label style={styles.label}>Name of Church</Form.Label>
                  <Form.Control
                    type="text"
                    name="nameofchurch"
                    value={formData.nameofchurch}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    ref={fieldRefs.nameofchurch}
                    style={{
                      ...styles.input,
                      ...(touched.nameofchurch && errors.nameofchurch ? styles.inputError : {}),
                      ...(document.activeElement?.name === "nameofchurch" ? styles.inputFocus : {})
                    }}
                  />
                  {touched.nameofchurch && errors.nameofchurch && (
                    <div style={styles.errorText}>{errors.nameofchurch}</div>
                  )}
                </Form.Group>
              </Col>
              <Col sm={12} md={6}>
                <Form.Group style={styles.formGroup}>
                  <Form.Label style={styles.label}>Position in Ministry</Form.Label>
                  <Form.Control
                                       type="text"
                                       name="positioninminstry"
                                       value={formData.positioninminstry}
                                       onChange={handleChange}
                                       onBlur={handleBlur}
                                       style={{
                                         ...styles.input,
                                         ...(touched.positioninminstry && errors.positioninminstry ? styles.inputError : {}),
                                         ...(document.activeElement?.name === "positioninminstry" ? styles.inputFocus : {})
                                       }}
                                     />
                                     {touched.positioninminstry && errors.positioninminstry && (
                                       <div style={styles.errorText}>{errors.positioninminstry}</div>
                                     )}
                                   </Form.Group>
                                 </Col>
                               </Row>
                               <Row>
                                 <Col sm={12} md={6}>
                                   <Form.Group style={styles.formGroup}>
                                     <Form.Label style={styles.label}>Title of Office</Form.Label>
                                     <Form.Control
                                       type="text"
                                       name="titleofoffice"
                                       value={formData.titleofoffice}
                                       onChange={handleChange}
                                       onBlur={handleBlur}
                                       style={{
                                         ...styles.input,
                                         ...(touched.titleofoffice && errors.titleofoffice ? styles.inputError : {}),
                                         ...(document.activeElement?.name === "titleofoffice" ? styles.inputFocus : {})
                                       }}
                                     />
                                     {touched.titleofoffice && errors.titleofoffice && (
                                       <div style={styles.errorText}>{errors.titleofoffice}</div>
                                     )}
                                   </Form.Group>
                                 </Col>
                                 <Col sm={12} md={6}>
                                   <Form.Group style={styles.formGroup}>
                                     <Form.Label style={styles.label}>Husband's Name (if applicable)</Form.Label>
                                     <Form.Control
                                       type="text"
                                       name="husbandname"
                                       value={formData.husbandname}
                                       onChange={handleChange}
                                       onBlur={handleBlur}
                                       style={{
                                         ...styles.input,
                                         ...(touched.husbandname && errors.husbandname ? styles.inputError : {}),
                                         ...(document.activeElement?.name === "husbandname" ? styles.inputFocus : {})
                                       }}
                                     />
                                     {touched.husbandname && errors.husbandname && (
                                       <div style={styles.errorText}>{errors.husbandname}</div>
                                     )}
                                   </Form.Group>
                                 </Col>
                               </Row>
                               <Row>
                                 <Col sm={12} md={6}>
                                   <Form.Group style={styles.formGroup}>
                                     <Form.Label style={styles.label}>T-Shirt Size</Form.Label>
                                     <Form.Control
                                       as="select"
                                       name="tshirtsize"
                                       value={formData.tshirtsize}
                                       onChange={handleChange}
                                       onBlur={handleBlur}
                                       ref={fieldRefs.tshirtsize}
                                       style={{
                                         ...styles.input,
                                         ...(touched.tshirtsize && errors.tshirtsize ? styles.inputError : {}),
                                         ...(document.activeElement?.name === "tshirtsize" ? styles.inputFocus : {})
                                       }}
                                     >
                                       <option value="">Select Size</option>
                                       <option value="S">Small</option>
                                       <option value="M">Medium</option>
                                       <option value="L">Large</option>
                                       <option value="XL">X-Large</option>
                                       <option value="2XL">2X-Large</option>
                                       <option value="3XL">3X-Large</option>
                                     </Form.Control>
                                     {touched.tshirtsize && errors.tshirtsize && (
                                       <div style={styles.errorText}>{errors.tshirtsize}</div>
                                     )}
                                   </Form.Group>
                                 </Col>
                                 <Col sm={12} md={6}>
                                   <Form.Group style={styles.formGroup}>
                                     <Form.Label style={styles.label}>Select Event</Form.Label>
                                     <Form.Control
                                       as="select"
                                       name="eventId"
                                       value={formData.eventId}
                                       onChange={handleChange}
                                       onBlur={handleBlur}
                                       style={{
                                         ...styles.input,
                                         ...(touched.eventId && errors.eventId ? styles.inputError : {}),
                                         ...(document.activeElement?.name === "eventId" ? styles.inputFocus : {})
                                       }}
                                     >
                                       <option value="">Select Event</option>
                                       {events.map((event) => (
                                         <option key={event.id} value={event.id}>
                                           {event.name} - {new Date(event.date).toLocaleDateString()}
                                         </option>
                                       ))}
                                     </Form.Control>
                                     {touched.eventId && errors.eventId && (
                                       <div style={styles.errorText}>{errors.eventId}</div>
                                     )}
                                   </Form.Group>
                                 </Col>
                               </Row>
                               <div style={styles.navigationButtons}>
                                 <Button
                                   type="button"
                                   onClick={prevSection}
                                   onMouseEnter={() => setHoverButton(true)}
                                   onMouseLeave={() => setHoverButton(false)}
                                   style={{
                                     ...styles.navButton,
                                     ...(hoverButton ? styles.navButtonHover : {})
                                   }}
                                 >
                                   <span style={{ marginRight: "5px" }}>←</span> Previous
                                 </Button>
                                 <Button
                                   type="submit"
                                   onMouseEnter={() => setHoverButton(true)}
                                   onMouseLeave={() => setHoverButton(false)}
                                   disabled={isSubmitting}
                                   style={{
                                     ...styles.navButton,
                                     ...(hoverButton ? styles.navButtonHover : {})
                                   }}
                                 >
                                   {isSubmitting ? (
                                     <div style={styles.loadingSpinner}></div>
                                   ) : (
                                     <>
                                       Review & Pay <span style={{ marginLeft: "5px" }}>→</span>
                                     </>
                                   )}
                                 </Button>
                               </div>
                             </div>
                             
                             {/* Section 4: Review & Payment */}
                             <div style={styles.formSection4}>
                               <h3 style={styles.sectionHeader}>Review Your Information</h3>
                               
                               <div style={styles.reviewCard}>
                                 <h4 style={{ color: '#555', marginBottom: '15px' }}>Personal Information</h4>
                                 <div style={styles.reviewItem}>
                                   <div style={styles.reviewLabel}>Name:</div>
                                   <div style={styles.reviewValue}>{formData.firstname} {formData.lastname}</div>
                                 </div>
                                 <div style={styles.reviewItem}>
                                   <div style={styles.reviewLabel}>Email:</div>
                                   <div style={styles.reviewValue}>{formData.email}</div>
                                 </div>
                                 <div style={styles.reviewItem}>
                                   <div style={styles.reviewLabel}>Phone:</div>
                                   <div style={styles.reviewValue}>{formData.phonenumber}</div>
                                 </div>
                               </div>
                               
                               <div style={styles.reviewCard}>
                                 <h4 style={{ color: '#555', marginBottom: '15px' }}>Address</h4>
                                 <div style={styles.reviewItem}>
                                   <div style={styles.reviewLabel}>Street Address:</div>
                                   <div style={styles.reviewValue}>{formData.streetaddress}</div>
                                 </div>
                                 {formData.apartment && (
                                   <div style={styles.reviewItem}>
                                     <div style={styles.reviewLabel}>Apartment/Suite:</div>
                                     <div style={styles.reviewValue}>{formData.apartment}</div>
                                   </div>
                                 )}
                                 <div style={styles.reviewItem}>
                                   <div style={styles.reviewLabel}>City:</div>
                                   <div style={styles.reviewValue}>{formData.city}</div>
                                 </div>
                                 <div style={styles.reviewItem}>
                                   <div style={styles.reviewLabel}>ZIP/Postal Code:</div>
                                   <div style={styles.reviewValue}>{formData.zippostalcode}</div>
                                 </div>
                                 <div style={styles.reviewItem}>
                                   <div style={styles.reviewLabel}>Country:</div>
                                   <div style={styles.reviewValue}>{formData.country}</div>
                                 </div>
                               </div>
                               
                               <div style={styles.reviewCard}>
                                 <h4 style={{ color: '#555', marginBottom: '15px' }}>Church & Event Information</h4>
                                 <div style={styles.reviewItem}>
                                   <div style={styles.reviewLabel}>Church:</div>
                                   <div style={styles.reviewValue}>{formData.nameofchurch}</div>
                                 </div>
                                 {formData.positioninminstry && (
                                   <div style={styles.reviewItem}>
                                     <div style={styles.reviewLabel}>Position:</div>
                                     <div style={styles.reviewValue}>{formData.positioninminstry}</div>
                                   </div>
                                 )}
                                 {formData.titleofoffice && (
                                   <div style={styles.reviewItem}>
                                     <div style={styles.reviewLabel}>Title:</div>
                                     <div style={styles.reviewValue}>{formData.titleofoffice}</div>
                                   </div>
                                 )}
                                 {formData.husbandname && (
                                   <div style={styles.reviewItem}>
                                     <div style={styles.reviewLabel}>Husband's Name:</div>
                                     <div style={styles.reviewValue}>{formData.husbandname}</div>
                                   </div>
                                 )}
                                 <div style={styles.reviewItem}>
                                   <div style={styles.reviewLabel}>T-Shirt Size:</div>
                                   <div style={styles.reviewValue}>{formData.tshirtsize}</div>
                                 </div>
                                 <div style={styles.reviewItem}>
                                   <div style={styles.reviewLabel}>Event:</div>
                                   <div style={styles.reviewValue}>
                                     {events.find(e => e.id === formData.eventId)?.name || 'Selected Event'}
                                   </div>
                                 </div>
                               </div>
                               
                               <div style={styles.reviewCard}>
  <h4 style={{ color: '#555', marginBottom: '15px' }}>Payment</h4>
  <div style={styles.reviewItem}>
    <div style={styles.reviewLabel}>Registration Fee:</div>
    <div style={styles.reviewValue}>${registrationFeeAmount / 100}.00</div>
  </div>
  
  <div style={styles.paymentMethodContainer}>
    <h5 style={{ marginBottom: '15px', color: '#555' }}>Select Payment Method</h5>
    
    <div
      style={{
        ...styles.paymentOption,
        ...(paymentMethod === 'stripe' ? styles.paymentOptionSelected : {})
      }}
      onClick={() => handlePaymentMethodChange({ target: { value: 'stripe' } })}
    >
      <img
        src={creditCardIcon}
        alt="Credit Card"
        style={styles.paymentIcon}
      />
      <span>Credit Card (via Stripe)</span>
    </div>
    
    <div
      style={{
        ...styles.paymentOption,
        ...(paymentMethod === 'paypal' ? styles.paymentOptionSelected : {})
      }}
      onClick={() => handlePaymentMethodChange({ target: { value: 'paypal' } })}
    >
      <img
        src={paypalIcon}
        alt="PayPal"
        style={styles.paymentIcon}
      />
      <span>PayPal</span>
    </div>
    
    <div
      style={{
        ...styles.paymentOption,
        ...(paymentMethod === 'zelle' ? styles.paymentOptionSelected : {})
      }}
      onClick={() => handlePaymentMethodChange({ target: { value: 'zelle' } })}
    >
      <div style={{
        ...styles.paymentIcon,
        backgroundColor: '#6c1fff',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '14px',
        borderRadius: '4px'
      }}>
        Z
      </div>
      <span>Zelle</span>
    </div>
    
    {touched.paymentMethod && errors.paymentMethod && (
      <div style={styles.errorText}>{errors.paymentMethod}</div>
    )}
  </div>
</div>

{paymentMethod === 'paypal' && (
  <div style={styles.paypalButtonContainer}>
    {paymentInProgress && (
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        borderRadius: '10px'
      }}>
        <div style={styles.loadingSpinner}></div>
        <span style={{ marginLeft: '10px', color: '#c80e91' }}>Processing payment...</span>
      </div>
    )}
    <PayPalScriptProvider options={{
      "client-id": paypalClientId || "your_paypal_client_id_here",
      currency: "USD",
      intent: "capture"
    }}>
      <PayPalButtons
        disabled={paymentInProgress}
        style={{
          layout: "vertical",
          color: "blue",
          shape: "rect",
          label: "pay",
        }}
        createOrder={async () => {
          // Prevent multiple order creation attempts
          if (paymentInProgress) {
            console.log("Payment already in progress, preventing duplicate order creation");
            return null;
          }

          setPaymentInProgress(true);
          
          try {
            const paymentData = {
              registrationId: registrationId,
              name: `${formData.firstname} ${formData.lastname}`,
              email: formData.email,
              amount: registrationFeeAmount / 100,
              currency: 'USD'
            };
            
            const response = await createPayPalOrder(paymentData);
            
            if (response.success && response.orderId) {
              return response.orderId;
            } else {
              throw new Error(response.message || "Failed to create PayPal order");
            }
          } catch (error) {
            console.error("PayPal order creation error:", error);
            setSubmitStatus({
              type: "danger",
              message: error.message || "Failed to create PayPal order. Please try again."
            });
            setPaymentInProgress(false);
            return null;
          }
        }}
        onApprove={onPayPalApprove}
      />
    </PayPalScriptProvider>
  </div>
)}

{paymentMethod === 'zelle' && (
  <div style={{
    ...styles.reviewCard,
    backgroundColor: 'rgba(108, 31, 255, 0.05)',
    border: '2px solid rgba(108, 31, 255, 0.2)',
    marginTop: '20px'
  }}>
    <h4 style={{ color: '#6c1fff', marginBottom: '20px', textAlign: 'center' }}>
      <i className="fas fa-mobile-alt" style={{ marginRight: '10px' }}></i>
      Pay with Zelle
    </h4>
    
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
      <div style={{
        backgroundColor: '#6c1fff',
        color: 'white',
        padding: '15px',
        borderRadius: '10px',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        marginBottom: '15px'
      }}>
        Send $120.00 to: rccgnafoe@gmail.com
      </div>
      
      <div style={{ fontSize: '1rem', color: '#666', lineHeight: '1.6' }}>
        <p><strong>Instructions:</strong></p>
        <ol style={{ textAlign: 'left', maxWidth: '400px', margin: '0 auto' }}>
          <li>Open your banking app</li>
          <li>Select "Send Money with Zelle"</li>
          <li>Enter email: <strong>rccgnafoe@gmail.com</strong></li>
          <li>Enter amount: <strong>${registrationFeeAmount / 100}.00</strong></li>
          <li>Add memo: <strong>Registration - {formData.firstname} {formData.lastname}</strong></li>
          <li>Send the payment</li>
          <li>Click "I've Sent Payment" below</li>
        </ol>
      </div>
    </div>
    
    <div style={{ textAlign: 'center' }}>
      <Button
        onClick={() => {
          // Handle Zelle payment confirmation
          setSubmitStatus({
            type: "success",
            message: "Thank you! We'll verify your Zelle payment and confirm your registration within 24 hours. You'll receive an email confirmation once verified."
          });
        }}
        style={{
          backgroundColor: '#6c1fff',
          border: 'none',
          borderRadius: '30px',
          padding: '12px 30px',
          fontSize: '1.1rem',
          fontWeight: '600',
          color: 'white'
        }}
      >
        I've Sent the Zelle Payment
      </Button>
    </div>
    
    <div style={{
      marginTop: '20px',
      padding: '15px',
      backgroundColor: 'rgba(255, 193, 7, 0.1)',
      borderRadius: '8px',
      fontSize: '0.9rem',
      color: '#856404'
    }}>
      <i className="fas fa-info-circle" style={{ marginRight: '8px' }}></i>
      <strong>Note:</strong> Your registration will be confirmed once we receive and verify your Zelle payment. 
      This usually takes 1-24 hours during business days.
    </div>
  </div>
)}

<div style={styles.navigationButtons}>
  <Button
    type="button"
    onClick={prevSection}
    onMouseEnter={() => setHoverButton(true)}
    onMouseLeave={() => setHoverButton(false)}
    style={{
      ...styles.navButton,
      ...(hoverButton ? styles.navButtonHover : {})
    }}
  >
    <span style={{ marginRight: "5px" }}>←</span> Back to Form
  </Button>
  
  {paymentMethod === 'stripe' && (
    <Button
      type="button"
      onClick={handlePayment}
      disabled={isProcessingPayment || paymentInProgress}
      style={{
        ...styles.submitButton,
        ...(isProcessingPayment || paymentInProgress ? styles.submitButtonDisabled : {})
      }}
    >
      {isProcessingPayment || paymentInProgress ? (
        <div style={styles.loadingSpinner}></div>
      ) : (
        'Pay with Credit Card'
      )}
    </Button>
  )}
  
{paymentMethod === 'paypal' && (
  <Button
    type="button"
    onClick={handlePayPalRedirect}
    disabled={isProcessingPayment || paymentInProgress}
    style={{
      ...styles.submitButton,
      background: '#0070ba', // Changed from backgroundColor to background
      ...(isProcessingPayment || paymentInProgress ? styles.submitButtonDisabled : {})
    }}
  >
    {isProcessingPayment || paymentInProgress ? (
      <div style={styles.loadingSpinner}></div>
    ) : (
      'Pay with PayPal'
    )}
  </Button>
)}

{paymentMethod === 'zelle' && (
  <div style={{ textAlign: 'center' }}>
    <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '10px' }}>
      Follow the Zelle instructions above to complete your payment
    </p>
  </div>
)}

</div>
</div>
        </Form>
      </motion.div>
      {/* Keyframes for spinner animation */}
      <style jsx="true">{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Container>
  );
};

export default RegistrationForm;

  