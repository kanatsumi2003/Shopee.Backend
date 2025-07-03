import {Connection} from "mongoose";
import {BaseUnitOfWork} from "./unitofwork.base";
import {IUnitOfWork} from "../interfaces/unitofwork.interface";
import {inject, injectable} from 'tsyringe'
import {IUserRepository} from "../interfaces/user.repository.interface";
import {IUserTokenRepository} from "../interfaces/user.token.repository.interface";
import {REPOSITORY_TOKENS} from "../constants/repository.token.constant";

@injectable()
export class UnitOfWork extends BaseUnitOfWork implements IUnitOfWork {
    constructor(
        @inject(REPOSITORY_TOKENS.MONGOOSE_CONNECTION) connection: Connection,
        @inject(REPOSITORY_TOKENS.IUserRepository)
        private readonly iUserRepository: IUserRepository,
        @inject(REPOSITORY_TOKENS.IUserTokenRepository)
        private readonly iUserTokenRepository: IUserTokenRepository,
    ) {
        super(connection);
    }

    getUserRepository(): IUserRepository {
        return this.iUserRepository;
    }

    getUserTokenRepository(): IUserTokenRepository {
        return this.iUserTokenRepository;
    }
}
