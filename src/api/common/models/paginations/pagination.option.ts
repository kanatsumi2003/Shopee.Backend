import {BaseEntity} from "../../../repositories/entities/base.entity";

export abstract class PaginationOption<T extends BaseEntity> {
    page?: number = 1;
    pageSize?: number = 10;
    sort: Partial<Record<keyof T, 1 | -1>> = { createdAt: -1 } as Partial<
        Record<keyof T, 1 | -1>
    >;

    static applyDefaults<T extends BaseEntity>(
        options: Partial<PaginationOption<T>>,
    ): PaginationOption<T> {
        const defaults = new (this as any)() as PaginationOption<T>;
        return Object.assign(defaults, options);
    }
}
