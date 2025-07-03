export class DatetimeHelper {
    static nowUtcPlus7(): Date {
        const now = new Date();
        const utc = now.getTime() + now.getTimezoneOffset() * 60000;
        return new Date(utc + 7 * 60 * 60000);
    }
}
