import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../db";
import { users } from "../../../schema";
import { eq } from "drizzle-orm";

export async function PUT(request: NextRequest, context: any) {

	const user_id = context.params.id;

	const body = await request.json();
	const { verify_token, verify_token_expiry } = body as {
		verify_token: string;
		verify_token_expiry: string;
	};
	try {
		await db
			.update(users)
			.set({
				verify_token,
				verify_token_expiry,
			})
			.where(eq(users.id, user_id));

		return new NextResponse(
			JSON.stringify({ message: `User Updated Successfully` }),
			{
				status: 200,
			}
		);
	} catch (error) {
		return new NextResponse(
			JSON.stringify({
				message: "Couldn't update user in database.",
				error,
			}),
			{
				status: 409,
			}
		);
	}
}
