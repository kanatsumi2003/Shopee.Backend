import {inject, injectable} from "tsyringe";
import {CONSUMER_TOKENS} from "../../constants/service.token.constant";
import {IQueueConsumer} from "./queue.consumer.interface";

@injectable()
export class ConsumerRunner {
    constructor(
        @inject(CONSUMER_TOKENS.AllConsumers)
        private readonly consumers: IQueueConsumer[],
    ) {}

    async startAll(): Promise<void> {
        for (const consumer of this.consumers) {
            await consumer.start();
        }
    }
}