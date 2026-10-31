CREATE TABLE `users` (
	`token` text PRIMARY KEY NOT NULL,
	`gameID` text NOT NULL,
	FOREIGN KEY (`gameID`) REFERENCES `games`(`id`) ON UPDATE no action ON DELETE cascade
);
