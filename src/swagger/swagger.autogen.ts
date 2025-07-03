import dotenv from 'dotenv';
import swaggerAutogen from "swagger-autogen";
dotenv.config();

let host: string;
let schema: string;

// Setup swagger host and schema
if (process.env.NODE_ENV === 'development') {
    host = `localhost:${process.env.PORT || 3000}`;
    schema = process.env.SCHEMA || 'http';
} else {
    host = `${process.env.HOST}:${process.env.PORT}`;
    schema = process.env.SCHEMA || 'https';
}

const doc = {
    info: {
        title: 'Swagger Documentation',
        description: 'Api documentation',
    },
    host,
    schema: schema,
}

const outputFile = './swagger-output.json';
const endpointsFiles = ['../app.ts'];

swaggerAutogen()(outputFile, endpointsFiles, doc);