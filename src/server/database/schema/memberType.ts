import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const memberType = sqliteTable("memberType", {
  id: text("id").primaryKey(),
  type: text("type").notNull(),
});
