import {Request, Response, NextFunction} from 'express'
import {StatusCodes} from "http-status-codes";
import {CoreException} from "../exceptions/core.exception";
export function GlobalExceptionMiddleware(err: Error, req: Request, res: Response, next: NextFunction): void {
    // Handle custom CoreException (which extends HttpException)
    if (err instanceof CoreException) {
        res.status(err.statusCode).json({
            statusCode: err.statusCode,
            errorMessage: err.message,
        });
        return;
    }

    // Handle unexpected errors
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        errorMessage: 'Internal Server Error: ' + err,
    });
    console.log(err);
}