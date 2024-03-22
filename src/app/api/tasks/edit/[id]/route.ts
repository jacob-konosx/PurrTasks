import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/api/db";
import { tasks } from "@/app/api/schema";
import { and, eq } from "drizzle-orm";

export async function PUT(
	request: NextRequest,
	context: { params: { id: number } }
) {
	const session = await getServerSession(authOptions);
	// Middleware ensures that session is not null and that the user is authenticated
	const userId = session!.user.id;
	const taskId = context.params.id;

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
			.where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)));

		if (resp.rowsAffected) {
			return NextResponse.json(
				{ message: `Task Edited Successfully` },
				{
					status: 200,
				}
			);
		} else {
			return NextResponse.json(
				{ message: `Task Not Edited Successfully` },
				{
					status: 500,
				}
			);
		}
	} catch (error) {
		return NextResponse.json(
			{
				message: "Couldn't edit task in database.",
				error,
			},
			{
				status: 409,
			}
		);
	}
}
