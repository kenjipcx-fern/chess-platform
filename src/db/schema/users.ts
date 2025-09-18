import { pgTable, uuid, varchar, text, integer, timestamp, jsonb, boolean, index, check } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  username: varchar('username', { length: 30 }).notNull().unique(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  password_hash: text('password_hash'), // nullable for OAuth users
  display_name: varchar('display_name', { length: 50 }),
  bio: text('bio'),
  country: varchar('country', { length: 2 }), // ISO country codes
  elo_rating: integer('elo_rating').notNull().default(1200),
  games_played: integer('games_played').notNull().default(0),
  games_won: integer('games_won').notNull().default(0),
  games_drawn: integer('games_drawn').notNull().default(0),
  games_lost: integer('games_lost').notNull().default(0),
  is_online: boolean('is_online').notNull().default(false),
  last_seen: timestamp('last_seen', { withTimezone: true }),
  account_type: varchar('account_type', { length: 20 }).notNull().default('free'),
  is_verified: boolean('is_verified').notNull().default(false),
  preferences: jsonb('preferences').default(sql`'{}'::jsonb`),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  // Indexes for performance
  eloRatingIdx: index('idx_users_elo_rating').on(table.elo_rating),
  usernameIdx: index('idx_users_username').on(table.username),
  emailIdx: index('idx_users_email').on(table.email),
  onlineIdx: index('idx_users_online').on(table.is_online, table.last_seen),
  countryIdx: index('idx_users_country').on(table.country),
  createdAtIdx: index('idx_users_created_at').on(table.created_at),
  
  // Check constraints
  usernameCheck: check('username_length', sql`length(${table.username}) >= 3`),
  eloRatingCheck: check('elo_rating_range', sql`${table.elo_rating} >= 100 AND ${table.elo_rating} <= 3000`),
  accountTypeCheck: check('account_type_valid', sql`${table.account_type} IN ('free', 'premium', 'admin')`),
  gamesConsistencyCheck: check('games_consistency', 
    sql`${table.games_played} = ${table.games_won} + ${table.games_drawn} + ${table.games_lost}`
  ),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
