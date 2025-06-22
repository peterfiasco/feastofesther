const mysql = require('mysql2/promise');

// Database configuration with better error handling for XAMPP
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'feast_of_esther',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  idleTimeout: 300000,
  // Add these for better XAMPP compatibility
  charset: 'utf8mb4',
  timezone: '+00:00'
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Enhanced connection test with retry logic
const testConnection = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Attempting database connection (attempt ${i + 1}/${retries})...`);
      
      const connection = await pool.getConnection();
      console.log('✅ Database connection established successfully');
      
      // Test a simple query
      const [rows] = await connection.query('SELECT 1 as test, NOW() as server_time');
      console.log('✅ Database query test successful:', rows[0]);
      
      // Test if our main tables exist
      try {
        const [tables] = await connection.query(`
          SELECT TABLE_NAME 
          FROM information_schema.TABLES 
          WHERE TABLE_SCHEMA = ? AND TABLE_NAME IN ('registrations', 'donations')
        `, [process.env.DB_NAME || 'feast_of_esther']);
        
        console.log('📋 Available tables:', tables.map(t => t.TABLE_NAME));
        
        if (tables.length === 0) {
          console.log('⚠️  Warning: Main tables (registrations, donations) not found. You may need to run database setup.');
        }
      } catch (tableError) {
        console.log('⚠️  Could not check table existence:', tableError.message);
      }
      
      connection.release();
      return true;
      
    } catch (error) {
      console.error(`❌ Database connection attempt ${i + 1} failed:`, error.message);
      
      if (error.code === 'ECONNREFUSED') {
        console.error('🔧 XAMPP MySQL server appears to be down. Please:');
        console.error('   1. Start XAMPP Control Panel');
        console.error('   2. Start MySQL service');
        console.error('   3. Ensure MySQL is running on port 3306');
      } else if (error.code === 'ER_BAD_DB_ERROR') {
        console.error('🔧 Database does not exist. Please:');
        console.error('   1. Open phpMyAdmin (http://localhost/phpmyadmin)');
        console.error('   2. Create database "feast_of_esther"');
        console.error('   3. Run the database setup script');
      } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
        console.error('🔧 Database access denied. Please check:');
        console.error('   1. Username and password in .env file');
        console.error('   2. MySQL user permissions');
      }
      
      if (i === retries - 1) {
        console.error('💥 All database connection attempts failed');
        return false;
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  return false;
};

// Handle connection errors gracefully
pool.on('connection', (connection) => {
  console.log('New database connection established as id ' + connection.threadId);
});

pool.on('error', (err) => {
  console.error('Database pool error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('Database connection lost, attempting to reconnect...');
    testConnection();
  } else {
    throw err;
  }
});

// Enhanced query wrapper with error handling
const executeQuery = async (query, params = []) => {
  try {
    const [results] = await pool.execute(query, params);
    return results;
  } catch (error) {
    console.error('Query execution error:', error.message);
    console.error('Query:', query);
    console.error('Params:', params);
    throw error;
  }
};

// Call this when the server starts
testConnection().then(success => {
  if (!success) {
    console.error('⚠️  Server starting without database connection. Some features may not work.');
  }
});

// Export both the pool and the enhanced query function
module.exports = pool;
module.exports.executeQuery = executeQuery;
module.exports.testConnection = testConnection;