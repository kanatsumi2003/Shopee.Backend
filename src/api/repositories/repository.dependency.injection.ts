import {IUnitOfWork} from "./interfaces/unitofwork.interface";
import {IBaseUnitOfWork} from "./interfaces/unitofwork.base.interface";
import {IUser, User} from "./entities/user.entity";
import {IUserToken, UserToken} from "./entities/user.token.entity";
import {container} from "tsyringe";
import {Connection, Model} from "mongoose";
import {IUserRepository} from "./interfaces/user.repository.interface";
import {UserRepository} from "./repositories/user.repository";
import {IUserTokenRepository} from "./interfaces/user.token.repository.interface";
import {UnitOfWork} from "./common/unitofwork";
import {connect} from "./common/database.connection";
import {UserTokenRepository} from "./repositories/user.token.repository";
import {BaseUnitOfWork} from "./common/unitofwork.base";
import {MODEL_TOKENS, REPOSITORY_TOKENS} from "./constants/repository.token.constant";

export async function registerRepositoryDependencies() {
    const connection = await connect();

    container.register<Connection>(REPOSITORY_TOKENS.MONGOOSE_CONNECTION, { useValue: connection });

    container.register<Model<IUser>>(MODEL_TOKENS.User, { useValue: User });
    container.register<Model<IUserToken>>(MODEL_TOKENS.UserToken, { useValue: UserToken })

    container.register<IUserRepository>(REPOSITORY_TOKENS.IUserRepository, { useClass: UserRepository });
    container.register<IUserTokenRepository>(REPOSITORY_TOKENS.IUserTokenRepository, { useClass: UserTokenRepository });
    container.register<IUnitOfWork>(REPOSITORY_TOKENS.IUnitOfWork, { useClass: UnitOfWork});
    container.register<IBaseUnitOfWork>(REPOSITORY_TOKENS.IBaseUnitOfWork, { useClass: BaseUnitOfWork });
}
