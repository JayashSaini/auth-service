// Importing necessary modules and setting up the Mailgun client.
import logger from "../logger/winston.logger.js"; // Custom logger for logging warnings or errors.
import formData from "form-data"; // For handling form data required by Mailgun.
import Mailgun from "mailgun.js"; // Mailgun SDK to send emails via Mailgun API.
import { config } from "../config/index.js";

// Initialize Mailgun client using formData.
const mailgun = new Mailgun(formData);

// Initialize the Mailgun client with API credentials (API key and username).
const mg = mailgun.client({
	username: "api", // Default username for Mailgun API.
	key: config.mailgun.apiKey || "key-yourKeyHere", // Retrieve the API key from environment variables, with a fallback default.
});

/**
 * Sends an email using the Mailgun service.
 *
 * @param {Object} params - The email parameters.
 * @param {string} params.to - Recipient email address.
 * @param {string} params.subject - Subject of the email.
 * @param {string} params.text - Plain text content of the email.
 * @param {string} params.html - HTML content of the email.
 *
 * @returns {Promise<boolean>} - Returns true if the email was sent successfully, false otherwise.
 */
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
		// Create and send the email via Mailgun API.
		const message = await mg.messages.create(
			"sandboxd110655d76404537a8338e49725dff13.mailgun.org", // Mailgun sandbox domain for testing (replace with your actual domain).
			{
				from: "Excited User <mailgun@sandboxd110655d76404537a8338e49725dff13.mailgun.org>", // Sender email address.
				to: [to], // Recipient email address.
				subject: subject, // Subject of the email.
				text: text, // Plain text version of the email content.
				html: html, // HTML version of the email content.
			}
		);

		// Log success message with the response from Mailgun.
		console.log("email service : ", message);

		// Return true to indicate successful email sending.
		return true;
	} catch (error) {
		// Log any errors and send a warning via logger.
		console.log("mailgun error is : ", error);
		logger.warn("Mail: Failed to send mail to ", to); // Log the warning in case of failure.

		// Return false to indicate failure in sending email.
		return false;
	}
};

// Export the sendMail function to be used in other parts of the application.
export { sendMail };
