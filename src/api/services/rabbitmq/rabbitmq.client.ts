import amqplib, {Channel, ChannelModel} from 'amqplib';
import {IRabbitmqClient} from "./rabbitmq.client.interface";
export class RabbitmqClient implements IRabbitmqClient {
    private connection!: ChannelModel;
    private channel!: Channel;

    public async connect(): Promise<void> {
        this.connection = await amqplib.connect(process.env.RABBITMQ_URL || '');
        this.channel = await this.connection.createChannel();
    }
    public async assertQueue(queue: string): Promise<void> {
        await this.channel.assertQueue(queue, { durable: true });
    }

    public async publish<TEvent>(queue: string, data: TEvent): Promise<void> {
        await this.assertQueue(queue);
        this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), { persistent: true });
    }

    public async consume<TEvent>(queue: string, handler: (data: TEvent) => Promise<void>): Promise<void> {
        await this.assertQueue(queue);
        await this.channel.consume(queue, async (msg) => {
            if (!msg) return;
            const payload = JSON.parse(msg.content.toString());
            try {
                await handler(payload);
                this.channel.ack(msg);
            } catch (error) {
                console.error(`Error in consumer for ${queue}`, error);
            }
        });
    }
}