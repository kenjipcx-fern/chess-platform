const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function testApi() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('🔍 Testing API endpoints with database queries...\n');
    
    // Test 1: Check if users exist
    console.log('1️⃣ Checking users table...');
    const users = await pool.query('SELECT id, username, elo_rating FROM users LIMIT 5');
    console.log(`   ✅ Found ${users.rows.length} users:`);
    users.rows.forEach(user => {
      console.log(`   📁 ${user.username} (${user.elo_rating} ELO)`);
    });
    
    // Test 2: Check games table
    console.log('\n2️⃣ Checking games table...');
    const games = await pool.query(`
      SELECT g.id, g.status, g.move_count, g.created_at,
             u1.username as white_player, u2.username as black_player
      FROM games g
      LEFT JOIN users u1 ON g.white_player_id = u1.id
      LEFT JOIN users u2 ON g.black_player_id = u2.id
      ORDER BY g.created_at DESC
      LIMIT 5
    `);
    console.log(`   ✅ Found ${games.rows.length} games:`);
    games.rows.forEach(game => {
      console.log(`   🎮 ${game.white_player || 'Unknown'} vs ${game.black_player || 'Unknown'}`);
      console.log(`      Status: ${game.status}, Moves: ${game.move_count}, ID: ${game.id.substring(0, 8)}...`);
    });
    
    // Test 3: Simulate API call structure
    console.log('\n3️⃣ Testing API response structure...');
    const apiQuery = `
      SELECT 
        g.id, g.white_player_id, g.black_player_id, g.status,
        g.time_control, g.winner_id, g.result, g.termination,
        g.started_at, g.ended_at, g.current_fen, g.move_count,
        g.white_time_left, g.black_time_left, g.created_at,
        json_build_object(
          'id', u.id,
          'username', u.username,
          'display_name', u.display_name,
          'elo_rating', u.elo_rating
        ) as white_player
      FROM games g
      LEFT JOIN users u ON g.white_player_id = u.id
      ORDER BY g.created_at DESC
      LIMIT 3
    `;
    
    const apiResult = await pool.query(apiQuery);
    console.log(`   ✅ API structure test - Found ${apiResult.rows.length} games:`);
    
    // Log the exact structure that the API will return
    apiResult.rows.forEach((game, index) => {
      console.log(`   📊 Game ${index + 1}:`);
      console.log(`      ID: ${game.id}`);
      console.log(`      Status: ${game.status}`);
      console.log(`      White Player: ${JSON.stringify(game.white_player)}`);
      console.log(`      Time Control: ${JSON.stringify(game.time_control)}`);
      console.log(`      Created: ${new Date(game.created_at).toLocaleString()}`);
    });
    
    // Test 4: Check actual API endpoint format
    console.log('\n4️⃣ Checking what our API endpoint should return...');
    const mockApiResponse = {
      success: true,
      data: apiResult.rows,
      timestamp: new Date()
    };
    
    console.log('   📤 Mock API Response:');
    console.log(`   Success: ${mockApiResponse.success}`);
    console.log(`   Data count: ${mockApiResponse.data.length}`);
    console.log(`   First game ID: ${mockApiResponse.data[0]?.id}`);
    
    console.log('\n🎉 API test completed successfully!');
    console.log('\n📝 Summary:');
    console.log(`- Users in database: ${users.rows.length}`);
    console.log(`- Games in database: ${games.rows.length}`);
    console.log(`- API ready: ${apiResult.rows.length > 0 ? 'YES' : 'NO'}`);
    
  } catch (err) {
    console.error('❌ API test failed:', err.message);
  } finally {
    await pool.end();
  }
}

testApi();
