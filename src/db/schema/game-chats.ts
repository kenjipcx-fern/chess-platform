import { pgTable, uuid, varchar, text, timestamp, index, check } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { games } from './games';
import { users } from './users';

export const gameChats = pgTable('game_chats', {
  id: uuid('id').defaultRandom().primaryKey(),
  game_id: uuid('game_id').notNull().references(() => games.id, { onDelete: 'cascade' }),
  user_id: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  message: text('message').notNull(),
  message_type: varchar('message_type', { length: 20 }).notNull().default('chat'),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  // Indexes for performance
  gameTimeIdx: index('idx_chat_game_time').on(table.game_id, table.created_at),
  userIdx: index('idx_chat_user').on(table.user_id),
  
  // Check constraints
  messageLengthCheck: check('message_length', sql`length(${table.message}) <= 500 AND length(${table.message}) > 0`),
  messageTypeCheck: check('message_type_valid', 
    sql`${table.message_type} IN ('chat', 'draw_offer', 'draw_accept', 'draw_decline', 'resignation')`
  ),
}));

export type GameChat = typeof gameChats.$inferSelect;
export type NewGameChat = typeof gameChats.$inferInsert;
