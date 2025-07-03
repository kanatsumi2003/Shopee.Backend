import {ClientSession, FilterQuery, Model, UpdateQuery} from "mongoose";
import {BaseEntity} from "../entities/base.entity";
import {IGenericRepository} from "../interfaces/generic.repository.interface";
import {DatetimeHelper} from "../../common/helpers/datetime.helper";
import {PaginationOption} from "../../common/models/paginations/pagination.option";
import {PaginationResponse} from "../../common/models/responses/pagination.response";

export abstract class GenericRepository<T extends BaseEntity>
    implements IGenericRepository<T> {
    constructor(protected readonly model: Model<T>) {
    }

    async create(doc: Partial<T>, session?: ClientSession): Promise<T[]> {
        if (!session) {
            throw new Error("No such session initiated");
        }
        const now = DatetimeHelper.nowUtcPlus7();
        return await this.model.create(
            [
                {
                    ...doc,
                    createdAt: now,
                    updatedAt: now,
                },
            ],
            {session},
        );
    }

    async update(
        id: string,
        update: UpdateQuery<T>,
        session?: ClientSession,
    ): Promise<void> {
        if (!session) {
            throw new Error("No such session initiated");
        }
        await this.model
            .findByIdAndUpdate(
                id,
                {
                    ...update,
                    $set: {
                        ...(update.$set || {}),
                        updatedAt: DatetimeHelper.nowUtcPlus7(),
                    },
                },
                {new: true, session},
            )
            .exec();
    }

    async delete(id: string, session?: ClientSession): Promise<void> {
        if (!session) {
            throw new Error("No such session initiated");
        }
        await this.model
            .findByIdAndUpdate(
                id,
                {
                    $set: {
                        deletedAt: DatetimeHelper.nowUtcPlus7(),
                    },
                },
                {new: true, session},
            )
            .exec();
    }

    async deletePermanent(id: string, session?: ClientSession): Promise<void> {
        {
            if (!session) {
                throw new Error("No such session initiated");
            }
            await this.model.findByIdAndDelete(id, {
                session,
            }).exec();
        }
    }

    async findAll(filter?: FilterQuery<T>): Promise<T[]> {
        return this.model.find(filter ?? {}).exec();
    }

    async findById(id: string): Promise<T | null> {
        return this.model.findById(id).exec();
    }

    async find(
        filter: FilterQuery<T>,
        pagination?: Partial<PaginationOption<T>>,
    ): Promise<PaginationResponse<T>> {
        const {page, pageSize, sort} = (
            PaginationOption as any
        ).applyDefaults.call(PaginationOption, pagination);

        const skip = (page - 1) * pageSize;

        const [data, totalRecords] = await Promise.all([
            this.model.find(filter).skip(skip).limit(pageSize).sort(sort).exec(),
            this.model.countDocuments(filter).exec(),
        ]);

        return new PaginationResponse<T>(data, totalRecords, page, pageSize);
    }

    async findOne(filter: FilterQuery<T>): Promise<T | null> {
        return this.model.findOne(filter).exec();
    }
}
