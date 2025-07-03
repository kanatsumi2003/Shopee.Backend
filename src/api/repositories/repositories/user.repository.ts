    import {GenericRepository} from "../common/generic.repository";
    import {inject, injectable} from "tsyringe";
    import {Model} from "mongoose";
    import {IUser} from "../entities/user.entity";
    import {IUserRepository} from "../interfaces/user.repository.interface";
    import {MODEL_TOKENS} from "../constants/repository.token.constant";
    @injectable()
    export class UserRepository extends GenericRepository<IUser> implements IUserRepository {
        constructor(@inject(MODEL_TOKENS.User) private readonly userModel: Model<IUser>) {
            super(userModel);
        }

    }