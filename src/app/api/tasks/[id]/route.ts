import { authOptions } from "@/app/lib/auth";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "../../db";
import { tasks } from "../../schema";

// REVIEW: you monster with that any
// REVIEW: PUT/PATCH are ambigious, I would make this a separate route specifying that this route is meant only to change the finished date
export async function PUT(request: NextRequest, context: any) {
	const session = await getServerSession(authOptions);
	if (!session) {
		return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
			status: 401,
		});
	}
	// REVIEW: I think userId is a better name than the session ID, as you can confuse the both
	const session_id = session.user.id;

	const body = await request.json();
	const task_id = context.params.id;
	const { finishedAt } = body as { finishedAt: string };

	try {
		await db
			.update(tasks)
			.set({ finishedAt })
			.where(and(eq(tasks.id, task_id), eq(tasks.userId, session_id)));
		return new NextResponse(
			JSON.stringify({ message: `Task Finished Successfully` }),
			{
				status: 200,
			}
		);
	} catch (error) {
		return new NextResponse(
			JSON.stringify({
				message: "Couldn't finish task in database.",
				error,
			}),
			{
				status: 409,
			}
		);
	}
}

// REVIEW: you monster with that any
export async function DELETE(request: NextRequest, context: any) {
	const session = await getServerSession(authOptions);
	if (!session) {
		return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
			status: 401,
		});
	}
	const session_id = session.user.id;
	const task_id = context.params.id;

	try {
		await db
			.delete(tasks)
			.where(and(eq(tasks.id, task_id), eq(tasks.userId, session_id)));
		return new NextResponse(
			JSON.stringify({ message: `Task Deleted Successfully` }),
			{
				status: 200,
			}
		);
	} catch (error) {
		return new NextResponse(
			JSON.stringify({
				message: "Couldn't delete task from database.",
				error,
			}),
			{
				status: 409,
			}
		);
	}
}
export async function GET(request: NextRequest, context: any) {
	const session = await getServerSession(authOptions);
	if (!session) {
		return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
			status: 401,
		});
	}
	const session_id = session.user.id;
	const task_id = context.params.id;

	try {
		const user_task = await db.query.tasks.findFirst({
			where: and(eq(tasks.id, task_id), eq(tasks.userId, session_id)),
		});
		if (!user_task) {
			return new NextResponse(
				JSON.stringify({ error: "Task Not Found" }),
				{
					status: 404,
				}
			);
		}
		return new NextResponse(JSON.stringify(user_task), {
			status: 200,
		});
	} catch (error) {
		return new NextResponse(
			JSON.stringify({
				message: "Couldn't get task from database.",
				error,
			}),
			{
				status: 409,
			}
		);
	}
}
export async function PATCH(request: NextRequest, context: any) {
	const session = await getServerSession(authOptions);
	if (!session) {
		return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
			status: 401,
		});
	}
	const session_id = session.user.id;
	const task_id = context.params.id;

	const body = await request.json();
	const { title, text, tags, endDate } = body as {
		title: string;
		text: string;
		tags: string;
		endDate: string;
	};
	try {
		const resp = await db
			.update(tasks)
			.set({
				title,
				text,
				tags,
				endDate,
			})
			.where(and(eq(tasks.id, task_id), eq(tasks.userId, session_id)));

		if (resp.rowsAffected) {
			return new NextResponse(
				JSON.stringify({ message: `Task Edited Successfully` }),
				{
					status: 200,
				}
			);
		} else {
			return new NextResponse(
				JSON.stringify({ message: `Task Not Updated` }),
				{
					status: 500,
				}
			);
		}
	} catch (error) {
		return new NextResponse(
			JSON.stringify({
				message: "Couldn't edit task in database.",
				error,
			}),
			{
				status: 409,
			}
		);
	}
}
