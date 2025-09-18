# Technical Architecture & Specifications
*Chess Platform - Modern, Accessible Chess Experience*

## Executive Summary

This document defines the complete technical architecture for our chess platform, designed to deliver Lichess-level performance (<100ms latency) with progressive complexity and accessibility-first approach. Our stack prioritizes developer experience, performance, and scalability while maintaining security and fair play standards.

---

## 1. Technology Stack Definition

### Frontend Architecture
```
┌─────────────────────────────────────────┐
│  FRONTEND STACK                         │
├─────────────────────────────────────────┤
│  Framework: Next.js 14 (App Router)    │
│  Language: TypeScript 5.3+             │
│  Styling: Tailwind CSS 3.4+            │
│  Components: shadcn/ui + Custom        │
│  Animations: Framer Motion 11+         │
│  State: Zustand 4.4+ (Global)          │
│  Forms: React Hook Form + Zod          │
│  Icons: Lucide React                   │
└─────────────────────────────────────────┘
```

**Justification for Frontend Choices:**

**Next.js 14 App Router**
- Server-side rendering for SEO and initial load performance
- Built-in code splitting and optimization
- Native support for WebSockets through custom server
- Excellent TypeScript integration
- Route-level loading states and error boundaries

**TypeScript 5.3+**
- Compile-time error catching for chess logic
- Better developer experience with IntelliSense
- Essential for complex state management in real-time games
- Improved maintainability as team scales

**Tailwind CSS 3.4+**
- Consistent design system implementation
- Excellent performance (only used styles included)
- Superior responsive design utilities
- Easy maintenance of design tokens
- Perfect integration with our accessibility-first approach

