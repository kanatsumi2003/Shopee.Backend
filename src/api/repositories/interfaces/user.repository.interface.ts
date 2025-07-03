import {IGenericRepository} from "./generic.repository.interface";
import {IUser} from "../entities/user.entity";
export interface IUserRepository extends IGenericRepository<IUser> {

}