import { sendEmail } from "@/app/lib/mailer";
import { NextRequest, NextResponse } from "next/server";
import { db } from "../../db";
import { User, users } from "../../schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

const ONE_DAY = 86400000;

export async function POST(request: NextRequest) {
	const body = await request.json();
	const { firstName, lastName, email, password } = body as {
		firstName: string;
		lastName: string;
		email: string;
		password: string;
	};

	try {
		const existingUser = await db.query.users.findFirst({
			where: eq(users.email, email),
		});

		if (existingUser) {
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

		const returningUser = await db
			.insert(users)
			.values({
				firstName: firstName,
				lastName: lastName,
				email,
				password: hashedPassword,
			})
			.returning();
		const newUser: User = returningUser[0];

		if (!newUser) {
			return new NextResponse(
				JSON.stringify({
					message: "Created user but couldn't return user!",
				}),
				{
					status: 409,
				}
			);
		}

		const verifyToken = await bcrypt.hash(newUser.id.toString(), 10);

		await db
			.update(users)
			.set({
				verifyToken,
				verifyTokenExpiry: dayjs.utc(new Date(Date.now() + ONE_DAY)).format(
					"YYYY-MM-DD HH:mm:ss"
				),
			})
			.where(eq(users.id, newUser.id));
		await sendEmail(newUser.email, "VERIFY", verifyToken);

		return new NextResponse(
			JSON.stringify({ message: "User created successfully!" }),
			{ status: 200 }
		);
	} catch (error) {
		console.error(error);
		return new NextResponse(
			JSON.stringify({
				message: "Couldn't create user",
				error,
			}),
			{
				status: 409,
			}
		);
	}
}
