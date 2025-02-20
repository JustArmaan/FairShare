import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { notificationType } from "./notificationType";
import { sql } from "drizzle-orm";
import { users } from "./users";

export const notifications = sqliteTable("notifications", {
  id: text("id").primaryKey(),
  notificationTypeId: text("notification_type_id")
    .references(() => notificationType.id)
    .notNull(),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  notificationSenderId: text("notification_sender_id")
    .references(() => users.id)
    .notNull(),
  timestamp: text("timestamp")
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`)
    .notNull(),
  readStatus: integer("read_status", { mode: "boolean" }).default(sql`0`),
});
