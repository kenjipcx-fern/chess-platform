import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as schema from './schema';

dotenv.config({ path: '.env.local' });

// Create connection pool for PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  max: 20, // Maximum number of connections in the pool
  min: 5,  // Minimum number of connections in the pool
  idleTimeoutMillis: 30000, // Close connections after 30 seconds of inactivity
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});

// Initialize Drizzle with the connection pool and schema
export const db = drizzle(pool, { schema });

// Export the pool for direct use if needed
export { pool };

// Graceful shutdown handler
process.on('SIGINT', async () => {
  console.log('Closing database pool...');
  await pool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Closing database pool...');
  await pool.end();
  process.exit(0);
});
