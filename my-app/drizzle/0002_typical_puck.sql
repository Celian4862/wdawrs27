ALTER TABLE `users` RENAME COLUMN "gameID" TO "gameId";--> statement-breakpoint
ALTER TABLE `users` ADD `is_admin` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `role` text NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ALTER COLUMN "gameId" TO "gameId" text NOT NULL REFERENCES games(id) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `games` DROP COLUMN `players_json`;