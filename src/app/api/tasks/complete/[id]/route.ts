import { authOptions } from "@/app/lib/auth";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/api/db";
import { tasks } from "@/app/api/schema";

export async function PATCH(
	request: NextRequest,
	context: { params: { id: number } }
) {
	const session = await getServerSession(authOptions);
	// Middleware ensures that session is not null and that the user is authenticated
	const userId = session!.user.id;
	const taskId = context.params.id;

	const body = await request.json();
	const { finishedAt } = body as { finishedAt: string };

	try {
		await db
			.update(tasks)
			.set({ finishedAt })
			.where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)));

		return NextResponse.json(
			{ message: `Task Finished Successfully` },
			{
				status: 200,
			}
		);
	} catch (error) {
		return NextResponse.json(
			{
				message: "Task Not Finished Successfully",
				error,
			},
			{
				status: 409,
			}
		);
	}
}
