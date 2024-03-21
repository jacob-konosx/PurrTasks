import { authOptions } from "@/app/lib/auth";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/api/db";
import { tasks } from "@/app/api/schema";

export async function DELETE(context: { params: { id: number } }) {
	const session = await getServerSession(authOptions);
	// Middleware ensures that session is not null and that the user is authenticated
	const userId = session!.user.id;
	const taskId = context.params.id;

	try {
		await db
			.delete(tasks)
			.where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)));

		return NextResponse.json(
			{ message: `Task Deleted Successfully` },
			{
				status: 200,
			}
		);
	} catch (error) {
		return NextResponse.json(
			{
				message: "Couldn't delete task from database.",
				error,
			},
			{
				status: 409,
			}
		);
	}
}

export async function GET(context: { params: { id: number } }) {
	const session = await getServerSession(authOptions);
	// Middleware ensures that session is not null and that the user is authenticated
	const userId = session!.user.id;
	const taskId = context.params.id;

	try {
		const userTask = await db.query.tasks.findFirst({
			where: and(eq(tasks.id, taskId), eq(tasks.userId, userId)),
		});

		if (!userTask) {
			return NextResponse.json(
				{ message: "Task Not Found" },
				{
					status: 404,
				}
			);
		}

		return NextResponse.json(
			{ userTask },
			{
				status: 200,
			}
		);
	} catch (error) {
		return NextResponse.json(
			{
				message: "Couldn't get task from database.",
				error,
			},
			{
				status: 409,
			}
		);
	}
}