**Zustand for State Management**
- Lightweight (2.9KB vs Redux's 11KB)
- Simple API reduces cognitive load
- Excellent TypeScript support
- Perfect for chess game state management
- Built-in persistence for user preferences

### Backend Architecture
```
┌─────────────────────────────────────────┐
│  BACKEND STACK                          │
├─────────────────────────────────────────┤
│  Runtime: Node.js 20+ LTS              │
│  Framework: Next.js API Routes         │
│  WebSocket: Socket.io 4.7+             │
│  ORM: Drizzle ORM                      │
│  Database: PostgreSQL 16+              │
│  Auth: NextAuth.js 5 (Auth.js)         │
│  Validation: Zod 3.22+                 │
│  Testing: Vitest + Playwright          │
└─────────────────────────────────────────┘
```

**Justification for Backend Choices:**

**Next.js API Routes**
- Unified codebase (Frontend + API)
- Built-in middleware support
- Excellent TypeScript integration
- Easy deployment and scaling
- Perfect for our MVP scope

**Socket.io for WebSockets**
- Battle-tested for real-time applications
- Built-in room management (perfect for chess games)
- Automatic fallback to HTTP long-polling
- Excellent error handling and reconnection logic
- TypeScript support for type-safe events

**Drizzle ORM**
- Excellent TypeScript inference
- High performance (no runtime overhead)
- SQL-like syntax (easier for chess queries)
- Built-in migration system
- Better than Prisma for our real-time needs

**PostgreSQL 16**
- JSONB support for game states
- Excellent performance for concurrent reads/writes
- Advanced indexing for ELO calculations
- Full-text search for usernames
- Battle-tested reliability

### Development & Deployment
```
┌─────────────────────────────────────────┐
│  DEVELOPMENT STACK                      │
├─────────────────────────────────────────┤
│  Package Manager: pnpm                 │
│  Code Quality: ESLint + Prettier       │
│  Git Hooks: Husky + lint-staged        │
│  Testing: Vitest + Testing Library     │
│  E2E Testing: Playwright               │
│  Build: Turbo (monorepo future-ready)  │
│  Deployment: MorphVPS (current)        │
│  Database: Local PostgreSQL            │
└─────────────────────────────────────────┘
```

---

## 2. Database Design

### Entity Relationship Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     USERS       │    │     GAMES       │    │   GAME_MOVES    │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ id (UUID) PK    │◄──┐│ id (UUID) PK    │◄──┐│ id (UUID) PK    │
│ username        │   ││ white_player_id │   ││ game_id (FK)    │
│ email           │   ││ black_player_id │   ││ move_number     │
│ password_hash   │   ││ status          │   ││ from_square     │
│ elo_rating      │   ││ time_control    │   ││ to_square       │
│ games_played    │   ││ winner_id       │   ││ piece_moved     │
│ created_at      │   ││ started_at      │   ││ captured_piece  │
│ updated_at      │   ││ ended_at        │   ││ is_castling     │
│ last_seen       │   ││ current_fen     │   ││ is_en_passant   │
│ avatar_url      │   ││ game_pgn        │   ││ promotion_piece │
│ preferences     │   ││ created_at      │   ││ check_status    │
│ is_active       │   │└─────────────────┘   ││ created_at      │
└─────────────────┘   │                      │└─────────────────┘
                      │                      │
        ┌─────────────┘                      │
        │                                    │
        ▼                                    │
┌─────────────────┐    ┌─────────────────┐   │
│  USER_FRIENDS   │    │   GAME_CHATS    │   │
├─────────────────┤    ├─────────────────┤   │
│ id (UUID) PK    │    │ id (UUID) PK    │   │
│ user_id (FK)    │    │ game_id (FK)    │◄──┘
│ friend_id (FK)  │    │ user_id (FK)    │
│ status          │    │ message         │
│ created_at      │    │ created_at      │
└─────────────────┘    └─────────────────┘

        ┌──────────────────────────────────────┐
        │          CHESS_ANALYSIS              │
        ├──────────────────────────────────────┤
        │ id (UUID) PK                         │
        │ game_id (FK)                         │
        │ position_fen                         │
        │ best_move                            │
        │ evaluation                           │
        │ depth                                │
        │ created_at                           │
        └──────────────────────────────────────┘
```

### Table Schemas with Data Types

#### USERS Table
```sql
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username VARCHAR(30) UNIQUE NOT NULL CHECK (length(username) >= 3),
    email VARCHAR(255) UNIQUE NOT NULL CHECK (email ~ '^[^@]+@[^@]+\.[^@]+$'),
    password_hash VARCHAR(255) NOT NULL,
    elo_rating INTEGER DEFAULT 1200 CHECK (elo_rating >= 100 AND elo_rating <= 4000),
    games_played INTEGER DEFAULT 0 CHECK (games_played >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    avatar_url TEXT,
    preferences JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    
    -- Indexes for performance
    INDEX idx_users_username (username),
    INDEX idx_users_email (email),
    INDEX idx_users_elo_rating (elo_rating),
    INDEX idx_users_last_seen (last_seen),
    INDEX idx_users_is_active (is_active)
);
```

#### GAMES Table
```sql
CREATE TABLE games (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    white_player_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    black_player_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'waiting' CHECK (
        status IN ('waiting', 'active', 'completed', 'aborted', 'draw_offered', 'adjourned')
    ),
    time_control JSONB NOT NULL DEFAULT '{"initial": 600, "increment": 5}',
    winner_id UUID REFERENCES users(id) ON DELETE SET NULL,
    result VARCHAR(10) CHECK (result IN ('1-0', '0-1', '1/2-1/2', '*')),
    termination VARCHAR(30) CHECK (
        termination IN ('checkmate', 'resignation', 'timeout', 'draw_agreement', 
                       'stalemate', 'insufficient_material', 'threefold_repetition', 
                       '50_move_rule', 'abandoned')
    ),
    started_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    current_fen TEXT DEFAULT 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    game_pgn TEXT,
    white_time_left INTEGER DEFAULT 600, -- seconds
    black_time_left INTEGER DEFAULT 600, -- seconds
    move_count INTEGER DEFAULT 0,
    last_move_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CHECK (white_player_id != black_player_id),
    CHECK (ended_at IS NULL OR ended_at >= started_at),
    
    -- Indexes for performance
    INDEX idx_games_status (status),
    INDEX idx_games_white_player (white_player_id),
    INDEX idx_games_black_player (black_player_id),
    INDEX idx_games_created_at (created_at),
    INDEX idx_games_active_games (status, created_at) WHERE status IN ('waiting', 'active'),
    INDEX idx_games_completed (status, ended_at) WHERE status = 'completed'
);
```

#### GAME_MOVES Table
```sql
CREATE TABLE game_moves (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    move_number INTEGER NOT NULL CHECK (move_number > 0),
    color VARCHAR(5) NOT NULL CHECK (color IN ('white', 'black')),
    from_square VARCHAR(2) NOT NULL CHECK (from_square ~ '^[a-h][1-8]$'),
    to_square VARCHAR(2) NOT NULL CHECK (to_square ~ '^[a-h][1-8]$'),
    piece_moved VARCHAR(6) NOT NULL CHECK (
        piece_moved IN ('pawn', 'rook', 'knight', 'bishop', 'queen', 'king')
    ),
    captured_piece VARCHAR(6) CHECK (
        captured_piece IN ('pawn', 'rook', 'knight', 'bishop', 'queen') OR captured_piece IS NULL
    ),
    is_castling BOOLEAN DEFAULT false,
    is_en_passant BOOLEAN DEFAULT false,
    promotion_piece VARCHAR(6) CHECK (
        promotion_piece IN ('rook', 'knight', 'bishop', 'queen') OR promotion_piece IS NULL
    ),
    check_status VARCHAR(10) CHECK (check_status IN ('check', 'checkmate') OR check_status IS NULL),
    move_notation VARCHAR(10) NOT NULL, -- SAN notation (e.g., 'Nf3', 'O-O')
    position_after TEXT NOT NULL, -- FEN after this move
    time_taken INTEGER, -- milliseconds taken to make this move
    time_left INTEGER NOT NULL, -- milliseconds left after this move
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Compound unique constraint
    UNIQUE(game_id, move_number, color),
    
    -- Indexes
    INDEX idx_moves_game_id (game_id),
    INDEX idx_moves_game_move (game_id, move_number),
    INDEX idx_moves_piece (piece_moved),
    INDEX idx_moves_created_at (created_at)
);
```

#### Additional Tables
```sql
-- User friendships
CREATE TABLE user_friends (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    friend_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (
        status IN ('pending', 'accepted', 'declined', 'blocked')
    ),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, friend_id),
    CHECK (user_id != friend_id),
    INDEX idx_friends_user_status (user_id, status),
    INDEX idx_friends_friend_status (friend_id, status)
);

