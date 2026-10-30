CREATE TABLE `games` (
	`id` text PRIMARY KEY NOT NULL,
	`status` text DEFAULT 'waiting' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`players_json` text NOT NULL,
	`state_json` text NOT NULL
);
