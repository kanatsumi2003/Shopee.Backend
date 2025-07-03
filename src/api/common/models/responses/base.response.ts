
export class BaseResponse<T = any> {
    statusCode: number = 200;
    message: string = 'Successful';
    data: T | null = null;

    constructor();
    constructor(statusCode: number, message: string, data: T | null);
    constructor(statusCode?: number, message?: string, data?: T | null) {
        if (statusCode !== undefined) this.statusCode = statusCode;
        if (message !== undefined) this.message = message;
        if (data !== undefined) this.data = data;
    }
}
