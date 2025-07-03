import {ClientSession} from "mongoose";

export interface IBaseUnitOfWork {
    start(): Promise<void>;
    getSession(): ClientSession;
    commit(): Promise<void>;
    abort(): Promise<void>;
    end(): Promise<void>;
}
