import {ClientSession, Connection} from "mongoose";
import {IBaseUnitOfWork} from "../interfaces/unitofwork.base.interface";
import {inject, injectable} from "tsyringe";
import {REPOSITORY_TOKENS} from "../constants/repository.token.constant";

@injectable()
export class BaseUnitOfWork implements IBaseUnitOfWork {
    private session!: ClientSession;
    constructor(@inject(REPOSITORY_TOKENS.MONGOOSE_CONNECTION) private readonly connection: Connection) {}

    async start(): Promise<void> {
        this.session = await this.connection.startSession();
        this.session.startTransaction();
    }

    getSession(): ClientSession {
        return this.session;
    }

    async commit(): Promise<void> {
        await this.session.commitTransaction();
    }

    async abort(): Promise<void> {
        await this.session.abortTransaction();
    }

    async end(): Promise<void> {
        await this.session.endSession();
    }
}
