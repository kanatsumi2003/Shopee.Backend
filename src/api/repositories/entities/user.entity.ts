import {BaseEntity, BaseEntitySchema} from "./base.entity";
import {Schema, model, Types} from 'mongoose'
import {CreateBaseSchema} from "./create.base.schema";
export interface IUser extends BaseEntity, Document {
    _id: Schema.Types.ObjectId;
    email: string;
    password?: string;
    emailOtp?: string;
    emailConfirmed?: boolean;
    phoneNumber?: string;
    dateOfBirth?: Date;
    name?: string;
    otpExpireAt: string;
    forgotPasswordToken?: string;
}

const UserSchema = CreateBaseSchema ({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: false,
    },
    emailOtp: {
        type: String,
        required: false,
    },
    emailConfirmed: {
        type: Boolean,
        required: false,
        default: false
    },
    phoneNumber: {
        type: String,
        required: false,
    },
    dateOfBirth: {
        type: Date,
        required: false,
    },
    name: {
        type: String,
        required: false,
    },
    otpExpireAt: {
        type: String,
        required: false,
    },
    forgotPasswordToken: {
        type: String,
        required: false,
    },
})

export const User = model<IUser>('User', UserSchema);