-- Game chat messages
CREATE TABLE game_chats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL CHECK (length(message) <= 500),
    message_type VARCHAR(20) DEFAULT 'chat' CHECK (
        message_type IN ('chat', 'draw_offer', 'draw_accept', 'draw_decline', 'resignation')
    ),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_chat_game_time (game_id, created_at),
    INDEX idx_chat_user (user_id)
);

-- Chess analysis (future enhancement)
CREATE TABLE chess_analysis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    move_number INTEGER NOT NULL,
    position_fen TEXT NOT NULL,
    best_move VARCHAR(10),
    evaluation DECIMAL(5,2), -- centipawns (e.g., 1.50 = +150 centipawns)
    depth INTEGER,
    engine_name VARCHAR(50) DEFAULT 'stockfish',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(game_id, move_number),
    INDEX idx_analysis_game (game_id),
    INDEX idx_analysis_evaluation (evaluation)
);
```

### Migration Strategy

```typescript
// Example migration file: 001_initial_schema.ts
export async function up(db: Database) {
  // Create extensions
  await db.execute(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  
  // Create users table with proper indexes
  await db.execute(`
    CREATE TABLE users (
      -- schema as defined above
    )
  `);
  
  // Add other tables in dependency order
  // users -> games -> game_moves, user_friends, game_chats, chess_analysis
}

export async function down(db: Database) {
  // Drop tables in reverse order
  await db.execute(`DROP TABLE IF EXISTS chess_analysis`);
  await db.execute(`DROP TABLE IF EXISTS game_chats`);
  await db.execute(`DROP TABLE IF EXISTS user_friends`);
  await db.execute(`DROP TABLE IF EXISTS game_moves`);
  await db.execute(`DROP TABLE IF EXISTS games`);
  await db.execute(`DROP TABLE IF EXISTS users`);
}
```

### Seed Data Requirements

```typescript
// Seed data for development and testing
export const seedData = {
  users: [
    {
      username: 'testplayer1',
      email: 'player1@chess.dev',
      elo_rating: 1400,
      preferences: { theme: 'light', board_theme: 'green' }
    },
    {
      username: 'testplayer2', 
      email: 'player2@chess.dev',
      elo_rating: 1350,
      preferences: { theme: 'dark', board_theme: 'brown' }
    },
    // Add more test users
  ],
  
  games: [
    // Sample completed games for testing game history
    // Sample active games for testing real-time features
  ],
  
  // Chess positions for testing edge cases
  testPositions: [
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', // Starting position
    '8/8/8/8/8/8/8/4K2k w - - 0 1', // King vs King (draw)
    'rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 4 4', // Italian Game
    // More test positions
  ]
};
```

---

## 3. API Design

### RESTful Endpoint Documentation

#### Authentication Endpoints
```
POST   /api/auth/register
POST   /api/auth/login  
POST   /api/auth/logout
GET    /api/auth/session
POST   /api/auth/refresh
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
```

#### User Management
```
GET    /api/users/profile              # Current user profile
PUT    /api/users/profile              # Update profile
GET    /api/users/:id                  # Public user info
GET    /api/users/search?q=username    # Search users
POST   /api/users/avatar               # Upload avatar
```

#### Friend System
```
GET    /api/friends                    # List friends
POST   /api/friends/:userId/request    # Send friend request
PUT    /api/friends/:userId/accept     # Accept request
DELETE /api/friends/:userId            # Remove friend/decline
```

#### Game Management
```
GET    /api/games                      # List user's games
GET    /api/games/:id                  # Game details
POST   /api/games/create               # Create new game
POST   /api/games/:id/join             # Join a game
DELETE /api/games/:id                  # Abort game (if creator)
```

#### Matchmaking
```
POST   /api/matchmaking/queue          # Enter matchmaking
DELETE /api/matchmaking/queue          # Leave queue
GET    /api/matchmaking/status         # Queue status
```

#### Game Actions (Real-time via WebSocket, but also REST for reliability)
```
POST   /api/games/:id/move             # Make a move
POST   /api/games/:id/draw-offer       # Offer draw
POST   /api/games/:id/draw-accept      # Accept draw
POST   /api/games/:id/resign           # Resign game
POST   /api/games/:id/chat             # Send chat message
```

#### Statistics & Analysis
```
GET    /api/games/:id/pgn              # Get game PGN
GET    /api/games/:id/analysis         # Get game analysis
GET    /api/users/:id/stats            # User statistics
GET    /api/leaderboard                # Top players
```

### Request/Response Schemas

#### Authentication Schemas
```typescript
// Registration Request
interface RegisterRequest {
  username: string; // 3-30 chars, alphanumeric + underscore
  email: string;
  password: string; // min 8 chars, 1 uppercase, 1 number
}

// Authentication Response
interface AuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
    elo_rating: number;
    avatar_url?: string;
  };
  token: string;
  expires_at: string;
}
```

#### Game Schemas
```typescript
// Game State
interface Game {
  id: string;
  white_player: UserProfile;
  black_player: UserProfile;
  status: 'waiting' | 'active' | 'completed' | 'aborted';
  time_control: {
    initial: number; // seconds
    increment: number; // seconds per move
  };
  current_fen: string;
  move_count: number;
  white_time_left: number; // milliseconds
  black_time_left: number; // milliseconds
  last_move?: GameMove;
  result?: '1-0' | '0-1' | '1/2-1/2';
  termination?: string;
  created_at: string;
  started_at?: string;
  ended_at?: string;
}

