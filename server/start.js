// Load production environment variables
require('dotenv').config({ path: '.env.production' });

// Start the server
require('./src/index.js');
