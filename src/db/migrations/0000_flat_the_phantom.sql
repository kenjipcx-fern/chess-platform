CREATE TABLE "chess_analysis" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"game_id" uuid NOT NULL,
	"move_number" integer NOT NULL,
	"position_fen" text NOT NULL,
	"best_move" varchar(10),
	"evaluation" numeric(5, 2),
	"depth" integer,
	"engine_name" varchar(50) DEFAULT 'stockfish' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "unique_game_move_analysis" UNIQUE("game_id","move_number"),
	CONSTRAINT "move_number_positive" CHECK ("chess_analysis"."move_number" >= 0),
	CONSTRAINT "depth_positive" CHECK ("chess_analysis"."depth" IS NULL OR "chess_analysis"."depth" > 0),
	CONSTRAINT "evaluation_range" CHECK ("chess_analysis"."evaluation" IS NULL OR ("chess_analysis"."evaluation" >= -99.99 AND "chess_analysis"."evaluation" <= 99.99))
);
--> statement-breakpoint
CREATE TABLE "game_chats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"game_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"message" text NOT NULL,
	"message_type" varchar(20) DEFAULT 'chat' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "message_length" CHECK (length("game_chats"."message") <= 500 AND length("game_chats"."message") > 0),
	CONSTRAINT "message_type_valid" CHECK ("game_chats"."message_type" IN ('chat', 'draw_offer', 'draw_accept', 'draw_decline', 'resignation'))
);
--> statement-breakpoint
CREATE TABLE "game_moves" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"game_id" uuid NOT NULL,
	"move_number" integer NOT NULL,
	"color" varchar(5) NOT NULL,
	"from_square" varchar(2) NOT NULL,
	"to_square" varchar(2) NOT NULL,
	"piece_moved" varchar(6) NOT NULL,
	"captured_piece" varchar(6),
	"is_castling" boolean DEFAULT false NOT NULL,
	"is_en_passant" boolean DEFAULT false NOT NULL,
	"promotion_piece" varchar(6),
	"check_status" varchar(10),
	"move_notation" varchar(10) NOT NULL,
	"position_after" text NOT NULL,
	"time_taken" integer,
	"time_left" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "unique_game_move_color" UNIQUE("game_id","move_number","color"),
	CONSTRAINT "move_number_positive" CHECK ("game_moves"."move_number" > 0),
	CONSTRAINT "color_valid" CHECK ("game_moves"."color" IN ('white', 'black')),
	CONSTRAINT "from_square_valid" CHECK ("game_moves"."from_square" ~ '^[a-h][1-8]$'),
	CONSTRAINT "to_square_valid" CHECK ("game_moves"."to_square" ~ '^[a-h][1-8]$'),
	CONSTRAINT "piece_moved_valid" CHECK ("game_moves"."piece_moved" IN ('pawn', 'rook', 'knight', 'bishop', 'queen', 'king')),
	CONSTRAINT "captured_piece_valid" CHECK ("game_moves"."captured_piece" IN ('pawn', 'rook', 'knight', 'bishop', 'queen') OR "game_moves"."captured_piece" IS NULL),
	CONSTRAINT "promotion_piece_valid" CHECK ("game_moves"."promotion_piece" IN ('rook', 'knight', 'bishop', 'queen') OR "game_moves"."promotion_piece" IS NULL),
	CONSTRAINT "check_status_valid" CHECK ("game_moves"."check_status" IN ('check', 'checkmate') OR "game_moves"."check_status" IS NULL),
	CONSTRAINT "time_left_positive" CHECK ("game_moves"."time_left" >= 0),
	CONSTRAINT "time_taken_positive" CHECK ("game_moves"."time_taken" IS NULL OR "game_moves"."time_taken" >= 0)
);
--> statement-breakpoint
CREATE TABLE "games" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"white_player_id" uuid NOT NULL,
	"black_player_id" uuid NOT NULL,
	"status" varchar(20) DEFAULT 'waiting' NOT NULL,
	"time_control" jsonb DEFAULT '{"initial": 600, "increment": 5}'::jsonb NOT NULL,
	"winner_id" uuid,
	"result" varchar(10),
	"termination" varchar(30),
	"started_at" timestamp with time zone,
	"ended_at" timestamp with time zone,
	"current_fen" text DEFAULT 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' NOT NULL,
	"game_pgn" text,
	"white_time_left" integer DEFAULT 600 NOT NULL,
	"black_time_left" integer DEFAULT 600 NOT NULL,
	"move_count" integer DEFAULT 0 NOT NULL,
	"last_move_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "different_players" CHECK ("games"."white_player_id" != "games"."black_player_id"),
	CONSTRAINT "status_valid" CHECK ("games"."status" IN ('waiting', 'active', 'completed', 'aborted', 'draw_offered', 'adjourned')),
	CONSTRAINT "result_valid" CHECK ("games"."result" IN ('1-0', '0-1', '1/2-1/2', '*') OR "games"."result" IS NULL),
	CONSTRAINT "termination_valid" CHECK ("games"."termination" IN ('checkmate', 'resignation', 'timeout', 'draw_agreement', 'stalemate', 'insufficient_material', 'threefold_repetition', '50_move_rule', 'abandoned') OR "games"."termination" IS NULL),
	CONSTRAINT "end_time_valid" CHECK ("games"."ended_at" IS NULL OR "games"."ended_at" >= "games"."started_at"),
	CONSTRAINT "time_left_positive" CHECK ("games"."white_time_left" >= 0 AND "games"."black_time_left" >= 0),
	CONSTRAINT "move_count_positive" CHECK ("games"."move_count" >= 0)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(30) NOT NULL,
	"email" varchar(100) NOT NULL,
	"password_hash" text,
	"display_name" varchar(50),
	"bio" text,
	"country" varchar(2),
	"elo_rating" integer DEFAULT 1200 NOT NULL,
	"games_played" integer DEFAULT 0 NOT NULL,
	"games_won" integer DEFAULT 0 NOT NULL,
	"games_drawn" integer DEFAULT 0 NOT NULL,
	"games_lost" integer DEFAULT 0 NOT NULL,
	"is_online" boolean DEFAULT false NOT NULL,
	"last_seen" timestamp with time zone,
	"account_type" varchar(20) DEFAULT 'free' NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"preferences" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "username_length" CHECK (length("users"."username") >= 3),
	CONSTRAINT "elo_rating_range" CHECK ("users"."elo_rating" >= 100 AND "users"."elo_rating" <= 3000),
	CONSTRAINT "account_type_valid" CHECK ("users"."account_type" IN ('free', 'premium', 'admin')),
	CONSTRAINT "games_consistency" CHECK ("users"."games_played" = "users"."games_won" + "users"."games_drawn" + "users"."games_lost")
);
--> statement-breakpoint
CREATE TABLE "user_friends" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"friend_id" uuid NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "unique_user_friend" UNIQUE("user_id","friend_id"),
	CONSTRAINT "different_users" CHECK ("user_friends"."user_id" != "user_friends"."friend_id"),
	CONSTRAINT "status_valid" CHECK ("user_friends"."status" IN ('pending', 'accepted', 'declined', 'blocked'))
);
--> statement-breakpoint
ALTER TABLE "chess_analysis" ADD CONSTRAINT "chess_analysis_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_chats" ADD CONSTRAINT "game_chats_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_chats" ADD CONSTRAINT "game_chats_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_moves" ADD CONSTRAINT "game_moves_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_white_player_id_users_id_fk" FOREIGN KEY ("white_player_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_black_player_id_users_id_fk" FOREIGN KEY ("black_player_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_winner_id_users_id_fk" FOREIGN KEY ("winner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_friends" ADD CONSTRAINT "user_friends_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_friends" ADD CONSTRAINT "user_friends_friend_id_users_id_fk" FOREIGN KEY ("friend_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_analysis_game" ON "chess_analysis" USING btree ("game_id");--> statement-breakpoint
CREATE INDEX "idx_analysis_evaluation" ON "chess_analysis" USING btree ("evaluation");--> statement-breakpoint
CREATE INDEX "idx_chat_game_time" ON "game_chats" USING btree ("game_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_chat_user" ON "game_chats" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_moves_game_id" ON "game_moves" USING btree ("game_id");--> statement-breakpoint
CREATE INDEX "idx_moves_game_move" ON "game_moves" USING btree ("game_id","move_number");--> statement-breakpoint
CREATE INDEX "idx_moves_piece" ON "game_moves" USING btree ("piece_moved");--> statement-breakpoint
CREATE INDEX "idx_moves_created_at" ON "game_moves" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_games_status" ON "games" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_games_white_player" ON "games" USING btree ("white_player_id");--> statement-breakpoint
CREATE INDEX "idx_games_black_player" ON "games" USING btree ("black_player_id");--> statement-breakpoint
CREATE INDEX "idx_games_created_at" ON "games" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_games_active_games" ON "games" USING btree ("status","created_at") WHERE "games"."status" IN ('waiting', 'active');--> statement-breakpoint
CREATE INDEX "idx_games_completed" ON "games" USING btree ("status","ended_at") WHERE "games"."status" = 'completed';--> statement-breakpoint
CREATE INDEX "idx_users_elo_rating" ON "users" USING btree ("elo_rating");--> statement-breakpoint
CREATE INDEX "idx_users_username" ON "users" USING btree ("username");--> statement-breakpoint
CREATE INDEX "idx_users_email" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_users_online" ON "users" USING btree ("is_online","last_seen");--> statement-breakpoint
CREATE INDEX "idx_users_country" ON "users" USING btree ("country");--> statement-breakpoint
CREATE INDEX "idx_users_created_at" ON "users" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_friends_user_status" ON "user_friends" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX "idx_friends_friend_status" ON "user_friends" USING btree ("friend_id","status");