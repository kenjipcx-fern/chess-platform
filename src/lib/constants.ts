// Chess piece Unicode symbols
export const CHESS_PIECES = {
  white: {
    king: '♔',
    queen: '♕',
    rook: '♖',
    bishop: '♗',
    knight: '♘',
    pawn: '♙',
  },
  black: {
    king: '♚',
    queen: '♛',
    rook: '♜',
    bishop: '♝',
    knight: '♞',
    pawn: '♟',
  },
} as const

// Initial chess position (FEN)
export const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

// Game statuses
export const GAME_STATUS = {
  WAITING: 'waiting',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  ABORTED: 'aborted',
  DRAW_OFFERED: 'draw_offered',
  ADJOURNED: 'adjourned',
} as const

// Game results
export const GAME_RESULT = {
  WHITE_WINS: '1-0',
  BLACK_WINS: '0-1',
  DRAW: '1/2-1/2',
  ONGOING: '*',
} as const

// Time controls (in seconds)
export const TIME_CONTROLS = {
  BULLET: { initial: 60, increment: 0, name: '1+0' },
  BULLET_PLUS: { initial: 60, increment: 1, name: '1+1' },
  BLITZ: { initial: 300, increment: 0, name: '5+0' },
  BLITZ_PLUS: { initial: 300, increment: 3, name: '5+3' },
  RAPID: { initial: 900, increment: 10, name: '15+10' },
  CLASSICAL: { initial: 1800, increment: 30, name: '30+30' },
} as const

// Board themes
export const BOARD_THEMES = {
  green: {
    light: '#f0d9b5',
    dark: '#b58863',
    name: 'Green',
  },
  brown: {
    light: '#f4d4a7',
    dark: '#c49c70',
    name: 'Brown',
  },
  blue: {
    light: '#dee3e6',
    dark: '#8ca2ad',
    name: 'Blue',
  },
  purple: {
    light: '#e8d5e5',
    dark: '#b5a6b8',
    name: 'Purple',
  },
} as const

// Piece themes (for future implementation)
export const PIECE_THEMES = {
  classic: 'Classic',
  modern: 'Modern',
  artistic: 'Artistic',
} as const

// Animation durations (in milliseconds)
export const ANIMATIONS = {
  PIECE_MOVE: 200,
  BOARD_FLIP: 600,
  CHECK_FLASH: 1000,
  CAPTURE: 300,
  PROMOTION: 400,
} as const

// Sound effects (for future implementation)
export const SOUNDS = {
  MOVE: 'move',
  CAPTURE: 'capture',
  CHECK: 'check',
  CHECKMATE: 'checkmate',
  CASTLE: 'castle',
  PROMOTION: 'promotion',
  GAME_START: 'game_start',
  GAME_END: 'game_end',
} as const

// User preferences defaults
export const DEFAULT_PREFERENCES = {
  theme: 'light' as 'light' | 'dark',
  boardTheme: 'green' as keyof typeof BOARD_THEMES,
  pieceTheme: 'classic' as keyof typeof PIECE_THEMES,
  autoQueen: false,
  showLegalMoves: true,
  showCoordinates: true,
  enableSounds: true,
  animationSpeed: 'normal' as 'slow' | 'normal' | 'fast',
  flipBoard: false,
} as const

// API endpoints
export const API_ROUTES = {
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    SESSION: '/api/auth/session',
  },
  GAMES: {
    CREATE: '/api/games',
    LIST: '/api/games',
    GET: (id: string) => `/api/games/${id}`,
    MOVE: (id: string) => `/api/games/${id}/move`,
    RESIGN: (id: string) => `/api/games/${id}/resign`,
    DRAW: (id: string) => `/api/games/${id}/draw`,
  },
  USERS: {
    PROFILE: '/api/users/profile',
    STATS: '/api/users/stats',
    FRIENDS: '/api/users/friends',
  },
} as const

// WebSocket events
export const WS_EVENTS = {
  GAME_UPDATE: 'game:update',
  MOVE_MADE: 'move:made',
  PLAYER_JOINED: 'player:joined',
  PLAYER_LEFT: 'player:left',
  CHAT_MESSAGE: 'chat:message',
  DRAW_OFFER: 'draw:offer',
  DRAW_RESPONSE: 'draw:response',
  RESIGNATION: 'game:resignation',
  TIME_UPDATE: 'time:update',
} as const

// Error messages
export const ERROR_MESSAGES = {
  INVALID_MOVE: 'Invalid move',
  GAME_NOT_FOUND: 'Game not found',
  UNAUTHORIZED: 'Unauthorized',
  CONNECTION_ERROR: 'Connection error',
  TIMEOUT: 'Request timeout',
  UNKNOWN: 'An unknown error occurred',
} as const

// Success messages
export const SUCCESS_MESSAGES = {
  MOVE_MADE: 'Move made successfully',
  GAME_CREATED: 'Game created',
  CONNECTED: 'Connected to game',
  AUTHENTICATED: 'Authenticated successfully',
} as const
