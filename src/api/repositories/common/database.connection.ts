import * as mongoose from "mongoose";
import dotenv from 'dotenv'
import {Connection} from "mongoose";
import {injectable} from "tsyringe";
dotenv.config();

export async function connect(): Promise<Connection> {
    const uri = process.env.MONGO_URI;

    try {
        // Connect mongodb
        const mongoConnection = await mongoose.connect(process.env.MONGO_URI || '');

        return mongoConnection.connection;
    } catch (err) {
        console.log('Error connecting to MongoDB server: ' + err);
        throw err;
    }
}