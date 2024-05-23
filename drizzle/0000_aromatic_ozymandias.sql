CREATE TABLE `accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`item_id` text NOT NULL,
	`account_type_id` text,
	`balance` numeric,
	`currency_code_id` text,
	`legal_name` text NOT NULL,
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
	`icon` text NOT NULL,
	`color` text NOT NULL
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
CREATE TABLE `groupTransactionState` (
	`id` text PRIMARY KEY NOT NULL,
	`group_transaction_id` text NOT NULL,
	`pending` integer,
	FOREIGN KEY (`group_transaction_id`) REFERENCES `transactionsToGroups`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `groupTransactionToUsersToGroups` (
	`id` text PRIMARY KEY NOT NULL,
	`amount` real NOT NULL,
	`group_transaction_state_id` text NOT NULL,
	`users_to_groups_id` text NOT NULL,
	FOREIGN KEY (`group_transaction_state_id`) REFERENCES `groupTransactionState`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`users_to_groups_id`) REFERENCES `usersToGroups`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `groupTransfer` (
	`id` text PRIMARY KEY NOT NULL,
	`group_transaction_to_users_to_groups_id` text NOT NULL,
	`group_transfer_receiver_status_id` text NOT NULL,
	`group_transfer_sender_status_id` text NOT NULL,
	`sender_account_id` text NOT NULL,
	`receiver_account_id` text NOT NULL,
	`sender_completed_timestamp` text,
	`sender_initiated_timestamp` text NOT NULL,
	`receiver_completed_timestamp` text,
	`receiver_initiated_timestamp` text NOT NULL,
	FOREIGN KEY (`group_transaction_to_users_to_groups_id`) REFERENCES `groupTransactionToUsersToGroups`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`group_transfer_receiver_status_id`) REFERENCES `groupTransferStatus`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`group_transfer_sender_status_id`) REFERENCES `groupTransferStatus`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`sender_account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`receiver_account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `groupTransferStatus` (
	`id` text PRIMARY KEY NOT NULL,
	`status` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `items` (
	`id` text PRIMARY KEY NOT NULL,
	`plaid_access_token` text NOT NULL,
	`institution_name` text,
	`user_id` text NOT NULL,
	`next_cursor` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `memberType` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`fk_user_group_id` text NOT NULL,
	`message` text NOT NULL,
	`timestamp` text NOT NULL,
	FOREIGN KEY (`fk_user_group_id`) REFERENCES `usersToGroups`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `receiptsToItems` (
	`id` text PRIMARY KEY NOT NULL,
	`product_name` text NOT NULL,
	`quantity` integer NOT NULL,
	`cost_per_item` real NOT NULL,
	`fk_transaction_receipt_id` text NOT NULL,
	FOREIGN KEY (`fk_transaction_receipt_id`) REFERENCES `transactionReceipt`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`category_id` text NOT NULL,
	`company` text,
	`amount` real NOT NULL,
	`timestamp` text,
	`address` text,
	`latitude` real,
	`longitude` real,
	`pending` integer,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `transactionReceipt` (
	`id` text PRIMARY KEY NOT NULL,
	`fk_group_transaction_state_id` text NOT NULL,
	`fk_transaction_id` text NOT NULL,
	FOREIGN KEY (`fk_group_transaction_state_id`) REFERENCES `groupTransactionState`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`fk_transaction_id`) REFERENCES `transactions`(`id`) ON UPDATE no action ON DELETE no action
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
	`color` text NOT NULL,
	`created_at` text DEFAULT (current_timestamp)
);
--> statement-breakpoint
CREATE TABLE `usersToGroups` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`group_id` text NOT NULL,
	`member_type_id` text NOT NULL,
	`deposit_account_id` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`member_type_id`) REFERENCES `memberType`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`deposit_account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `usersToItems` (
	`id` text PRIMARY KEY NOT NULL,
	`items_to_user_id` text NOT NULL,
	`users_to_group_id` text NOT NULL,
	`percent_share` real NOT NULL,
	FOREIGN KEY (`items_to_user_id`) REFERENCES `receiptsToItems`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`users_to_group_id`) REFERENCES `usersToGroups`(`id`) ON UPDATE no action ON DELETE cascade
);
