import { pgTable, uuid, varchar, text, integer, timestamp, jsonb, boolean, index, check } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users';

export const games = pgTable('games', {
  id: uuid('id').defaultRandom().primaryKey(),
  white_player_id: uuid('white_player_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  black_player_id: uuid('black_player_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  status: varchar('status', { length: 20 }).notNull().default('waiting'),
  time_control: jsonb('time_control').notNull().default(sql`'{"initial": 600, "increment": 5}'::jsonb`),
  winner_id: uuid('winner_id').references(() => users.id, { onDelete: 'set null' }),
  result: varchar('result', { length: 10 }), // '1-0', '0-1', '1/2-1/2', '*'
  termination: varchar('termination', { length: 30 }),
  started_at: timestamp('started_at', { withTimezone: true }),
  ended_at: timestamp('ended_at', { withTimezone: true }),
  current_fen: text('current_fen').notNull().default('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'),
  game_pgn: text('game_pgn'),
  white_time_left: integer('white_time_left').notNull().default(600), // seconds
  black_time_left: integer('black_time_left').notNull().default(600), // seconds
  move_count: integer('move_count').notNull().default(0),
  last_move_at: timestamp('last_move_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  // Indexes for performance
  statusIdx: index('idx_games_status').on(table.status),
  whitePlayerIdx: index('idx_games_white_player').on(table.white_player_id),
  blackPlayerIdx: index('idx_games_black_player').on(table.black_player_id),
  createdAtIdx: index('idx_games_created_at').on(table.created_at),
  activeGamesIdx: index('idx_games_active_games').on(table.status, table.created_at)
    .where(sql`${table.status} IN ('waiting', 'active')`),
  completedGamesIdx: index('idx_games_completed').on(table.status, table.ended_at)
    .where(sql`${table.status} = 'completed'`),
  
  // Check constraints
  differentPlayersCheck: check('different_players', 
    sql`${table.white_player_id} != ${table.black_player_id}`
  ),
  statusCheck: check('status_valid', 
    sql`${table.status} IN ('waiting', 'active', 'completed', 'aborted', 'draw_offered', 'adjourned')`
  ),
  resultCheck: check('result_valid', 
    sql`${table.result} IN ('1-0', '0-1', '1/2-1/2', '*') OR ${table.result} IS NULL`
  ),
  terminationCheck: check('termination_valid', 
    sql`${table.termination} IN ('checkmate', 'resignation', 'timeout', 'draw_agreement', 'stalemate', 'insufficient_material', 'threefold_repetition', '50_move_rule', 'abandoned') OR ${table.termination} IS NULL`
  ),
  endTimeCheck: check('end_time_valid', 
    sql`${table.ended_at} IS NULL OR ${table.ended_at} >= ${table.started_at}`
  ),
  timeLeftCheck: check('time_left_positive', 
    sql`${table.white_time_left} >= 0 AND ${table.black_time_left} >= 0`
  ),
  moveCountCheck: check('move_count_positive', 
    sql`${table.move_count} >= 0`
  ),
}));

export type Game = typeof games.$inferSelect;
export type NewGame = typeof games.$inferInsert;
