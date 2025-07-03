import {IGenericRepository} from "./generic.repository.interface";
import {IUserToken} from "../entities/user.token.entity";

export interface IUserTokenRepository extends IGenericRepository<IUserToken> {

}