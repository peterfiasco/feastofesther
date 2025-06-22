require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const registrationRoutes = require('./routes/registrationRoutes');
const stripeRoutes = require('./routes/stripeRoutes');
const donationRoutes = require('./routes/donationRoutes'); // Add this line
const donationController = require('./controllers/donationController');

const cors = require('cors');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
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

// Add session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

app.use((req, res, next) => {
  if (req.originalUrl === '/api/v1/stripe/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/v1', registrationRoutes);
app.use('/api/v1/stripe', stripeRoutes);
app.use('/api/v1', donationRoutes);




// Test route
app.get('/', (req, res) => {
  res.send('Feast of Esther API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