// Move Request
interface MoveRequest {
  from: string; // e.g., 'e2'
  to: string; // e.g., 'e4'
  promotion?: 'q' | 'r' | 'b' | 'n'; // For pawn promotion
}

// Move Response
interface MoveResponse {
  success: boolean;
  move?: {
    from: string;
    to: string;
    piece_moved: string;
    captured_piece?: string;
    notation: string; // SAN notation
    is_check: boolean;
    is_checkmate: boolean;
  };
  new_fen: string;
  time_left: {
    white: number;
    black: number;
  };
  game_status: string;
  error?: string;
}
```

### WebSocket Event Architecture

```typescript
// Client -> Server Events
interface ClientToServerEvents {
  // Game events
  'game:join': (gameId: string) => void;
  'game:leave': (gameId: string) => void;
  'game:move': (gameId: string, move: MoveRequest) => void;
  'game:draw-offer': (gameId: string) => void;
  'game:draw-response': (gameId: string, accept: boolean) => void;
  'game:resign': (gameId: string) => void;
  'game:chat': (gameId: string, message: string) => void;
  
  // Matchmaking events
  'matchmaking:join': (preferences: MatchmakingPreferences) => void;
  'matchmaking:leave': () => void;
  
  // Presence events
  'user:online': () => void;
  'user:offline': () => void;
}

