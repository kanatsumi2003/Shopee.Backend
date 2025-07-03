import {inject, injectable} from "tsyringe";
import {GenericRepository} from "../common/generic.repository";
import {Model} from "mongoose";
import {IUserToken} from "../entities/user.token.entity";
import {IUserTokenRepository} from "../interfaces/user.token.repository.interface";
import {MODEL_TOKENS} from "../constants/repository.token.constant";
@injectable()
export class UserTokenRepository extends GenericRepository<IUserToken> implements IUserTokenRepository {
    constructor(@inject(MODEL_TOKENS.UserToken) private readonly userTokenModel: Model<IUserToken>) {
        super(userTokenModel);
    }
}