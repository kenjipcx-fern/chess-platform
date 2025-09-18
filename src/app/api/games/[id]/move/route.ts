import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { games, gameMoves } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { Chess } from 'chess.js'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const gameId = resolvedParams.id
    const body = await request.json()
    console.log('📡 API: Making move...', { gameId, move: body })

    // Get current game state
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

    const currentGame = game[0]

    // Check if game is active
    if (currentGame.status !== 'active' && currentGame.status !== 'waiting') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'GAME_NOT_ACTIVE',
            message: 'Game is not active',
          },
          timestamp: new Date(),
        },
        { status: 400 }
      )
    }

    // Initialize chess engine with current position
    const chess = new Chess(currentGame.current_fen)

    // Validate and make the move
    try {
      const move = chess.move({
        from: body.from,
        to: body.to,
        promotion: body.promotion,
      })

      if (!move) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'INVALID_MOVE',
              message: 'Invalid move',
            },
            timestamp: new Date(),
          },
          { status: 400 }
        )
      }

      // Determine move number and color
      const moveNumber = Math.floor(chess.moveNumber())
      const color = move.color === 'w' ? 'white' : 'black'

      // Save the move to database
      await db.insert(gameMoves).values({
        game_id: gameId,
        move_number: moveNumber,
        color,
        from_square: move.from,
        to_square: move.to,
        piece_moved: move.piece,
        captured_piece: move.captured || null,
        is_castling: move.flags.includes('k') || move.flags.includes('q'),
        is_en_passant: move.flags.includes('e'),
        promotion_piece: move.promotion || null,
        check_status: chess.inCheck() ? (chess.isCheckmate() ? 'checkmate' : 'check') : null,
        move_notation: move.san,
        position_after: chess.fen(),
        time_taken: body.time_taken || null,
        time_left: body.time_left || currentGame.white_time_left,
      })

      // Update game state
      const gameStatus = chess.isGameOver() 
        ? 'completed' 
        : (currentGame.status === 'waiting' ? 'active' : currentGame.status)

      let result = null
      let termination = null
      let winner_id = null

      if (chess.isGameOver()) {
        if (chess.isCheckmate()) {
          result = move.color === 'w' ? '1-0' : '0-1'
          termination = 'checkmate'
          winner_id = move.color === 'w' ? currentGame.white_player_id : currentGame.black_player_id
        } else if (chess.isDraw()) {
          result = '1/2-1/2'
          if (chess.isStalemate()) {
            termination = 'stalemate'
          } else if (chess.isInsufficientMaterial()) {
            termination = 'insufficient_material'
          } else if (chess.isThreefoldRepetition()) {
            termination = 'threefold_repetition'
          }
        }
      }

      // Update game in database
      await db
        .update(games)
        .set({
          status: gameStatus as any,
          current_fen: chess.fen(),
          move_count: currentGame.move_count + 1,
          result,
          termination: termination as any,
          winner_id,
          last_move_at: new Date(),
          ...(gameStatus === 'completed' && !currentGame.ended_at ? { ended_at: new Date() } : {}),
          ...(currentGame.status === 'waiting' ? { started_at: new Date() } : {}),
        })
        .where(eq(games.id, gameId))

      console.log('✅ API: Move made successfully', { 
        gameId, 
        move: move.san, 
        position: chess.fen().split(' ')[0],
        gameOver: chess.isGameOver()
      })

      return NextResponse.json({
        success: true,
        data: {
          move: {
            from: move.from,
            to: move.to,
            san: move.san,
            piece: move.piece,
            captured: move.captured,
            promotion: move.promotion,
          },
          game_state: {
            fen: chess.fen(),
            turn: chess.turn(),
            check: chess.inCheck(),
            checkmate: chess.isCheckmate(),
            stalemate: chess.isStalemate(),
            draw: chess.isDraw(),
            game_over: chess.isGameOver(),
            move_number: chess.moveNumber(),
            status: gameStatus,
            result,
            termination,
          },
        },
        timestamp: new Date(),
      })

    } catch (moveError) {
      console.log('❌ API: Invalid move attempted', { gameId, move: body, error: moveError })
      
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_MOVE',
            message: 'Invalid move',
            details: moveError,
          },
          timestamp: new Date(),
        },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('❌ API Error: Making move', error)
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to make move',
          details: process.env.NODE_ENV === 'development' ? error : undefined,
        },
        timestamp: new Date(),
      },
      { status: 500 }
    )
  }
}
