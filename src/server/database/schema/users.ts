// docs: https://orm.drizzle.team/docs/sql-schema-declaration
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { serial } from "drizzle-orm/mysql-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  picture: text("picture"),
  createdAt: text("created_at").default(sql`(current_timestamp)`),
});
