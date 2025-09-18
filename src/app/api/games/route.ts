import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { games, users } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

// Get list of games
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')

    console.log('📡 API: Getting games list...', { limit, status })

    // Simple query without JOIN for now to test
    const gamesList = status 
      ? await db
          .select()
          .from(games)
          .where(eq(games.status, status as any))
          .orderBy(desc(games.created_at))
          .limit(limit)
      : await db
          .select()
          .from(games)
          .orderBy(desc(games.created_at))
          .limit(limit)

    console.log(`✅ API: Retrieved ${gamesList.length} games`)

    return NextResponse.json({
      success: true,
      data: gamesList,
      timestamp: new Date(),
    })

  } catch (error) {
    console.error('❌ API Error: Getting games list', error)
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to retrieve games',
          details: process.env.NODE_ENV === 'development' ? error : undefined,
        },
        timestamp: new Date(),
      },
      { status: 500 }
    )
  }
}

// Create a new game
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('📡 API: Creating new game...', body)

    // For demo purposes, get two users from the database
    const usersList = await db.select().from(users).limit(2)
    
    if (usersList.length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INSUFFICIENT_PLAYERS',
            message: 'Need at least 2 users to create a game',
          },
          timestamp: new Date(),
        },
        { status: 400 }
      )
    }

    const [whitePlayer, blackPlayer] = usersList

    // Create new game
    const newGame = await db
      .insert(games)
      .values({
        white_player_id: whitePlayer.id,
        black_player_id: blackPlayer.id,
        status: 'waiting',
        time_control: body.time_control || { initial: 600, increment: 5 },
        current_fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        white_time_left: body.time_control?.initial || 600,
        black_time_left: body.time_control?.initial || 600,
        move_count: 0,
      })
      .returning()

    console.log('✅ API: Game created', { gameId: newGame[0].id })

    return NextResponse.json({
      success: true,
      data: newGame[0],
      timestamp: new Date(),
    })

  } catch (error) {
    console.error('❌ API Error: Creating game', error)
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to create game',
          details: process.env.NODE_ENV === 'development' ? error : undefined,
        },
        timestamp: new Date(),
      },
      { status: 500 }
    )
  }
}
