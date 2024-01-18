import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "../db";
import { asc, eq, and } from "drizzle-orm";
import { tasks } from "../schema";

export async function GET(request: NextRequest) {
	const session = await getServerSession(authOptions);
	if (!session) {
		return new NextResponse(JSON.stringify({ error: "Unauthorizedd" }), {
			status: 401,
		});
	}

	const user_id = session.user.id;
	try {
		const user_tasks = await db
			.select()
			.from(tasks)
			.where(and(eq(tasks.user_id, user_id)))
			.orderBy(asc(tasks.end_date));
		return new NextResponse(JSON.stringify(user_tasks), { status: 200 });
	} catch (error) {
		return new NextResponse(
			JSON.stringify({
				message: "Couldn't get tasks from database.",
				error,
			}),
			{
				status: 409,
			}
		);
	}
}
export async function POST(request: NextRequest) {
	const session = await getServerSession(authOptions);
	if (!session) {
		return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
			status: 401,
		});
	}
	const body = await request.json();
	const session_id = session.user.id;
	const { user_id, title, text, tags, end_date } = body as {
		user_id: number;
		title: string;
		text: string;
		tags: string[];
		end_date: string;
	};
	console.log(session);

	try {
		const res = await fetch(`https://api.thecatapi.com/v1/images/search`, {
			method: "GET",
		});
		const img_data = await res.json();
		const img_url = img_data[0].url;
		await db.insert(tasks).values({
			user_id,
			title,
			text,
			img_url,
			tags: tags.toString(),
			end_date: new Date(end_date),
		});
		return new NextResponse(
			JSON.stringify({ message: `Task Created Successfully` }),
			{
				status: 200,
			}
		);
	} catch (error) {
		return new NextResponse(
			JSON.stringify({
				message: "Couldn't insert task in database.",
				error,
			}),
			{
				status: 409,
			}
		);
	}
}