// Server -> Client Events
interface ServerToClientEvents {
  // Game events
  'game:move': (gameId: string, move: GameMove, gameState: Game) => void;
  'game:draw-offered': (gameId: string, from: string) => void;
  'game:draw-accepted': (gameId: string) => void;
  'game:draw-declined': (gameId: string) => void;
  'game:resigned': (gameId: string, player: string) => void;
  'game:ended': (gameId: string, result: GameResult) => void;
  'game:chat': (gameId: string, message: ChatMessage) => void;
  'game:opponent-disconnected': (gameId: string) => void;
  'game:opponent-reconnected': (gameId: string) => void;
  
  // Matchmaking events
  'matchmaking:matched': (gameId: string, opponent: UserProfile) => void;
  'matchmaking:queue-position': (position: number, estimated_wait: number) => void;
  
  // Error events
  'error': (message: string, code?: string) => void;
  'game:invalid-move': (gameId: string, reason: string) => void;
}
```

### Authentication/Authorization Strategy

#### JWT Token Structure
```typescript
interface JWTPayload {
  user_id: string;
  username: string;
  elo_rating: number;
  issued_at: number;
  expires_at: number;
  session_id: string; // for token revocation
}
```

#### Authorization Middleware
```typescript
// Example authorization flow
const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) throw new Error('No token provided');
    
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    
    // Check if session is still valid (not revoked)
    const sessionValid = await redis.get(`session:${payload.session_id}`);
    if (!sessionValid) throw new Error('Session revoked');
    
    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};
```

#### WebSocket Authentication
```typescript
// Socket.io authentication
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    
    socket.userId = payload.user_id;
    socket.username = payload.username;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});
```

### Rate Limiting Rules

```typescript
// Rate limiting configuration
const rateLimits = {
  // Authentication endpoints
  '/api/auth/login': { requests: 5, window: '15m', message: 'Too many login attempts' },
  '/api/auth/register': { requests: 3, window: '1h', message: 'Too many registration attempts' },
  
  // Game actions
  '/api/games/*/move': { requests: 1, window: '1s', message: 'Cannot move that quickly' },
  '/api/games/*/chat': { requests: 10, window: '1m', message: 'Chat rate limit exceeded' },
  
  // Search and browse
  '/api/users/search': { requests: 30, window: '1m', message: 'Search rate limit exceeded' },
  '/api/games': { requests: 60, window: '1m', message: 'API rate limit exceeded' },
  
  // WebSocket events
  'game:move': { requests: 1, window: '1s' },
  'game:chat': { requests: 5, window: '30s' },
  'matchmaking:join': { requests: 10, window: '1m' }
};
```

### Error Response Standards

```typescript
// Standard error response format
interface APIError {
  error: {
    code: string; // ERROR_CODE_CONSTANT
    message: string; // Human-readable message
    details?: any; // Additional context
    timestamp: string;
    request_id: string; // For debugging
  };
}

// Example error codes
const ErrorCodes = {
  // Authentication
  INVALID_CREDENTIALS: 'auth/invalid-credentials',
  TOKEN_EXPIRED: 'auth/token-expired',
  SESSION_REVOKED: 'auth/session-revoked',
  
  // Game errors
  GAME_NOT_FOUND: 'game/not-found',
  INVALID_MOVE: 'game/invalid-move',
  NOT_YOUR_TURN: 'game/not-your-turn',
  GAME_ENDED: 'game/already-ended',
  
  // User errors
  USER_NOT_FOUND: 'user/not-found',
  USERNAME_TAKEN: 'user/username-taken',
  EMAIL_TAKEN: 'user/email-taken',
  
  // Server errors
  DATABASE_ERROR: 'server/database-error',
  RATE_LIMIT_EXCEEDED: 'server/rate-limit-exceeded'
} as const;
```

### API Versioning Strategy

```typescript
// URL-based versioning
const apiRoutes = {
  v1: '/api/v1/*',
  v2: '/api/v2/*' // Future versions
};

// Header-based versioning (alternative)
const versionMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const version = req.headers['api-version'] || '1.0';
  req.apiVersion = version;
  next();
};

