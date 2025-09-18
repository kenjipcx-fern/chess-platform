import { pgTable, uuid, varchar, text, integer, decimal, timestamp, index, unique, check } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { games } from './games';

export const chessAnalysis = pgTable('chess_analysis', {
  id: uuid('id').defaultRandom().primaryKey(),
  game_id: uuid('game_id').notNull().references(() => games.id, { onDelete: 'cascade' }),
  move_number: integer('move_number').notNull(),
  position_fen: text('position_fen').notNull(),
  best_move: varchar('best_move', { length: 10 }),
  evaluation: decimal('evaluation', { precision: 5, scale: 2 }), // centipawns (e.g., 1.50 = +150 centipawns)
  depth: integer('depth'),
  engine_name: varchar('engine_name', { length: 50 }).notNull().default('stockfish'),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  // Unique constraint for game + move number
  uniqueAnalysis: unique('unique_game_move_analysis').on(table.game_id, table.move_number),
  
  // Indexes for performance
  gameIdx: index('idx_analysis_game').on(table.game_id),
  evaluationIdx: index('idx_analysis_evaluation').on(table.evaluation),
  
  // Check constraints
  moveNumberCheck: check('move_number_positive', sql`${table.move_number} >= 0`),
  depthCheck: check('depth_positive', sql`${table.depth} IS NULL OR ${table.depth} > 0`),
  evaluationRangeCheck: check('evaluation_range', 
    sql`${table.evaluation} IS NULL OR (${table.evaluation} >= -99.99 AND ${table.evaluation} <= 99.99)`
  ),
}));

export type ChessAnalysis = typeof chessAnalysis.$inferSelect;
export type NewChessAnalysis = typeof chessAnalysis.$inferInsert;
