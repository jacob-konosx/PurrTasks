import { sendEmail } from "@/app/lib/mailer";
import { NextRequest, NextResponse } from "next/server";
import { db } from "../../db";
import { users } from "../../schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
	const body = await request.json();
	const { firstName, lastName, email, password } = body as {
		firstName: string;
		lastName: string;
		email: string;
		password: string;
	};

	try {
		// REVIEW: I would name this existingUser instead of oldUser for more clarity
		const oldUser = await db.query.users.findFirst({
			where: eq(users.email, email),
		});

		if (oldUser) {
			return new NextResponse(
				JSON.stringify({
					message: "User already exists!",
				}),
				{
					status: 409,
				}
			);
		}

		const hashedPassword = await bcrypt.hash(password, 12);

		await db.insert(users).values({
			first_name: firstName,
			last_name: lastName,
			email,
			password: hashedPassword,
		});

		const newUser = await db.query.users.findFirst({
			where: eq(users.email, email),
		});
		await sendEmail(email, "VERIFY", newUser!.id);

		return new NextResponse(
			JSON.stringify({ message: "User created successfully!" }),
			{ status: 200 }
		);
	} catch (error) {
		console.error(error);
		return new NextResponse(
			JSON.stringify({
				message: "Couldn't get create user",
				error,
			}),
			{
				status: 409,
			}
		);
	}
}