// Version compatibility matrix
const compatibility = {
  '1.0': { supported: true, deprecated: false },
  '1.1': { supported: true, deprecated: false },
  '2.0': { supported: false, deprecated: false } // Future
};
```

---

## 4. Technical Constraints & Requirements

### Performance Budgets

#### Frontend Performance
```
┌─────────────────────────────────────────┐
│  PERFORMANCE BUDGETS                    │
├─────────────────────────────────────────┤
│  First Contentful Paint: < 1.2s        │
│  Largest Contentful Paint: < 2.0s      │
│  Cumulative Layout Shift: < 0.1        │
│  First Input Delay: < 100ms            │
│  Time to Interactive: < 3.0s           │
│                                         │
│  JavaScript Bundle: < 200KB gzipped    │
│  CSS Bundle: < 50KB gzipped            │
│  Images: WebP/AVIF with lazy loading   │
│  Fonts: Preloaded subset WOFF2         │
└─────────────────────────────────────────┘
```

#### Real-time Performance
```
┌─────────────────────────────────────────┐
│  CHESS-SPECIFIC PERFORMANCE             │
├─────────────────────────────────────────┤
│  Move Latency: < 100ms (99th percentile)│
│  WebSocket Connection: < 500ms setup    │
│  Game State Sync: < 50ms               │
│  Move Validation: < 10ms server-side   │
│  Board Animation: 60 FPS (16.6ms)      │
│  Piece Drag Response: < 16ms           │
└─────────────────────────────────────────┘
```

### Browser Compatibility Requirements

```typescript
// Supported browsers (based on analytics of chess platforms)
const browserSupport = {
  // Desktop (85% of chess players)
  Chrome: '>=90',   // 45% market share
  Firefox: '>=88',  // 15% market share  
  Safari: '>=14',   // 12% market share
  Edge: '>=90',     // 8% market share
  
  // Mobile (15% of chess players, but growing)
  'Chrome Mobile': '>=90',
  'Safari Mobile': '>=14',
  'Samsung Internet': '>=14',
  
  // Progressive enhancement for older browsers
  fallbacks: {
    WebSocket: 'HTTP long polling',
    'CSS Grid': 'Flexbox layout',
    'Modern JS': 'Babel transpilation'
  }
};

// Feature detection strategy
const featureSupport = {
  required: [
    'WebSocket', 'localStorage', 'JSON', 'Promise',
    'fetch', 'classList', 'addEventListener'
  ],
  enhanced: [
    'IntersectionObserver', 'ResizeObserver', 
    'requestIdleCallback', 'Web Workers'
  ],
  progressive: [
    'Service Workers', 'Push Notifications',
    'Web Share API', 'Pointer Events'
  ]
};
```

### Security Requirements (OWASP Compliance)

#### Input Validation & Sanitization
```typescript
// Chess move validation schema
const moveValidation = z.object({
  from: z.string().regex(/^[a-h][1-8]$/, 'Invalid square format'),
  to: z.string().regex(/^[a-h][1-8]$/, 'Invalid square format'),
  promotion: z.enum(['q', 'r', 'b', 'n']).optional()
});

// User input sanitization
const sanitizeUserInput = {
  username: (input: string) => input.replace(/[^\w\-_]/g, '').slice(0, 30),
  message: (input: string) => DOMPurify.sanitize(input).slice(0, 500),
  email: (input: string) => validator.normalizeEmail(input) || null
};
```

#### Authentication Security
```typescript
// Password requirements
const passwordPolicy = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: false, // Optional for better UX
  preventCommonPasswords: true,
  preventUserInfoInPassword: true
};

// Session management
const sessionSecurity = {
  jwtExpiry: '1h', // Short-lived access tokens
  refreshTokenExpiry: '30d', // Longer refresh tokens
  sessionTimeout: '24h', // Auto logout after inactivity
  maxConcurrentSessions: 5, // Per user
  ipBinding: false, // Allow mobile switching
  userAgentBinding: true // Basic fingerprinting
};
```

#### Data Protection
```typescript
// GDPR compliance requirements
const dataProtection = {
  encryption: {
    passwords: 'bcrypt (cost: 12)',
    sensitiveData: 'AES-256-GCM',
    database: 'PostgreSQL TLS',
    transit: 'HTTPS only'
  },
  
  privacy: {
    emailVisible: false, // Only to user themselves
    gameHistoryPublic: true, // Chess games are typically public
    statisticsPublic: true, // ELO ratings are public
    onlineStatusOptional: true, // User can disable
    dataRetention: '7 years', // FIDE standard
    rightToDelete: true, // GDPR requirement
    dataExport: true // User can export their data
  }
};
```

#### API Security
```typescript
// Security headers
const securityHeaders = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': `
    default-src 'self';
    script-src 'self' 'unsafe-eval';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: blob: https:;
    font-src 'self';
    connect-src 'self' wss: ws:;
  `.replace(/\s+/g, ' ').trim()
};
```

