import logger from "../logger/winston.logger.js";
import formData from "form-data";
import Mailgun from "mailgun.js";
const mailgun = new Mailgun(formData);

const mg = mailgun.client({
	username: "api",
	key: process.env.MAILGUN_API_KEY || "key-yourkeyhere",
});

const sendMail = async ({
	to,
	subject,
	text,
	html,
}: {
	to: string;
	subject: string;
	text: string;
	html: string;
}): Promise<boolean> => {
	try {
		const message = await mg.messages.create(
			"sandboxd110655d76404537a8338e49725dff13.mailgun.org",
			{
				from: "Excited User <mailgun@sandboxd110655d76404537a8338e49725dff13.mailgun.org>",
				to: [to],
				subject: subject,
				text: text,
				html: html,
			}
		);

		console.log("email service : ", message);

		return true;
	} catch (error) {
		console.log("mailgun error is : ", error);
		logger.warn("Mail: Failed to send mail to ", to);
		return false;
	}
};

export { sendMail };
