export interface IRabbitmqClient {
    connect(): Promise<void>;
    publish<TEvent>(queue: string, data: TEvent): Promise<void>;
    consume<TEvent>(queue: string, handler: (data: TEvent) => Promise<void>): Promise<void>;
}