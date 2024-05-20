import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { groupTransactionToUsersToGroups } from './groupTransactionToUsersToGroups';
import { accounts } from './accounts';
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
  groupTransferReceiverStatusId: text('group_transfer_receiver_status_id')
    .references(() => groupTransferStatus.id)
    .notNull(),
  groupTransferSenderStatusId: text('group_transfer_sender_status_id')
    .references(() => groupTransferStatus.id)
    .notNull(),
  senderAccountId: text('sender_account_id')
    .references(() => accounts.id, { onDelete: 'cascade' })
    .notNull(),
  receiverAccountId: text('receiver_account_id')
    .references(() => accounts.id, { onDelete: 'cascade' })
    .notNull(),
  senderCompletedTimestamp: text('sender_completed_timestamp'),
  senderInitiatedTimestamp: text('sender_initiated_timestamp').notNull(),
  receiverCompletedTimestamp: text('receiver_completed_timestamp'),
  receiverInitiatedTimestamp: text('receiver_initiated_timestamp').notNull(),
});
