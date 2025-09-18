import { db } from './index';
import { users, games, gameMoves, userFriends, gameChats } from './schema';
import { eq } from 'drizzle-orm';

export async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  try {
    // Clear existing data (in reverse dependency order)
    await db.delete(gameChats);
    await db.delete(gameMoves);
    await db.delete(games);
    await db.delete(userFriends);
    await db.delete(users);
    
    console.log('📧 Creating test users...');
    
    // Create test users
    const testUsers = await db.insert(users).values([
      {
        username: 'alice_chess',
        email: 'alice@chess.dev',
        display_name: 'Alice Cooper',
        bio: 'Love playing tactical chess games',
        country: 'US',
        elo_rating: 1450,
        games_played: 25,
        games_won: 15,
        games_drawn: 5,
        games_lost: 5,
        is_online: true,
        preferences: { 
          theme: 'dark', 
          board_theme: 'green',
          auto_queen: false,
          show_legal_moves: true 
        }
      },
      {
        username: 'bob_tactics',
        email: 'bob@chess.dev',
        display_name: 'Bob Fischer',
        bio: 'Tactical puzzles are my specialty',
        country: 'CA',
        elo_rating: 1380,
        games_played: 18,
        games_won: 8,
        games_drawn: 4,
        games_lost: 6,
        is_online: false,
        preferences: { 
          theme: 'light', 
          board_theme: 'brown',
          auto_queen: true,
          show_legal_moves: false 
        }
      },
      {
        username: 'chess_master',
        email: 'master@chess.dev',
        display_name: 'Chess Master',
        bio: 'Teaching chess for 10+ years',
        country: 'DE',
        elo_rating: 2150,
        games_played: 500,
        games_won: 320,
        games_drawn: 100,
        games_lost: 80,
        is_online: true,
        preferences: { 
          theme: 'dark', 
          board_theme: 'blue',
          auto_queen: false,
          show_legal_moves: false 
        }
      },
      {
        username: 'pawn_pusher',
        email: 'pawn@chess.dev',
        display_name: 'Pawn Pusher',
        bio: 'Love endgames and pawn structures',
        country: 'FR',
        elo_rating: 1200,
        games_played: 8,
        games_won: 3,
        games_drawn: 2,
        games_lost: 3,
        is_online: false,
        preferences: { 
          theme: 'light', 
          board_theme: 'green',
          auto_queen: true,
          show_legal_moves: true 
        }
      }
    ]).returning();
    
    console.log(`✅ Created ${testUsers.length} test users`);
    
    // Create friendships
    console.log('👥 Creating friend relationships...');
    await db.insert(userFriends).values([
      {
        user_id: testUsers[0].id,
        friend_id: testUsers[1].id,
        status: 'accepted'
      },
      {
        user_id: testUsers[1].id,
        friend_id: testUsers[0].id,
        status: 'accepted'
      },
      {
        user_id: testUsers[0].id,
        friend_id: testUsers[2].id,
        status: 'pending'
      }
    ]);
    
    console.log('✅ Created friend relationships');
    
    // Create test games
    console.log('♟️  Creating test games...');
    const testGames = await db.insert(games).values([
      {
        white_player_id: testUsers[0].id,
        black_player_id: testUsers[1].id,
        status: 'completed',
        time_control: { initial: 600, increment: 5 },
        winner_id: testUsers[0].id,
        result: '1-0',
        termination: 'checkmate',
        started_at: new Date(Date.now() - 3600000), // 1 hour ago
        ended_at: new Date(Date.now() - 3000000),   // 50 minutes ago
        current_fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 4 4',
        move_count: 25,
        white_time_left: 245,
        black_time_left: 0
      },
      {
        white_player_id: testUsers[1].id,
        black_player_id: testUsers[2].id,
        status: 'active',
        time_control: { initial: 300, increment: 3 },
        started_at: new Date(Date.now() - 1200000), // 20 minutes ago
        current_fen: 'rnbqkb1r/pppppppp/5n2/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 1 2',
        move_count: 3,
        white_time_left: 180,
        black_time_left: 165,
        last_move_at: new Date(Date.now() - 300000) // 5 minutes ago
      },
      {
        white_player_id: testUsers[3].id,
        black_player_id: testUsers[2].id,
        status: 'waiting',
        time_control: { initial: 900, increment: 10 },
        current_fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        move_count: 0,
        white_time_left: 900,
        black_time_left: 900
      }
    ]).returning();
    
    console.log(`✅ Created ${testGames.length} test games`);
    
    // Create some game moves for the completed game
    console.log('📝 Creating game moves...');
    await db.insert(gameMoves).values([
      {
        game_id: testGames[0].id,
        move_number: 1,
        color: 'white',
        from_square: 'e2',
        to_square: 'e4',
        piece_moved: 'pawn',
        move_notation: 'e4',
        position_after: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
        time_taken: 5000,
        time_left: 595000
      },
      {
        game_id: testGames[0].id,
        move_number: 1,
        color: 'black',
        from_square: 'e7',
        to_square: 'e5',
        piece_moved: 'pawn',
        move_notation: 'e5',
        position_after: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2',
        time_taken: 3000,
        time_left: 597000
      },
      {
        game_id: testGames[0].id,
        move_number: 2,
        color: 'white',
        from_square: 'g1',
        to_square: 'f3',
        piece_moved: 'knight',
        move_notation: 'Nf3',
        position_after: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2',
        time_taken: 8000,
        time_left: 587000
      }
    ]);
    
    console.log('✅ Created game moves');
    
    // Create some chat messages
    console.log('💬 Creating chat messages...');
    await db.insert(gameChats).values([
      {
        game_id: testGames[0].id,
        user_id: testUsers[0].id,
        message: 'Good game! Looking forward to this match.',
        message_type: 'chat'
      },
      {
        game_id: testGames[0].id,
        user_id: testUsers[1].id,
        message: "Thanks! Let's play well.",
        message_type: 'chat'
      },
      {
        game_id: testGames[1].id,
        user_id: testUsers[1].id,
        message: 'Interesting opening choice!',
        message_type: 'chat'
      }
    ]);
    
    console.log('✅ Created chat messages');
    
    console.log('🎉 Database seeding completed successfully!');
    
    // Display summary
    const userCount = await db.select().from(users);
    const gameCount = await db.select().from(games);
    const moveCount = await db.select().from(gameMoves);
    
    console.log('\n📊 Database Summary:');
    console.log(`- Users: ${userCount.length}`);
    console.log(`- Games: ${gameCount.length}`);
    console.log(`- Moves: ${moveCount.length}`);
    console.log(`- Friendships: 3`);
    console.log(`- Chat messages: 3`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}
