import { pgTable, uuid, varchar, timestamp, index, check, unique } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users';

export const userFriends = pgTable('user_friends', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  friend_id: uuid('friend_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  // Unique constraint to prevent duplicate friendships
  uniqueFriendship: unique('unique_user_friend').on(table.user_id, table.friend_id),
  
  // Indexes for performance
  userStatusIdx: index('idx_friends_user_status').on(table.user_id, table.status),
  friendStatusIdx: index('idx_friends_friend_status').on(table.friend_id, table.status),
  
  // Check constraints
  differentUsersCheck: check('different_users', sql`${table.user_id} != ${table.friend_id}`),
  statusCheck: check('status_valid', 
    sql`${table.status} IN ('pending', 'accepted', 'declined', 'blocked')`
  ),
}));

export type UserFriend = typeof userFriends.$inferSelect;
export type NewUserFriend = typeof userFriends.$inferInsert;
