'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Chess } from 'chess.js'
import { CHESS_PIECES, INITIAL_FEN } from '@/lib/constants'
import { cn, getSquareColor, getSquareNotation } from '@/lib/utils'
import { chessApi } from '@/lib/api-client'

interface ChessSquareProps {
  file: number
  rank: number
  piece?: string | null
  isSelected?: boolean
  isValidMove?: boolean
  isCapture?: boolean
  onClick: () => void
}

const ChessSquare = ({ 
  file, 
  rank, 
  piece, 
  isSelected, 
  isValidMove, 
  isCapture, 
  onClick 
}: ChessSquareProps) => {
  const squareColor = getSquareColor(file, rank)
  const notation = getSquareNotation(file, rank)
  
  return (
    <motion.div
      className={cn(
        'chess-square',
        squareColor === 'light' ? 'chess-square-light' : 'chess-square-dark',
        isSelected && 'chess-square-selected',
        isValidMove && 'chess-square-valid-move',
        isCapture && 'chess-square-capture'
      )}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Square notation */}
      {file === 0 && (
        <span className="chess-notation chess-rank-notation">
          {8 - rank}
        </span>
      )}
      {rank === 7 && (
        <span className="chess-notation chess-file-notation">
          {String.fromCharCode(97 + file)}
        </span>
      )}
      
      {/* Chess piece */}
      {piece && (
        <motion.div
          className="chess-piece"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {piece}
        </motion.div>
      )}
      
      {/* Valid move indicator */}
      {isValidMove && !piece && (
        <motion.div
          className="w-3 h-3 bg-chess-success rounded-full opacity-60"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
        />
      )}
    </motion.div>
  )
}

// Simple FEN parser for initial display
function parseFEN(fen: string) {
  const [position] = fen.split(' ')
  const board: (string | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null))
  
  const pieceMap: { [key: string]: string } = {
    'K': CHESS_PIECES.white.king,
    'Q': CHESS_PIECES.white.queen,
    'R': CHESS_PIECES.white.rook,
    'B': CHESS_PIECES.white.bishop,
    'N': CHESS_PIECES.white.knight,
    'P': CHESS_PIECES.white.pawn,
    'k': CHESS_PIECES.black.king,
    'q': CHESS_PIECES.black.queen,
    'r': CHESS_PIECES.black.rook,
    'b': CHESS_PIECES.black.bishop,
    'n': CHESS_PIECES.black.knight,
    'p': CHESS_PIECES.black.pawn,
  }
  
  const ranks = position.split('/')
  for (let rankIndex = 0; rankIndex < 8; rankIndex++) {
    let fileIndex = 0
    for (const char of ranks[rankIndex]) {
      if (char >= '1' && char <= '8') {
        fileIndex += parseInt(char)
      } else {
        board[rankIndex][fileIndex] = pieceMap[char] || null
        fileIndex++
      }
    }
  }
  
  return board
}

interface ChessBoardProps {
  gameId?: string
  initialFen?: string
  isInteractive?: boolean
  onMove?: (move: any) => void
}

