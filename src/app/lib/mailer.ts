import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

const setVerificationToken = async (
	verify_token: string, // REVIEW: inconsistent naming use, you should not use snake case for variable names in JS/TS (or if you do, use them everywhere, instead of mixing)
	user_id: Number
): Promise<any> => {
	// REVIEW: you do not need the URL add here because it will automatically route to the correct path on the server if there is no site prefix
	const res = await fetch(
		`${
			process.env.ENV === "DEV"
				? process.env.DEV_URL
				: process.env.PROD_URL
		}/api/users/verify/${user_id}`,
		{
			method: "PUT",
			body: JSON.stringify({
				verify_token,
				verify_token_expiry: new Date(Date.now() + 3600000), // REVIEW: It is not clear what this number is. Make it a constant so someone can easily know at a glance, like ONE_DAY (I am guessing)
			}),
		}
	);
	if (!res.ok) {
		throw new Error("Failed to set verification token");
	}
	return res.json(); // REVIEW: Jēkabs does not know what he is returning and neither do I
};

export const sendEmail = async (
	email: String,
	email_type: String, // REVIEW: email type should be a string enum, like - emailType: "VERIFY" | "OTHERTYPE"
	user_id: Number
) => {
	try {
		const hashed_token = await bcrypt.hash(user_id.toString(), 10);
		await setVerificationToken(hashed_token, user_id);

		const transport = nodemailer.createTransport({
			host: "live.smtp.mailtrap.io",
			port: 587,
			auth: {
				user: process.env.MAILER_USER,
				pass: process.env.MAILER_PASS,
			},
		});

		const mailOptions = {
			from: "todo@konosx.dev",
			to: email,
			subject: "Verify your email",
			html: `<h1>Click the link below to verify your email</h1><a href="${
				process.env.ENV === "DEV"
					? process.env.DEV_URL
					: process.env.PROD_URL
			}/verify?token=${hashed_token}">Verify</a> <p>Or copy and paste the link below in your browser</p> <p>${
				process.env.ENV === "DEV"
					? process.env.DEV_URL
					: process.env.PROD_URL
			}/verify?token=${hashed_token}</p>`,
		} as nodemailer.SendMailOptions;
		const mailResponse = await transport.sendMail(mailOptions);
		return mailResponse;
	} catch (error: any) {
		throw new Error(error.message);
	}
};
