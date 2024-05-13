CREATE TABLE `accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`institution_id` text NOT NULL,
	`item_id` text NOT NULL,
	`account_type_id` text,
	`balance` numeric NOT NULL,
	`currency_code_id` text,
	FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`account_type_id`) REFERENCES `account_type`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`currency_code_id`) REFERENCES `currency_code`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `account_type` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`subtype` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `currency_code` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `items` (
	`id` text PRIMARY KEY NOT NULL,
	`plaid_access_token` text NOT NULL,
	`institution_id` text NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
