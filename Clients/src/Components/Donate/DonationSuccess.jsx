import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.feastofestherna.com/api/v1'
  : 'http://localhost:4000/api/v1';

const DonationSuccess = () => {
  const [searchParams] = useSearchParams();
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Get parameters from both payment methods
  const sessionId = searchParams.get("session_id");
  const paypalToken = searchParams.get("token");
  const paypalPayerId = searchParams.get("PayerID");

  useEffect(() => {
    window.scrollTo(0, 0);

    const checkPaymentStatus = async () => {
      try {
        // Handle Stripe verification
        if (sessionId) {
          console.log("Verifying Stripe session:", sessionId);
          const response = await axios.get(`${API_URL}/verify-donation-session`, {
            params: { sessionId }
          });
          
          console.log("Stripe verification response:", response.data);
          setVerified(response.data.success);
        } 
        // Handle PayPal verification
        else if (paypalToken && paypalPayerId) {
          console.log("Verifying PayPal payment:", paypalToken);
          const response = await axios.get(`${API_URL}/verify-paypal-payment`, {
            params: { 
              token: paypalToken,
              PayerID: paypalPayerId
            }
          });
          
          console.log("PayPal verification response:", response.data);
          setVerified(response.data.success);
        } 
        else {
          console.log("No payment identifier found");
          setVerified(false);
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        setVerified(false);
      } finally {
        setLoading(false);
      }
    };

    checkPaymentStatus();
  }, [sessionId, paypalToken, paypalPayerId]);


  const styles = {
    container: {
      paddingTop: "120px",
      paddingBottom: "80px",
    },
    card: {
      padding: "40px",
      borderRadius: "15px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
    },
    icon: {
      fontSize: "5rem",
      color: "#28a745",
      marginBottom: "20px",
    },
    title: {
      color: "#c80e91",
      fontSize: "2.2rem",
      fontWeight: "700",
      marginBottom: "20px",
    },
    subtitle: {
      color: "#666",
      fontSize: "1.1rem",
      marginBottom: "30px",
      maxWidth: "600px",
    },
    button: {
      margin: "10px",
      padding: "12px 30px",
      fontSize: "1.1rem",
      backgroundColor: "#c80e91",
      borderColor: "#c80e91",
    },
    loadingSpinner: {
      color: "#c80e91",
      width: "3rem",
      height: "3rem",
      margin: "20px auto",
    },
  };

  if (loading) {
    return (
      <Container style={styles.container}>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card style={styles.card}>
              <div className="text-center">
                <div className="spinner-border" style={styles.loadingSpinner} role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <h2>Verifying your contribution...</h2>
                <p>Please wait while we confirm your payment.</p>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container style={styles.container}>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card style={styles.card}>
              {verified ? (
                <>
                  <i className="fas fa-check-circle" style={styles.icon}></i>
                  <h1 style={styles.title}>Thank You for Your Contribution!</h1>
                  <p style={styles.subtitle}>
                    Your generous gift has been received and will help support our ministry's mission. 
                    We're grateful for your kindness and commitment to our cause.
                  </p>
                  <div>
                    <Link to="/">
                      <Button style={styles.button}>Return to Homepage</Button>
                    </Link>
                    <Link to="/contact">
                      <Button variant="outline-primary" style={{ ...styles.button, background: "transparent", border: "2px solid #c80e91", color: "#c80e91" }}>
                        Contact Us
                      </Button>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <i className="fas fa-exclamation-triangle" style={{ ...styles.icon, color: "#dc3545" }}></i>
                  <h1 style={{ ...styles.title, color: "#dc3545" }}>Verification Issue</h1>
                  <p style={styles.subtitle}>
                    We couldn't verify your contribution at this moment. Don't worry - if your payment was processed, 
                    it will still be recorded. Please contact us if you have any questions.
                  </p>
                  <div>
                    <Link to="/donate">
                      <Button style={styles.button}>Try Again</Button>
                    </Link>
                    <Link to="/contact">
                      <Button variant="outline-primary" style={{ ...styles.button, background: "transparent", border: "2px solid #c80e91", color: "#c80e91" }}>
                        Contact Support
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </Card>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
};

export default DonationSuccess;
