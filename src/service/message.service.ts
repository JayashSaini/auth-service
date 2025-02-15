import { config } from "../config/index.js";
import { kafkaProducer } from "../config/kafka.config.js";
import logger from "../logger/winston.logger.js";
import { Email } from "../types/index.js";

const sendMail = (email: Email) => {
	try {
		kafkaProducer.sendMessage(config.kafka.topics.email, email);
		return true;
	} catch (error) {
		console.log("mailgun error is : ", error);
		logger.warn("Mail: Failed to send mail to ", email.to); // Log the warning in case of failure.
		return false;
	}
};

export { sendMail };
