// Export all schema tables and types
export * from './users';
export * from './games';
export * from './game-moves';
export * from './user-friends';
export * from './game-chats';
export * from './chess-analysis';

// Re-export for convenience
import { users } from './users';
import { games } from './games';
import { gameMoves } from './game-moves';
import { userFriends } from './user-friends';
import { gameChats } from './game-chats';
import { chessAnalysis } from './chess-analysis';

export const schema = {
  users,
  games,
  gameMoves,
  userFriends,
  gameChats,
  chessAnalysis,
};
