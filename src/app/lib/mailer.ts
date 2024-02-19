import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

const setVerificationToken = async (
	verify_token: string,
	user_id: Number
): Promise<any> => {
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
				verify_token_expiry: new Date(Date.now() + 3600000),
			}),
		}
	);
	if (!res.ok) {
		throw new Error("Failed to set verification token");
	}
	return res.json();
};

export const sendEmail = async (
	email: String,
	email_type: String,
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
