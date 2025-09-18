'use client'

import { useState, useEffect } from 'react'
import { ChessBoard } from '@/components/chess/ChessBoard'
import { GameManager } from '@/components/game/GameManager'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { chessApi } from '@/lib/api-client'

export default function HomePage() {
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    try {
      const response = await chessApi.users.getProfile()
      if (response.success && response.data) {
        setCurrentUser(response.data)
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGameSelect = (gameId: string) => {
    console.log('Game selected:', gameId)
    setSelectedGameId(gameId)
  }

  const handleMove = (move: any) => {
    console.log('Move made:', move)
    // Here you could update game state, send notifications, etc.
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-chess-secondary via-white to-chess-board-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chess-primary mx-auto mb-4" />
          <p className="text-chess-primary">Loading Chess Platform...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-chess-secondary via-white to-chess-board-light">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
          
          {/* Main Chess Area */}
          <div className="lg:col-span-2">
            <div className="flex flex-col items-center space-y-6">
              {/* Chess Board */}
              <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl">
                <ChessBoard
                  gameId={selectedGameId || undefined}
                  isInteractive={true}
                  onMove={handleMove}
                />
              </div>
              
              {/* Game Status */}
              {selectedGameId && (
                <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl bg-white/80 backdrop-blur-sm rounded-lg border border-chess-primary/20 p-4">
                  <h3 className="text-lg font-semibold text-chess-primary mb-3">
                    Current Game
                  </h3>
                  <div className="text-sm text-gray-600">
                    Game ID: <code className="bg-gray-100 px-2 py-1 rounded font-mono">{selectedGameId}</code>
                  </div>
                  <div className="mt-3 flex space-x-2">
                    <button 
                      onClick={() => setSelectedGameId(null)}
                      className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                    >
                      Leave Game
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Right Panel - Game Manager */}
          <div className="lg:col-span-1">
            <GameManager
              onGameSelect={handleGameSelect}
              currentUser={currentUser}
            />
          </div>
        </div>

        {/* API Status Indicator */}
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg border border-chess-primary/20 p-3 shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-gray-600">
                API Connected
              </span>
            </div>
            {currentUser && (
              <div className="text-xs text-gray-500 mt-1">
                Logged in as: {currentUser.username}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
