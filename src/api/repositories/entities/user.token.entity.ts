import {BaseEntity, BaseEntitySchema} from "./base.entity";
import {model, Schema, Types} from "mongoose";
import * as mongoose from "mongoose";

export interface IUserToken extends BaseEntity {
    _id: Schema.Types.ObjectId;
    provider: string;
    token: string;
    ipAddressHash: string;
    userAgentHash: string;
    expireAt: string;
    userId: Schema.Types.ObjectId;
}

const UserTokenSchema = new Schema<IUserToken> ({
    provider: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    ipAddressHash: {
        type: String,
        required: false,
    },
    userAgentHash: {
        type: String,
        required: false,
    },
    expireAt: {
        type: String,
        required: false
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    ...BaseEntitySchema
})

export const UserToken = model<IUserToken> ('UserToken', UserTokenSchema)