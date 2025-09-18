import { pgTable, uuid, varchar, text, integer, timestamp, boolean, index, check, unique } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { games } from './games';

export const gameMoves = pgTable('game_moves', {
  id: uuid('id').defaultRandom().primaryKey(),
  game_id: uuid('game_id').notNull().references(() => games.id, { onDelete: 'cascade' }),
  move_number: integer('move_number').notNull(),
  color: varchar('color', { length: 5 }).notNull(),
  from_square: varchar('from_square', { length: 2 }).notNull(),
  to_square: varchar('to_square', { length: 2 }).notNull(),
  piece_moved: varchar('piece_moved', { length: 6 }).notNull(),
  captured_piece: varchar('captured_piece', { length: 6 }),
  is_castling: boolean('is_castling').notNull().default(false),
  is_en_passant: boolean('is_en_passant').notNull().default(false),
  promotion_piece: varchar('promotion_piece', { length: 6 }),
  check_status: varchar('check_status', { length: 10 }),
  move_notation: varchar('move_notation', { length: 10 }).notNull(), // SAN notation
  position_after: text('position_after').notNull(), // FEN after this move
  time_taken: integer('time_taken'), // milliseconds taken to make this move
  time_left: integer('time_left').notNull(), // milliseconds left after this move
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  // Unique constraint for game + move number + color
  uniqueMove: unique('unique_game_move_color').on(table.game_id, table.move_number, table.color),
  
  // Indexes for performance
  gameIdIdx: index('idx_moves_game_id').on(table.game_id),
  gameMoveIdx: index('idx_moves_game_move').on(table.game_id, table.move_number),
  pieceIdx: index('idx_moves_piece').on(table.piece_moved),
  createdAtIdx: index('idx_moves_created_at').on(table.created_at),
  
  // Check constraints
  moveNumberCheck: check('move_number_positive', sql`${table.move_number} > 0`),
  colorCheck: check('color_valid', sql`${table.color} IN ('white', 'black')`),
  fromSquareCheck: check('from_square_valid', sql`${table.from_square} ~ '^[a-h][1-8]$'`),
  toSquareCheck: check('to_square_valid', sql`${table.to_square} ~ '^[a-h][1-8]$'`),
  pieceMovedCheck: check('piece_moved_valid', 
    sql`${table.piece_moved} IN ('pawn', 'rook', 'knight', 'bishop', 'queen', 'king')`
  ),
  capturedPieceCheck: check('captured_piece_valid', 
    sql`${table.captured_piece} IN ('pawn', 'rook', 'knight', 'bishop', 'queen') OR ${table.captured_piece} IS NULL`
  ),
  promotionPieceCheck: check('promotion_piece_valid', 
    sql`${table.promotion_piece} IN ('rook', 'knight', 'bishop', 'queen') OR ${table.promotion_piece} IS NULL`
  ),
  checkStatusCheck: check('check_status_valid', 
    sql`${table.check_status} IN ('check', 'checkmate') OR ${table.check_status} IS NULL`
  ),
  timeLeftCheck: check('time_left_positive', sql`${table.time_left} >= 0`),
  timeTakenCheck: check('time_taken_positive', 
    sql`${table.time_taken} IS NULL OR ${table.time_taken} >= 0`
  ),
}));

export type GameMove = typeof gameMoves.$inferSelect;
export type NewGameMove = typeof gameMoves.$inferInsert;
