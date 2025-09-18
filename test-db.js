const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Testing database connection...');
    const client = await pool.connect();
    console.log('✅ Database connection successful!');
    
    // Test a simple query
    const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
    console.log('📊 Database info:');
    console.log(`- Current time: ${result.rows[0].current_time}`);
    console.log(`- PostgreSQL version: ${result.rows[0].pg_version}`);
    
    client.release();
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
  } finally {
    await pool.end();
  }
}

testConnection();
