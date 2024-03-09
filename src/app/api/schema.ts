import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

// declaring enum in database
export const users = sqliteTable("users", {
	id: integer("id").primaryKey().notNull(),
	first_name: text("first_name").notNull(),
	last_name: text("last_name").notNull(),
	email: text("email").notNull(),
	password: text("password").notNull(),
	created_at: text("created_at")
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	forgot_password_token: text("forgot_password_token"),
	verify_token: text("verify_token"),
	verify_token_expiry: text("verify_token_expiry"),
	forgot_password_token_expiry: text("forgot_password_token_expiry"),
	is_verified: integer("is_verified", { mode: "boolean" })
		.default(sql`FALSE`)
		.notNull(),
});
export const tasks = sqliteTable("tasks", {
	id: integer("id").primaryKey().notNull(),
	user_id: integer("user_id").notNull(),
	text: text("text").notNull(),
	tags: text("tags").notNull(),
	title: text("title").notNull(),
	img_url: text("img_url").notNull(),
	created_at: text("created_at")
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	end_date: text("end_date").notNull(),
	finished_at: text("finished_at"),
});
export type User = typeof users.$inferSelect; // return type when queried
export type NewUser = typeof users.$inferInsert; // insert type
export type Task = typeof tasks.$inferSelect; // return type when queried
export type NewTask = typeof tasks.$inferInsert; // insert type
