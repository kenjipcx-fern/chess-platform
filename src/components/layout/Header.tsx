'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Crown, Settings, User, Bell, Search } from 'lucide-react'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-chess-primary/20 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <Crown className="h-8 w-8 text-chess-primary" />
              <motion.div
                className="absolute inset-0 bg-chess-accent/20 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-chess-primary">
                Chess Platform
              </h1>
              <p className="text-xs text-gray-500">Progressive Chess Experience</p>
            </div>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <motion.a
              href="/"
              className="text-gray-700 hover:text-chess-primary transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Play
            </motion.a>
            <motion.a
              href="/puzzles"
              className="text-gray-700 hover:text-chess-primary transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Puzzles
            </motion.a>
            <motion.a
              href="/learn"
              className="text-gray-700 hover:text-chess-primary transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn
            </motion.a>
            <motion.a
              href="/watch"
              className="text-gray-700 hover:text-chess-primary transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Watch
            </motion.a>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <motion.button
              className="p-2 text-gray-500 hover:text-chess-primary transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Search className="h-5 w-5" />
            </motion.button>

            {/* Notifications */}
            <motion.button
              className="relative p-2 text-gray-500 hover:text-chess-primary transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Bell className="h-5 w-5" />
              <motion.span
                className="absolute -top-1 -right-1 bg-chess-error text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1 }}
              >
                3
              </motion.span>
            </motion.button>

            {/* Settings */}
            <motion.button
              className="p-2 text-gray-500 hover:text-chess-primary transition-colors"
              whileHover={{ scale: 1.1, rotate: 45 }}
              whileTap={{ scale: 0.9 }}
            >
              <Settings className="h-5 w-5" />
            </motion.button>

            {/* User Profile */}
            <motion.div
              className="flex items-center space-x-2 bg-chess-secondary/50 rounded-full pr-3 pl-1 py-1"
              whileHover={{ scale: 1.02 }}
            >
              <div className="h-8 w-8 bg-chess-primary rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-700">Alice Chess</p>
                <p className="text-xs text-gray-500">1450 ELO</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  )
}
