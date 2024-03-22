import nodemailer from "nodemailer";

export const sendEmail = async (
	email: String,
	emailType: "VERIFY" | "RESET_PASS",
	hashedToken: string
) => {
	try {
		const transport = nodemailer.createTransport({
			host: "live.smtp.mailtrap.io",
			port: 587,
			auth: {
				user: process.env.MAILER_USER,
				pass: process.env.MAILER_PASS,
			},
		});

		let mailOptions = {} as nodemailer.SendMailOptions;

		if (emailType === "VERIFY") {
			mailOptions = {
				from: "todo@konosx.dev",
				to: email,
				subject: "Verify your email",
				html: `<h1>Click the link below to verify your email</h1><a href="${process.env.BASE_URL}/verify?token=${hashedToken}">Verify</a> <p>Or copy and paste the link below in your browser</p> <p>${process.env.BASE_URL}/verify?token=${hashedToken}</p>`,
			} as nodemailer.SendMailOptions;
		}

		const mailResponse = await transport.sendMail(mailOptions);
		return mailResponse;
	} catch (error: any) {
		throw new Error(error.message);
	}
};
