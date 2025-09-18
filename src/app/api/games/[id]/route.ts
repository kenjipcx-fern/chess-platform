import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { games, gameMoves } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const gameId = resolvedParams.id
    console.log('📡 API: Getting game details...', { gameId })

    const game = await db
      .select()
      .from(games)
      .where(eq(games.id, gameId))
      .limit(1)

    if (game.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'GAME_NOT_FOUND',
            message: 'Game not found',
          },
          timestamp: new Date(),
        },
        { status: 404 }
      )
    }

    // Also get the game moves
    const moves = await db
      .select()
      .from(gameMoves)
      .where(eq(gameMoves.game_id, gameId))
      .orderBy(gameMoves.move_number, gameMoves.color)

    console.log('✅ API: Game details retrieved', { gameId, moveCount: moves.length })

    return NextResponse.json({
      success: true,
      data: {
        ...game[0],
        moves,
      },
      timestamp: new Date(),
    })

  } catch (error) {
    console.error('❌ API Error: Getting game details', error)
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to retrieve game',
          details: process.env.NODE_ENV === 'development' ? error : undefined,
        },
        timestamp: new Date(),
      },
      { status: 500 }
    )
  }
}
