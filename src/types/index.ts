// Chess-specific types
export type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king'
export type PieceColor = 'white' | 'black'
export type Square = string // e.g., 'e4', 'a1'

export interface ChessPiece {
  type: PieceType
  color: PieceColor
}

export interface ChessMove {
  from: Square
  to: Square
  piece: PieceType
  captured?: PieceType
  promotion?: PieceType
  isCheck?: boolean
  isCheckmate?: boolean
  isStalemate?: boolean
  isCastle?: boolean
  isEnPassant?: boolean
  san: string // Standard Algebraic Notation
  fen: string // Position after move
  timeLeft: number // milliseconds
  timeTaken?: number // milliseconds
}

export interface GameState {
  id: string
  whitePlayerId: string
  blackPlayerId: string
  status: 'waiting' | 'active' | 'completed' | 'aborted' | 'draw_offered' | 'adjourned'
  timeControl: {
    initial: number // seconds
    increment: number // seconds
  }
  winnerId?: string
  result?: '1-0' | '0-1' | '1/2-1/2' | '*'
  termination?: 'checkmate' | 'resignation' | 'timeout' | 'draw_agreement' | 'stalemate' | 'insufficient_material' | 'threefold_repetition' | '50_move_rule' | 'abandoned'
  currentFen: string
  moves: ChessMove[]
  whiteTimeLeft: number // seconds
  blackTimeLeft: number // seconds
  currentTurn: PieceColor
  moveCount: number
  lastMoveAt?: Date
  startedAt?: Date
  endedAt?: Date
  createdAt: Date
}

// User types
export interface User {
  id: string
  username: string
  email: string
  displayName?: string
  bio?: string
  country?: string
  eloRating: number
  gamesPlayed: number
  gamesWon: number
  gamesDrawn: number
  gamesLost: number
  isOnline: boolean
  lastSeen?: Date
  accountType: 'free' | 'premium' | 'admin'
  isVerified: boolean
  preferences: UserPreferences
  createdAt: Date
  updatedAt: Date
}

export interface UserPreferences {
  theme: 'light' | 'dark'
  boardTheme: 'green' | 'brown' | 'blue' | 'purple'
  pieceTheme: 'classic' | 'modern' | 'artistic'
  autoQueen: boolean
  showLegalMoves: boolean
  showCoordinates: boolean
  enableSounds: boolean
  animationSpeed: 'slow' | 'normal' | 'fast'
  flipBoard: boolean
  [key: string]: any
}

export interface UserStats {
  userId: string
  totalGames: number
  wins: number
  losses: number
  draws: number
  winRate: number
  averageGameLength: number
  favoriteOpening?: string
  longestWinStreak: number
  currentWinStreak: number
  bestRating: number
  ratingHistory: RatingPoint[]
  puzzleRating: number
  puzzlesSolved: number
}

export interface RatingPoint {
  rating: number
  date: Date
  gameId?: string
}

// Friendship types
export interface Friendship {
  id: string
  userId: string
  friendId: string
  status: 'pending' | 'accepted' | 'declined' | 'blocked'
  createdAt: Date
}

// Chat types
export interface ChatMessage {
  id: string
  gameId: string
  userId: string
  message: string
  messageType: 'chat' | 'draw_offer' | 'draw_accept' | 'draw_decline' | 'resignation'
  createdAt: Date
}

// Game analysis types
export interface GameAnalysis {
  id: string
  gameId: string
  moveNumber: number
  positionFen: string
  bestMove?: string
  evaluation?: number // centipawns
  depth?: number
  engineName: string
  createdAt: Date
}

// UI State types
export interface BoardState {
  selectedSquare: Square | null
  validMoves: Square[]
  lastMove: { from: Square; to: Square } | null
  isFlipped: boolean
  highlightedSquares: Square[]
  premoves: ChessMove[]
}

export interface GameUIState {
  isThinking: boolean
  showMoveList: boolean
  showChat: boolean
  showAnalysis: boolean
  selectedMoveIndex: number | null
  isFullscreen: boolean
  soundEnabled: boolean
}

// WebSocket types
export interface WebSocketMessage {
  type: string
  payload: any
  gameId?: string
  userId?: string
  timestamp: Date
}

export interface GameUpdateMessage extends WebSocketMessage {
  type: 'game:update'
  payload: {
    gameState: GameState
    move?: ChessMove
  }
}

export interface PlayerJoinedMessage extends WebSocketMessage {
  type: 'player:joined'
  payload: {
    user: User
    color: PieceColor
  }
}

export interface ChatMessageEvent extends WebSocketMessage {
  type: 'chat:message'
  payload: ChatMessage
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  timestamp: Date
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Form types
export interface LoginForm {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterForm {
  username: string
  email: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

export interface GameCreationForm {
  timeControl: {
    initial: number
    increment: number
  }
  color: 'white' | 'black' | 'random'
  isRated: boolean
  variant: 'standard' | 'chess960' | 'king_of_the_hill' | 'three_check'
}

// Puzzle types
export interface ChessPuzzle {
  id: string
  fen: string
  moves: string[]
  rating: number
  themes: string[]
  solution: ChessMove[]
  attempts: number
  solved: boolean
}

// Tournament types
export interface Tournament {
  id: string
  name: string
  description: string
  timeControl: {
    initial: number
    increment: number
  }
  startTime: Date
  endTime: Date
  maxPlayers: number
  currentPlayers: number
  entryFee?: number
  prizePool?: number
  format: 'swiss' | 'knockout' | 'round_robin'
  status: 'upcoming' | 'active' | 'completed' | 'cancelled'
  rounds: TournamentRound[]
  standings: TournamentStanding[]
}

export interface TournamentRound {
  roundNumber: number
  pairings: TournamentPairing[]
  startTime: Date
  endTime?: Date
}

export interface TournamentPairing {
  whitePlayer: User
  blackPlayer: User
  gameId?: string
  result?: '1-0' | '0-1' | '1/2-1/2'
}

export interface TournamentStanding {
  player: User
  points: number
  tiebreaks: number[]
  rank: number
}