### Scalability Considerations

#### Horizontal Scaling Plan
```
┌─────────────────────────────────────────┐
│  SCALABILITY ARCHITECTURE               │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────┐    ┌─────────────┐    │
│  │   Client    │    │   Client    │    │
│  └─────┬───────┘    └─────┬───────┘    │
│        │                  │             │
│        └────────┬─────────┘             │
│                 │                       │
│  ┌─────────────────────────────────────┐ │
│  │       Load Balancer (Nginx)        │ │
│  └─────────────┬───────────────────────┘ │
│                │                         │
│  ┌─────────────┴───────────────────────┐ │
│  │     Next.js App Instances           │ │
│  │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │ │
│  │  │App 1│ │App 2│ │App 3│ │App N│   │ │
│  │  └─────┘ └─────┘ └─────┘ └─────┘   │ │
│  └─────────────┬───────────────────────┘ │
│                │                         │
│  ┌─────────────┴───────────────────────┐ │
│  │       Redis (Session + Cache)      │ │
│  └─────────────┬───────────────────────┘ │
│                │                         │
│  ┌─────────────┴───────────────────────┐ │
│  │    PostgreSQL (Primary + Replica)  │ │
│  └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

#### Performance Monitoring
```typescript
// Key metrics to monitor
const performanceMetrics = {
  application: [
    'response_time_p95',
    'error_rate',
    'throughput_rps',
    'active_connections',
    'websocket_connections'
  ],
  
  chess_specific: [
    'move_latency_p99',
    'game_completion_rate',
    'concurrent_games',
    'invalid_move_rate',
    'disconnection_recovery_time'
  ],
  
  infrastructure: [
    'cpu_usage',
    'memory_usage',
    'disk_io',
    'network_io',
    'database_connection_pool'
  ]
};

// Alert thresholds
const alertThresholds = {
  'move_latency_p99 > 200ms': 'CRITICAL',
  'error_rate > 1%': 'HIGH',
  'active_connections > 8000': 'MEDIUM',
  'database_connections > 80%': 'HIGH'
};
```

### Development & Deployment Pipeline

```yaml
# Example GitHub Actions workflow
name: Chess Platform CI/CD

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm type-check
      - run: pnpm test:unit
      - run: pnpm test:e2e
      - run: pnpm build
      
      # Chess-specific tests
      - run: pnpm test:chess-engine
      - run: pnpm test:websocket
      - run: pnpm test:database

  deploy:
    if: github.ref == 'refs/heads/main'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to MorphVPS
        run: |
          # Deployment commands
          # Database migrations
          # Health checks
```

---

## Implementation Priorities

### Phase 1: Foundation (Week 1-2)
- [ ] Database setup and initial migrations
- [ ] Authentication system (NextAuth.js)
- [ ] Basic API structure
- [ ] WebSocket connection management
- [ ] Chess move validation engine

### Phase 2: Core Features (Week 3-4)
- [ ] Game creation and matchmaking
- [ ] Real-time move synchronization
- [ ] Basic UI components (board, controls)
- [ ] User profiles and statistics
- [ ] Game history and PGN export

### Phase 3: Enhancement (Week 5-6)
- [ ] Friend system and private games
- [ ] Chat functionality
- [ ] Advanced UI animations
- [ ] Mobile optimization
- [ ] Performance optimization

### Phase 4: Production Ready (Week 7-8)
- [ ] Comprehensive testing
- [ ] Security audit
- [ ] Performance monitoring
- [ ] Documentation
- [ ] Deployment pipeline

---

## Conclusion

This technical architecture provides a solid foundation for building a modern, scalable chess platform that can compete with established players while offering unique value through accessibility and progressive complexity. The stack choices prioritize developer experience, performance, and maintainability while ensuring we can deliver the <100ms latency target that makes chess feel responsive and enjoyable.

The modular architecture allows us to iterate quickly during development while maintaining the flexibility to scale horizontally as our user base grows. Most importantly, every technical decision supports our core mission: creating the most accessible chess platform on the web.
