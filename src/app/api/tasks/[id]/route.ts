import { authOptions } from "@/app/lib/auth";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "../../db";
import { tasks } from "../../schema";

export async function PUT(request: NextRequest, context: any) {
	const session = await getServerSession(authOptions);
	if (!session) {
		return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
			status: 401,
		});
	}
	const session_id = session.user.id;

	const body = await request.json();
	const task_id = context.params.id;
	const { finished_at } = body as { finished_at: string };

	try {
		await db
			.update(tasks)
			.set({ finished_at: new Date(finished_at) })
			.where(and(eq(tasks.id, task_id), eq(tasks.user_id, session_id)));
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
			.where(and(eq(tasks.id, task_id), eq(tasks.user_id, session_id)));
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
			where: and(eq(tasks.id, task_id), eq(tasks.user_id, session_id)),
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
	const { user_id, title, text, tags, end_date } = body as {
		user_id: number;
		title: string;
		text: string;
		tags: string[];
		end_date: string;
	};
	try {
		await db
			.update(tasks)
			.set({
				user_id,
				title,
				text,
				tags: tags.toString(),
				end_date: new Date(end_date),
			})
			.where(and(eq(tasks.id, task_id), eq(tasks.user_id, session_id)));
		return new NextResponse(
			JSON.stringify({ message: `Task Edited Successfully` }),
			{
				status: 200,
			}
		);
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
