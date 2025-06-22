import React, { useEffect, useState } from 'react';
import { Container, Button, Alert, Spinner } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyPayment } from '../services/stripeService';
import { capturePayPalOrder } from '../services/paypalService';

const RegistrationSuccess = () => {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const verifyPaymentStatus = async () => {
      // Get query parameters
      const queryParams = new URLSearchParams(location.search);
      const sessionId = queryParams.get('session_id');
      const paypalOrderId = queryParams.get('order_id');
      const paymentSource = queryParams.get('source');
      
      try {
        let result;
        
        if (sessionId && paymentSource === 'stripe') {
          // Verify Stripe payment
          result = await verifyPayment(sessionId);
        } else if (paypalOrderId && paymentSource === 'paypal') {
          // Verify PayPal payment
          result = await capturePayPalOrder(paypalOrderId);
        } else {
          // Direct access without payment
          setStatus('error');
          setMessage('Invalid payment information. Please contact support.');
          return;
        }
        
        if (result.success) {
          setStatus('success');
          setMessage(result.message || 'Registration and payment completed successfully!');
        } else {
          setStatus('error');
          setMessage(result.message || 'There was a problem with your payment. Please contact support.');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('error');
        setMessage('An error occurred while verifying your payment. Please contact support.');
      }
    };
    
    verifyPaymentStatus();
  }, [location]);
  
  const styles = {
    container: {
      padding: '50px 20px',
      maxWidth: '800px',
      margin: '80px auto',
      textAlign: 'center',
      background: 'white',
      borderRadius: '10px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    },
    heading: {
      color: '#c80e91',
      marginBottom: '30px',
    },
    message: {
      fontSize: '1.2rem',
      marginBottom: '30px',
    },
    button: {
      background: 'linear-gradient(to right, #c80e91, #ff6ec4)',
      border: 'none',
      borderRadius: '30px',
      padding: '15px 40px',
      fontSize: '1.1rem',
      fontWeight: '600',
      margin: '20px 10px',
    },
  };
  
  return (
    <Container style={styles.container}>
      <h1 style={styles.heading}>Registration Status</h1>
      
      {status === 'loading' && (
        <div>
          <Spinner animation="border" variant="primary" />
          <p style={styles.message}>Verifying your payment status...</p>
        </div>
      )}
      
      {status === 'success' && (
        <>
          <Alert variant="success">
            <Alert.Heading>Success!</Alert.Heading>
            <p>{message}</p>
          </Alert>
          
          <p style={styles.message}>
            Thank you for registering for the Feast of Esther 2025! We're excited to have you join us.
          </p>
          
          <div>
            <Button 
              style={styles.button}
              onClick={() => navigate('/donate')}
            >
              Make a Donation
            </Button>
            
            <Button 
              style={{...styles.button, background: 'linear-gradient(to right, #3498db, #2980b9)'}}
              onClick={() => navigate('/')}
            >
              Return Home
            </Button>
          </div>
        </>
      )}
      
      {status === 'error' && (
        <>
          <Alert variant="danger">
            <Alert.Heading>There was a problem</Alert.Heading>
            <p>{message}</p>
          </Alert>
          
          <Button 
            style={styles.button}
            onClick={() => navigate('/register')}
          >
            Try Again
          </Button>
        </>
      )}
    </Container>
  );
};

export default RegistrationSuccess;
