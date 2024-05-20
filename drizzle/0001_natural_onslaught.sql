CREATE TABLE `transactionState` (
	`id` text PRIMARY KEY NOT NULL,
	`fk_group_transaction_id` text NOT NULL,
	`pending` integer,
	FOREIGN KEY (`fk_group_transaction_id`) REFERENCES `transactionsToGroups`(`id`) ON UPDATE no action ON DELETE cascade
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
CREATE TABLE `transactionReceipt` (
	`id` text PRIMARY KEY NOT NULL,
	`fk_group_transaction_state_id` text NOT NULL,
	`fk_transaction_id` text NOT NULL,
	FOREIGN KEY (`fk_group_transaction_state_id`) REFERENCES `transactionState`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`fk_transaction_id`) REFERENCES `transactions`(`id`) ON UPDATE no action ON DELETE no action
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
--> statement-breakpoint
/*
 SQLite does not support "Dropping foreign key" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html

 Due to that we don't generate migration automatically and it has to be done manually
*/--> statement-breakpoint
/*
 SQLite does not support "Creating foreign key on existing column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html

 Due to that we don't generate migration automatically and it has to be done manually
*/