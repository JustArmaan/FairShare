import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { groupTransactionToUsersToGroups } from './groupTransactionToUsersToGroups';
import { accounts } from './accounts';
import { sql } from 'drizzle-orm';
import { groupTransferStatus } from './groupTransferStatus';

export const groupTransfer = sqliteTable('groupTransfer', {
  id: text('id').primaryKey(),
  groupTransactionToUsersToGroupsId: text(
    'group_transaction_to_users_to_groups_id'
  )
    .references(() => groupTransactionToUsersToGroups.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  senderAccountId: text('sender_account_id')
    .references(() => accounts.id, { onDelete: 'cascade' })
    .notNull(),
  receiverAccountId: text('receiver_account_id')
    .references(() => accounts.id, { onDelete: 'cascade' })
    .notNull(),
  completedTimestamp: text('completed_timestamp'),
  initiatedTimestamp: text('completed_timestamp').notNull(),
  groupTransferStatusId: text('group_transfer_status_id')
    .references(() => groupTransferStatus.id)
    .notNull(),
});
