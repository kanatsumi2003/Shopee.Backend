export class CoreException extends Error {
    statusCode: number;
    errorMessage: string;
    constructor(statusCode: number, errorMessage: string) {
        super(errorMessage);
        this.errorMessage = errorMessage;
        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor);
    }
}