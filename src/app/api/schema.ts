import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
	id: integer("id").primaryKey().notNull(),
	firstName: text("firstName").notNull(),
	lastName: text("lastName").notNull(),
	email: text("email").notNull(),
	password: text("password").notNull(),
	createdAt: text("createdAt")
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	forgotPasswordToken: text("forgotPasswordToken"),
	verifyToken: text("verifyToken"),
	verifyTokenExpiry: text("verifyTokenExpiry"),
	forgotPasswordTokenExpiry: text("forgotPasswordTokenExpiry"),
	isVerified: integer("isVerified", { mode: "boolean" })
		.default(sql`FALSE`)
		.notNull(),
});

export const tasks = sqliteTable("tasks", {
	id: integer("id").primaryKey().notNull(),
	userId: integer("userId").notNull(),
	text: text("text").notNull(),
	tags: text("tags").notNull(),
	title: text("title").notNull(),
	imgUrl: text("imgUrl").notNull(),
	createdAt: text("createdAt")
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	endDate: text("endDate").notNull(),
	finishedAt: text("finishedAt"),
});

export type User = typeof users.$inferSelect; // return type when queried
export type NewUser = typeof users.$inferInsert; // insert type
export type Task = typeof tasks.$inferSelect; // return type when queried
export type NewTask = typeof tasks.$inferInsert; // insert type
