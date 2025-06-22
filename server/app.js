const cors = require('cors');

// Configure CORS
// Configure CORS
app.use(cors({
  origin: [
    'https://feastofestherna.com',
    'http://localhost:3001',
    'http://localhost:3000',
    'http://localhost:5001',
    'https://www.feastofestherna.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));



// Make sure this comes BEFORE the routes
app.use(express.json());

// Then your routes
app.use('/api/v1', paymentRoutes);

// Special handling for Stripe webhook (must be raw body)
app.post('/api/v1/stripe-webhook',
  express.raw({type: 'application/json'}),
  paymentController.handleStripeWebhook
);
