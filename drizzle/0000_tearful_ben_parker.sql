CREATE TABLE `accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`item_id` text NOT NULL,
	`account_type_id` text,
	`balance` numeric,
	`currency_code_id` text,
	FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`account_type_id`) REFERENCES `account_type`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`currency_code_id`) REFERENCES `currency_code`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `account_type` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`display_name` text NOT NULL,
	`icon` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `currency_code` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `groups` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`icon` text NOT NULL,
	`color` text NOT NULL,
	`temporary` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `institutions` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `items` (
	`id` text PRIMARY KEY NOT NULL,
	`plaid_access_token` text NOT NULL,
	`institution_id` text,
	`user_id` text NOT NULL,
	FOREIGN KEY (`institution_id`) REFERENCES `institutions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `memberType` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` integer,
	`account_id` text NOT NULL,
	`category_id` text NOT NULL,
	`company` text,
	`amount` real NOT NULL,
	`timestamp` text,
	`address` text,
	`latitude` real,
	`longitude` real,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `transactionsToGroups` (
	`id` text PRIMARY KEY NOT NULL,
	`group_id` text NOT NULL,
	`transaction_id` text NOT NULL,
	FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`transaction_id`) REFERENCES `transactions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`email` text NOT NULL,
	`picture` text,
	`created_at` text DEFAULT (current_timestamp)
);
--> statement-breakpoint
CREATE TABLE `usersToGroups` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`group_id` text NOT NULL,
	`member_type_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`member_type_id`) REFERENCES `memberType`(`id`) ON UPDATE no action ON DELETE no action
);