export function ChessBoard({ 
  gameId, 
  initialFen = INITIAL_FEN, 
  isInteractive = true,
  onMove 
}: ChessBoardProps = {}) {
  const [chess] = useState(() => new Chess(initialFen))
  const [board, setBoard] = useState(() => parseFEN(initialFen))
  const [selectedSquare, setSelectedSquare] = useState<{ file: number; rank: number } | null>(null)
  const [validMoves, setValidMoves] = useState<string[]>([])
  const [isThinking, setIsThinking] = useState(false)
  const [gameHistory, setGameHistory] = useState<any[]>([])
  const [currentFen, setCurrentFen] = useState(initialFen)

  // Update board when chess position changes
  useEffect(() => {
    const newFen = chess.fen()
    if (newFen !== currentFen) {
      setCurrentFen(newFen)
      setBoard(parseFEN(newFen))
      console.log('🔄 Board updated with new FEN:', newFen.split(' ')[0])
    }
  }, [chess, currentFen])

  // Load game data if gameId is provided
  useEffect(() => {
    if (gameId) {
      console.log('🎯 Loading game:', gameId)
      loadGame(gameId)
    }
  }, [gameId])

  const loadGame = async (id: string) => {
    try {
      console.log('🔄 Loading game data for:', id)
      const response = await chessApi.games.get(id)
      if (response.success && response.data) {
        console.log('✅ Game data loaded:', response.data)
        const newFen = response.data.current_fen || INITIAL_FEN
        
        // Load position into chess engine
        chess.load(newFen)
        
        // Force state updates
        setCurrentFen(newFen)
        setBoard(parseFEN(newFen))
        setGameHistory(response.data.moves || [])
        
        // Clear selection state
        setSelectedSquare(null)
        setValidMoves([])
        
        console.log('🎯 Game loaded successfully - FEN:', newFen)
      } else {
        console.error('❌ Failed to load game:', response.error)
      }
    } catch (error) {
      console.error('❌ Error loading game:', error)
    }
  }

  const makeMove = async (from: string, to: string, promotion?: string) => {
    try {
      setIsThinking(true)
      console.log('🎯 Attempting move:', { from, to, promotion })
      
      // Try move locally first
      const move = chess.move({ from, to, promotion })
      if (!move) {
        console.log('❌ Invalid move attempted:', { from, to })
        return false
      }

      console.log('✅ Move valid:', move.san)
      
      // Force update the board with new position
      const newFen = chess.fen()
      setCurrentFen(newFen)
      setBoard(parseFEN(newFen))

      // If we have a gameId, save move to server
      if (gameId) {
        console.log('💾 Saving move to server...')
        const response = await chessApi.games.makeMove(gameId, {
          from,
          to,
          promotion,
          time_taken: 2000, // Demo: 2 seconds
          time_left: 300000, // Demo: 5 minutes
        })

        if (!response.success) {
          // Revert move if server rejected it
          console.log('❌ Server rejected move:', response.error)
          chess.undo()
          const revertedFen = chess.fen()
          setCurrentFen(revertedFen)
          setBoard(parseFEN(revertedFen))
          return false
        }

        console.log('✅ Move saved to server')
        // Update game history
        setGameHistory(prev => [...prev, move])
      }

      // Call onMove callback if provided
      if (onMove) {
        onMove(move)
      }

      console.log('🎉 Move completed:', move.san, 'New position:', newFen.split(' ')[0])
      
      if (chess.isGameOver()) {
        console.log('🏁 Game over!', {
          checkmate: chess.isCheckmate(),
          stalemate: chess.isStalemate(),
          draw: chess.isDraw(),
        })
      }

      return true

    } catch (error) {
      console.error('❌ Error making move:', error)
      return false
    } finally {
      setIsThinking(false)
    }
  }

  const handleSquareClick = useCallback((file: number, rank: number) => {
    if (!isInteractive || isThinking) return

    const square = getSquareNotation(file, rank)
    
    if (selectedSquare) {
      // If we have a selected square, try to make a move
      if (validMoves.includes(square)) {
        const fromSquare = getSquareNotation(selectedSquare.file, selectedSquare.rank)
        makeMove(fromSquare, square)
        setSelectedSquare(null)
        setValidMoves([])
      } else {
        // Select new square or deselect
        if (file === selectedSquare.file && rank === selectedSquare.rank) {
          setSelectedSquare(null)
          setValidMoves([])
        } else if (board[rank][file]) {
          setSelectedSquare({ file, rank })
          setValidMoves(getValidMovesForSquare(square))
        } else {
          setSelectedSquare(null)
          setValidMoves([])
        }
      }
    } else {
      // Select square if it has a piece
      if (board[rank][file]) {
        setSelectedSquare({ file, rank })
        setValidMoves(getValidMovesForSquare(square))
      }
    }
  }, [board, selectedSquare, validMoves, isInteractive, isThinking])
  
  // Get valid moves for a square using chess.js
  const getValidMovesForSquare = (square: string): string[] => {
    const moves = chess.moves({ square, verbose: true })
    return moves.map(move => move.to)
  }
  
  return (
    <div className="w-full max-w-xl mx-auto">
      <motion.div
        className={cn(
          "chess-board aspect-square",
          isThinking && "opacity-75 pointer-events-none"
        )}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {board.map((rank, rankIndex) =>
          rank.map((piece, fileIndex) => {
            const square = getSquareNotation(fileIndex, rankIndex)
            const isValidCapture = validMoves.includes(square) && piece
            
            return (
              <ChessSquare
                key={`${fileIndex}-${rankIndex}`}
                file={fileIndex}
                rank={rankIndex}
                piece={piece}
                isSelected={
                  selectedSquare?.file === fileIndex && 
                  selectedSquare?.rank === rankIndex
                }
                isValidMove={validMoves.includes(square) && !piece}
                isCapture={isValidCapture}
                onClick={() => handleSquareClick(fileIndex, rankIndex)}
              />
            )
          })
        )}
      </motion.div>
      
      {/* Game status and move indication */}
      <div className="mt-4 space-y-2">
        {isThinking && (
          <div className="text-center">
            <motion.div
              className="inline-flex items-center space-x-2 text-chess-primary"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="w-2 h-2 bg-chess-primary rounded-full" />
              <span className="text-sm">Making move...</span>
            </motion.div>
          </div>
        )}
        
        {selectedSquare && !isThinking && (
          <div className="text-center">
            <p className="text-sm text-chess-primary">
              Selected: {getSquareNotation(selectedSquare.file, selectedSquare.rank)}
              {validMoves.length > 0 && (
                <span className="ml-2 text-chess-success">
                  ({validMoves.length} moves available)
                </span>
              )}
            </p>
          </div>
        )}

        {chess.isGameOver() && (
          <div className="text-center p-3 bg-gray-100 rounded-lg">
            <p className="font-semibold text-gray-800">
              {chess.isCheckmate() && 'Checkmate!'}
              {chess.isStalemate() && 'Stalemate!'}
              {chess.isDraw() && !chess.isStalemate() && 'Draw!'}
            </p>
            {chess.isCheckmate() && (
              <p className="text-sm text-gray-600 mt-1">
                {chess.turn() === 'w' ? 'Black' : 'White'} wins!
              </p>
            )}
          </div>
        )}
        
        {chess.inCheck() && !chess.isGameOver() && (
          <div className="text-center">
            <p className="text-sm text-red-600 font-medium">
              {chess.turn() === 'w' ? 'White' : 'Black'} is in check!
            </p>
          </div>
        )}

        <div className="text-center text-xs text-gray-500">
          Turn: {chess.turn() === 'w' ? 'White' : 'Black'} | 
          Move: {Math.ceil(chess.moveNumber())}
        </div>
      </div>
    </div>
  )
}
