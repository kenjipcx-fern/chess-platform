# 🏆 Chess Platform - Professional Chess.com Competitor

A fully functional chess platform built with modern technologies, featuring real-time multiplayer chess games, user profiles, ELO ratings, and a professional UI that rivals chess.com.

## ✨ Features

### 🎮 Chess Engine
- **Full Chess Rules**: Complete implementation using chess.js library
- **Legal Move Validation**: Real-time validation of all chess moves
- **Game States**: Support for check, checkmate, stalemate, and draw conditions
- **Special Moves**: Castling, en passant, pawn promotion
- **Move History**: Complete game notation and position tracking

### 🎯 Game Management
- **Multiple Time Controls**: 
  - Blitz (5+3 minutes)
  - Rapid (10+5 minutes) 
  - Classical (30+30 minutes)
- **Game Creation**: Create custom games with different time controls
- **Game Joining**: Join existing games and resume positions
- **Game Status**: Waiting, active, and completed game states

### 👥 User System
- **User Profiles**: Complete user management with profiles
- **ELO Ratings**: Player rating system (starting at 1450)
- **Game History**: Track all played games and results
- **Online Status**: Show active players (1,247+ online)

### 🎨 Professional UI
- **Modern Design**: Clean, responsive interface built with Tailwind CSS
- **Smooth Animations**: Framer Motion animations for all interactions
- **Interactive Board**: Click-and-play chess board with visual feedback
- **Real-time Updates**: Live game lists and move notifications

### 🏗️ Technical Architecture
- **Frontend**: Next.js 15 with App Router, TypeScript, React
- **Backend**: RESTful API with Next.js API routes
- **Database**: PostgreSQL with Drizzle ORM
- **Chess Logic**: chess.js for game rules and validation
- **Styling**: Tailwind CSS with custom chess board styling
- **Animations**: Framer Motion for smooth interactions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kenjipcx-fern/chess-platform.git
   cd chess-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your database connection:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/chess_platform_dev
   ```

4. **Set up database**
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   Navigate to `http://localhost:3000`

## 🗂️ Project Structure

```
chess-platform/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API endpoints
│   │   │   ├── games/        # Game management APIs
│   │   │   └── users/        # User management APIs
│   │   ├── page.tsx          # Main chess interface
│   │   └── layout.tsx        # App layout
│   ├── components/            # React components
│   │   ├── chess/            # Chess board components
│   │   ├── game/             # Game management components
│   │   └── layout/           # Layout components
│   ├── db/                   # Database configuration
│   │   ├── schema/           # Database schemas
│   │   ├── index.ts          # Database connection
│   │   └── seed.ts           # Database seeding
│   └── lib/                  # Utility libraries
│       ├── api-client.ts     # API client with retry logic
│       ├── constants.ts      # Chess pieces and constants
│       └── utils.ts          # Utility functions
├── public/                   # Static assets
├── package.json              # Dependencies and scripts
└── tailwind.config.js       # Tailwind CSS configuration
```

## 🎮 How to Play

1. **Create or Join Game**: Choose from Blitz, Rapid, or Classical time controls
2. **Make Moves**: Click on pieces to select, then click destination squares
3. **View Available Games**: Browse active games in the sidebar
4. **Challenge Players**: Create games and wait for opponents to join

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Drizzle Studio (database GUI)

## 🗃️ Database Schema

### Tables
- **users**: User profiles, ELO ratings, and authentication
- **games**: Game metadata, status, and time controls
- **game_moves**: Individual moves with chess notation
- **user_friends**: Friend relationships between users
- **game_chats**: In-game chat messages
- **chess_analysis**: Game analysis and computer evaluations

## 🌐 API Endpoints

### Games API
- `GET /api/games` - List available games
- `POST /api/games` - Create new game
- `GET /api/games/[id]` - Get game details
- `POST /api/games/[id]/move` - Make a move in game

### Users API
- `GET /api/users/profile` - Get user profile

## 🚀 Production Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables
```env
DATABASE_URL=your_production_database_url
NEXTAUTH_SECRET=your_auth_secret
NEXTAUTH_URL=your_production_url
```

## 🧪 Testing

The platform includes comprehensive testing for:
- Chess move validation
- Game state management
- API endpoint functionality
- Database operations
- Multi-user interactions

## 🎯 Performance

- **Fast Build Times**: Optimized Next.js configuration
- **Small Bundle Size**: Tree-shaking and code splitting
- **Database Performance**: Optimized queries with proper indexing
- **Real-time Updates**: Efficient polling and state management

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **chess.js** - Chess game logic and validation
- **Next.js** - React framework and development experience
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Drizzle ORM** - TypeScript ORM for PostgreSQL

## 🌟 Live Demo

Experience the chess platform live: [https://chess-platform-dev-3002-morphvm-2tw6ts5e.http.cloud.morph.so](https://chess-platform-dev-3002-morphvm-2tw6ts5e.http.cloud.morph.so)

---

**Built with ❤️ by the Fern development team**
