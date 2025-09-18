'use client'

import { motion } from 'framer-motion'
import { Play, Users, Clock, Trophy, Target } from 'lucide-react'
import { formatTime } from '@/lib/utils'
import { TIME_CONTROLS } from '@/lib/constants'

const quickGameOptions = [
  { ...TIME_CONTROLS.BULLET, icon: '⚡', color: 'bg-red-500' },
  { ...TIME_CONTROLS.BLITZ, icon: '🔥', color: 'bg-orange-500' },
  { ...TIME_CONTROLS.RAPID, icon: '⏱️', color: 'bg-blue-500' },
]

const onlineUsers = [
  { name: 'ChessMaster', rating: 2150, status: 'playing' },
  { name: 'PawnPusher', rating: 1200, status: 'online' },
  { name: 'BobTactics', rating: 1380, status: 'seeking' },
]

export function Sidebar() {
  return (
    <div className="space-y-6">
      {/* Quick Play */}
      <motion.div
        className="bg-white/80 backdrop-blur-sm rounded-lg border border-chess-primary/20 p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-lg font-semibold text-chess-primary mb-4 flex items-center">
          <Play className="h-5 w-5 mr-2" />
          Quick Play
        </h2>
        
        <div className="space-y-3">
          {quickGameOptions.map((option, index) => (
            <motion.button
              key={option.name}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-chess-secondary/30 to-chess-board-light/30 hover:from-chess-secondary/50 hover:to-chess-board-light/50 transition-all group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${option.color} rounded-lg flex items-center justify-center text-white text-lg group-hover:scale-110 transition-transform`}>
                  {option.icon}
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-800">{option.name}</p>
                  <p className="text-sm text-gray-500">
                    {formatTime(option.initial)} + {option.increment}s
                  </p>
                </div>
              </div>
              <div className="text-chess-primary">
                <Play className="h-4 w-4" />
              </div>
            </motion.button>
          ))}
        </div>

        <motion.button
          className="w-full mt-4 p-3 bg-chess-primary text-white rounded-lg hover:bg-chess-primary/90 transition-colors font-medium"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Create Custom Game
        </motion.button>
      </motion.div>

      {/* Online Players */}
      <motion.div
        className="bg-white/80 backdrop-blur-sm rounded-lg border border-chess-primary/20 p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-lg font-semibold text-chess-primary mb-4 flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Online Players
          <span className="ml-auto text-sm bg-chess-success text-white px-2 py-1 rounded-full">
            1,247
          </span>
        </h2>

        <div className="space-y-2">
          {onlineUsers.map((user, index) => (
            <motion.div
              key={user.name}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-chess-secondary/30 transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  user.status === 'playing' ? 'bg-red-500' :
                  user.status === 'seeking' ? 'bg-yellow-500' : 'bg-green-500'
                }`} />
                <div>
                  <p className="text-sm font-medium text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.rating} ELO</p>
                </div>
              </div>
              <motion.button
                className="text-xs px-2 py-1 bg-chess-primary text-white rounded hover:bg-chess-primary/90 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Challenge
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Daily Challenges */}
      <motion.div
        className="bg-white/80 backdrop-blur-sm rounded-lg border border-chess-primary/20 p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-lg font-semibold text-chess-primary mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2" />
          Daily Challenges
        </h2>

        <div className="space-y-3">
          <motion.div
            className="p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-yellow-800">Puzzle Rush</h3>
              <Trophy className="h-4 w-4 text-yellow-600" />
            </div>
            <p className="text-sm text-yellow-700 mb-2">Solve 5 puzzles in a row</p>
            <div className="w-full bg-yellow-200 rounded-full h-2">
              <motion.div
                className="bg-yellow-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '60%' }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <p className="text-xs text-yellow-600 mt-1">3/5 completed</p>
          </motion.div>

          <motion.div
            className="p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-green-800">Win 3 Games</h3>
              <Clock className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-sm text-green-700 mb-2">Win 3 blitz games today</p>
            <div className="w-full bg-green-200 rounded-full h-2">
              <motion.div
                className="bg-green-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '33%' }}
                transition={{ duration: 1, delay: 0.7 }}
              />
            </div>
            <p className="text-xs text-green-600 mt-1">1/3 completed</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
