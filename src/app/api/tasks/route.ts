import { authOptions } from "@/app/lib/auth";
import { and, asc, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/api/db";
import { tasks } from "@/app/api/schema";

export async function GET() {
	const session = await getServerSession(authOptions);
	// Middleware ensures that session is not null and that the user is authenticated
	const userId = session!.user.id;

	try {
		// REVIEW: you can make DB calls in the API route, but I would highly suggest to move them to a function and have a separate /data folder to keep all your calls in one place
		// https://nextjs.org/blog/security-nextjs-server-components-actions#data-access-layer
		const userTasks = await db
			.select()
			.from(tasks)
			.where(and(eq(tasks.userId, userId)))
			.orderBy(asc(tasks.endDate));

		return NextResponse.json({ userTasks }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{
				message: "Couldn't get tasks from database.",
				error,
			},
			{
				status: 409,
			}
		);
	}
}
export async function POST(request: NextRequest) {
	const body = await request.json();
	const { userId, title, text, tags, endDate } = body as {
		userId: number;
		title: string;
		text: string;
		tags: string[];
		endDate: string;
	};

	try {
		const res = await fetch(`https://api.thecatapi.com/v1/images/search`, {
			method: "GET",
		});
		const img_data = await res.json();
		const imgUrl = img_data[0].url;

		await db.insert(tasks).values({
			userId,
			title,
			text,
			imgUrl,
			tags: tags.toString(),
			endDate,
		});

		return NextResponse.json(
			{ message: `Task Created Successfully` },
			{
				status: 200,
			}
		);
	} catch (error) {
		return NextResponse.json(
			{
				message: "Couldn't insert task in database.",
				error,
			},
			{
				status: 409,
			}
		);
	}
}
