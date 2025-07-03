import {ClientSession, FilterQuery, UpdateQuery} from "mongoose";
import {BaseEntity} from "../entities/base.entity.js";
import {PaginationOption} from "../../common/models/paginations/pagination.option";
import {PaginationResponse} from "../../common/models/responses/pagination.response";

export interface IGenericRepository<T extends BaseEntity> {
    create(doc: Partial<T>, session?: ClientSession): Promise<T[]>;
    update(
        id: string,
        update: UpdateQuery<T>,
        session?: ClientSession,
    ): Promise<void>;
    delete(id: string, session?: ClientSession): Promise<void>;
    findAll(filter?: FilterQuery<T>): Promise<T[]>;
    findById(id: string): Promise<T | null>;
    find(
        filter: FilterQuery<T>,
        pagination?: Partial<PaginationOption<T>>,
    ): Promise<PaginationResponse<T>>;
    findOne(filter: FilterQuery<T>): Promise<T | null>;
    deletePermanent(id: string, session?: ClientSession): Promise<void>;
}
