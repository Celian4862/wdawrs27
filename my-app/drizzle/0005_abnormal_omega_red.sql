ALTER TABLE `games` ADD `player_count` integer DEFAULT 2 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `player_name` text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `unique_users_name_game_id` ON `users` (`game_id`,`player_name`);--> statement-breakpoint
CREATE UNIQUE INDEX `unique_users_role_game_id` ON `users` (`game_id`,`role`);