import {DatetimeHelper} from "../../common/helpers/datetime.helper";
import {Document} from 'mongoose'
export abstract class BaseEntity {
    createdAt?: Date;

    updatedAt?: Date;

    deletedAt?: Date | null;
}

export const BaseEntitySchema = {
    createdAt: {
        type: Date,
        default: () => DatetimeHelper.nowUtcPlus7(),
    },
    updatedAt: {
        type: Date,
        default: () => DatetimeHelper.nowUtcPlus7(),
    },
    deletedAt: {
        type: Date,
        default: null
    }
}