import {Schema, SchemaDefinition} from "mongoose";
import {BaseEntitySchema} from "./base.entity";

export function CreateBaseSchema(definition: SchemaDefinition): Schema {
    return new Schema(
        {
            ...definition,
            ...BaseEntitySchema,
        }
    );
}