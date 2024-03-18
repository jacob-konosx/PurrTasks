import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/api/db";
import { users } from "@/app/api/schema";
import { and, eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
	const body = await request.json();
	const { token } = body as {
		token: string;
	};

	try {
		const user = await db.query.users.findFirst({
			where: and(eq(users.verifyToken, token)),
		});

		if (!user) {
			return new NextResponse(
				JSON.stringify({ message: `User With This Token Not Found` }),
				{
					status: 404,
				}
			);
		}

		if (user.isVerified) {
			return new NextResponse(
				JSON.stringify({ message: `User Already Verified` }),
				{
					status: 401,
				}
			);
		}

		const isValidToken =
			new Date(user.verifyTokenExpiry!) > new Date(Date.now());

		if (!isValidToken) {
			return new NextResponse(
				JSON.stringify({ message: `Token Expired or Invalid` }),
				{
					status: 401,
				}
			);
		}

		await db
			.update(users)
			.set({
				isVerified: true,
				verifyToken: null,
				verifyTokenExpiry: null,
			})
			.where(eq(users.verifyToken, token));

		return new NextResponse(
			JSON.stringify({ message: `User Verified Successfully` }),
			{
				status: 200,
			}
		);
	} catch (error) {
		return new NextResponse(
			JSON.stringify({
				message: "Couldn't verify user in database. ",
				error,
			}),
			{
				status: 409,
			}
		);
	}
}
