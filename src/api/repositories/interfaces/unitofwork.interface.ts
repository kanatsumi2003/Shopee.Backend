import {IBaseUnitOfWork} from "./unitofwork.base.interface";
import {IUserRepository} from "./user.repository.interface";
import {IUserTokenRepository} from "./user.token.repository.interface";

export interface IUnitOfWork extends IBaseUnitOfWork {
    getUserRepository(): IUserRepository;
    getUserTokenRepository(): IUserTokenRepository;
}
