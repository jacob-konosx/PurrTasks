import { sql } from "drizzle-orm";
import {
	boolean,
	datetime,
	int,
	mysqlTable,
	varchar,
} from "drizzle-orm/mysql-core";
// declaring enum in database
export const users = mysqlTable("users", {
	id: int("id").autoincrement().primaryKey().notNull(),
	first_name: varchar("first_name", { length: 256 }).notNull(),
	last_name: varchar("last_name", { length: 256 }).notNull(),
	email: varchar("email", { length: 256 }).notNull(),
	password: varchar("password", { length: 256 }).notNull(),
	created_at: datetime("created_at")
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	forgot_password_token: varchar("forgot_password_token", { length: 256 }),
	verify_token: varchar("verify_token", { length: 256 }),
	verify_token_expiry: datetime("verify_token_expiry"),
	forgot_password_token_expiry: datetime("forgot_password_token_expiry"),
	is_verified: boolean("is_verified"),
});
export const tasks = mysqlTable("tasks", {
	id: int("id").autoincrement().primaryKey().notNull(),
	user_id: int("user_id").notNull(),
	text: varchar("text", { length: 256 }).notNull(),
	tags: varchar("tags", { length: 256 }).notNull(),
	title: varchar("title", { length: 256 }).notNull(),
	img_url: varchar("img_url", { length: 256 }).notNull(),
	created_at: datetime("created_at")
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	end_date: datetime("end_date").notNull(),
	finished_at: datetime("finished_at"),
});
export type User = typeof users.$inferSelect; // return type when queried
export type NewUser = typeof users.$inferInsert; // insert type
export type Task = typeof tasks.$inferSelect; // return type when queried
export type NewTask = typeof tasks.$inferInsert; // insert type
