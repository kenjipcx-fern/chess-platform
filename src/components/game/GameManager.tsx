'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, RefreshCw, Users, Clock } from 'lucide-react'
import { chessApi } from '@/lib/api-client'
import { formatTime } from '@/lib/utils'

interface Game {
  id: string
  white_player_id: string
  black_player_id: string
  status: string
  time_control: {
    initial: number
    increment: number
  }
  white_time_left: number
  black_time_left: number
  move_count: number
  created_at: string
  white_player?: {
    username: string
    elo_rating: number
  }
}

interface GameManagerProps {
  onGameSelect: (gameId: string) => void
  currentUser?: any
}

export function GameManager({ onGameSelect, currentUser }: GameManagerProps) {
  const [games, setGames] = useState<Game[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    loadGames()
  }, [])

  const loadGames = async () => {
    try {
      setIsLoading(true)
      console.log('🔄 Loading games...')
      const response = await chessApi.games.list({ limit: 10 })
      
      console.log('📡 API Response:', response)
      
      if (response.success && response.data) {
        // The API response has nested structure: response.data.data contains the actual games array
        const actualData = response.data.data || response.data
        const gamesArray = Array.isArray(actualData) ? actualData : []
        setGames(gamesArray)
        console.log('✅ Games loaded:', gamesArray.length, gamesArray)
      } else {
        console.error('❌ Failed to load games:', response.error)
        setGames([]) // Set empty array on error
      }
    } catch (error) {
      console.error('❌ Error loading games:', error)
      setGames([]) // Set empty array on error
    } finally {
      setIsLoading(false)
    }
  }

  const createGame = async (timeControl: { initial: number; increment: number }) => {
    try {
      setIsCreating(true)
      const response = await chessApi.games.create({ time_control: timeControl })
      
      if (response.success && response.data) {
        console.log('Game created:', response.data.id)
        onGameSelect(response.data.id)
        await loadGames() // Refresh games list
      } else {
        console.error('Failed to create game:', response.error)
      }
    } catch (error) {
      console.error('Error creating game:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-yellow-100 text-yellow-800'
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-chess-primary/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-chess-primary flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Game Manager
        </h2>
        <motion.button
          onClick={loadGames}
          disabled={isLoading}
          className="p-2 text-chess-primary hover:bg-chess-secondary/30 rounded-lg transition-colors disabled:opacity-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </motion.button>
      </div>

      {/* Quick Game Creation */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-3">Create New Game</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <motion.button
            onClick={() => createGame({ initial: 300, increment: 3 })}
            disabled={isCreating}
            className="flex items-center justify-between p-3 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200 hover:from-red-100 hover:to-red-200 transition-all disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-left">
              <div className="font-medium text-red-800">Blitz</div>
              <div className="text-sm text-red-600">5+3</div>
            </div>
            <div className="text-red-500">⚡</div>
          </motion.button>

          <motion.button
            onClick={() => createGame({ initial: 600, increment: 5 })}
            disabled={isCreating}
            className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 hover:from-blue-100 hover:to-blue-200 transition-all disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-left">
              <div className="font-medium text-blue-800">Rapid</div>
              <div className="text-sm text-blue-600">10+5</div>
            </div>
            <div className="text-blue-500">🔥</div>
          </motion.button>

          <motion.button
            onClick={() => createGame({ initial: 1800, increment: 30 })}
            disabled={isCreating}
            className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200 hover:from-purple-100 hover:to-purple-200 transition-all disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-left">
              <div className="font-medium text-purple-800">Classical</div>
              <div className="text-sm text-purple-600">30+30</div>
            </div>
            <div className="text-purple-500">⏱️</div>
          </motion.button>
        </div>
        
        {isCreating && (
          <div className="mt-3 text-center">
            <div className="inline-flex items-center space-x-2 text-chess-primary">
              <div className="w-2 h-2 bg-chess-primary rounded-full animate-bounce" />
              <span className="text-sm">Creating game...</span>
            </div>
          </div>
        )}
      </div>

      {/* Games List */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-3">
          Available Games ({games.length})
        </h3>
        
        {/* Debug info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-2 text-xs text-gray-500">
            Games state: {Array.isArray(games) ? `array[${games.length}]` : typeof games}
            {games.length > 0 && ` - First game: ${games[0].id?.substring(0, 8)}...`}
          </div>
        )}
        
        {isLoading ? (
          <div className="text-center py-8">
            <RefreshCw className="h-6 w-6 text-chess-primary animate-spin mx-auto mb-2" />
            <p className="text-sm text-gray-500">Loading games...</p>
          </div>
        ) : games.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 mb-2">No games available</p>
            <p className="text-sm text-gray-400">Create a new game to start playing!</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {games.map((game) => (
              <motion.div
                key={game.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => onGameSelect(game.id)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(game.status)}`}>
                      {game.status}
                    </span>
                    <span className="text-sm text-gray-600">
                      {formatTime(game.time_control.initial)} + {game.time_control.increment}s
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-700">
                    {game.white_player ? (
                      <span>
                        {game.white_player.username} ({game.white_player.elo_rating})
                      </span>
                    ) : (
                      <span className="text-gray-500">Waiting for players...</span>
                    )}
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Moves: {game.move_count} | Created: {new Date(game.created_at).toLocaleTimeString()}
                  </div>
                </div>
                
                <motion.button
                  className="flex items-center space-x-1 px-3 py-1 text-sm bg-chess-primary text-white rounded hover:bg-chess-primary/90 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="h-3 w-3" />
                  <span>Join</span>
                </motion.button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
