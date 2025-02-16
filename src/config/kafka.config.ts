import { Kafka, Partitioners, Producer } from "kafkajs";
import { config } from "./index.js";
import logger from "../logger/winston.logger.js";
import { Email } from "../types/index.js";

class KafkaProducer {
	private producer: Producer;
	private static instance: KafkaProducer;

	private constructor() {
		const kafka = new Kafka({
			clientId: config.kafka.clientId,
			brokers: config.kafka.brokers,
		});
		this.producer = kafka.producer({
			createPartitioner: Partitioners.DefaultPartitioner,
		});
	}

	public static getInstance(): KafkaProducer {
		if (!KafkaProducer.instance) {
			KafkaProducer.instance = new KafkaProducer();
		}
		return KafkaProducer.instance;
	}

	async connect(): Promise<void> {
		try {
			await this.producer.connect();
			logger.info("✅ Successfully connected to the Kafka producer");
		} catch (error) {
			logger.error("Failed to connect to Kafka producer:", error);
			throw error;
		}
	}

	async sendMessage(topic: string, message: Email): Promise<void> {
		try {
			await this.producer.send({
				topic,
				messages: [{ value: JSON.stringify(message) }],
			});
		} catch (error) {
			logger.error("Failed to send message to Kafka:", error);
			throw error;
		}
	}

	async disconnect(): Promise<void> {
		await this.producer.disconnect();
	}
}

export const kafkaProducer = KafkaProducer.getInstance();
