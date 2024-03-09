import { NextRequest, NextResponse } from "next/server";
import { db } from "../../db";
import { users } from "../../schema";
import { and, eq, gt } from "drizzle-orm";

export async function POST(request: NextRequest, context: any) {

	const body = await request.json();

	const { token } = body as {
		token: string;
	};

	try {
		const user = await db.query.users.findFirst({
			where: and(
				eq(users.verify_token, token),
				// gt(users.verify_token_expiry, new Date())
			),
		});

		const isValidToken =
			user &&
			user.verify_token_expiry &&
			new Date(user.verify_token_expiry) > new Date(Date.now());
		if (!isValidToken) {
			return new NextResponse(
				JSON.stringify({ message: `Token Expired or Invalid` }),
				{
					status: 401,
				}
			);
		}
        if (user.is_verified) {
            return new NextResponse(
                JSON.stringify({ message: `User Already Verified` }),
                {
                    status: 401,
                }
            );
        }
        await db
			.update(users)
			.set({
				is_verified: true,
				verify_token: null,
				verify_token_expiry: null,
			})
			.where(
					eq(users.verify_token, token),
			);
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
