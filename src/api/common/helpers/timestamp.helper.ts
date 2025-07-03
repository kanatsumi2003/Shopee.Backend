export class TimeStampHelper {
    /**
     * Generate Unix Timestamp at the moment
     * @param isMilliSecond Return as milliseconds format if true
     * @returns number (milliseconds if true, otherwise seconds)
     */
    public static generateUnixTimeStampNow(isMilliSecond: boolean = false): number {
        const now = Date.now(); // returns milliseconds
        return isMilliSecond ? now : Math.floor(now / 1000);
    }

    /**
     * Generate Timestamp in format yyyyMMddHHmmss or yyyyMMddHHmmssfff
     * @param isMilliSecond Return as milliseconds format if true
     * @returns number as timestamp format
     */
    public static generateTimeStampNow(isMilliSecond: boolean = false): number {
        const now = new Date();
        return parseInt(
            TimeStampHelper.formatDate(now, isMilliSecond)
        );
    }

    /**
     * Generate Unix Timestamp by adding specific hours, minutes, seconds
     * @param hours Number of hours to add
     * @param minutes Number of minutes to add
     * @param seconds Number of seconds to add
     * @param isMilliSecond Return as milliseconds format if true
     * @returns number (milliseconds if true, otherwise seconds)
     */
    public static generateUnixTimeStamp(
        hours?: number,
        minutes?: number,
        seconds?: number,
        isMilliSecond: boolean = false
    ): number {
        const now = new Date();
        now.setHours(now.getHours() + (hours ?? 0));
        now.setMinutes(now.getMinutes() + (minutes ?? 0));
        now.setSeconds(now.getSeconds() + (seconds ?? 0));

        const unixMillis = now.getTime();
        return isMilliSecond ? unixMillis : Math.floor(unixMillis / 1000);
    }

    /**
     * Generate Timestamp in format yyyyMMddHHmmss or yyyyMMddHHmmssfff by adding time
     * @param hours Number of hours to add
     * @param minutes Number of minutes to add
     * @param seconds Number of seconds to add
     * @param isMilliSecond Return as milliseconds format if true
     * @returns number as timestamp format
     */
    public static generateTimeStamp(
        hours?: number,
        minutes?: number,
        seconds?: number,
        isMilliSecond: boolean = false
    ): number {
        const now = new Date();
        now.setHours(now.getHours() + (hours ?? 0));
        now.setMinutes(now.getMinutes() + (minutes ?? 0));
        now.setSeconds(now.getSeconds() + (seconds ?? 0));

        return parseInt(TimeStampHelper.formatDate(now, isMilliSecond));
    }

    private static formatDate(date: Date, includeMillis: boolean): string {
        const pad = (n: number, width: number = 2): string =>
            n.toString().padStart(width, '0');

        const yyyy = date.getFullYear();
        const MM = pad(date.getMonth() + 1);
        const dd = pad(date.getDate());
        const HH = pad(date.getHours());
        const mm = pad(date.getMinutes());
        const ss = pad(date.getSeconds());
        const fff = pad(date.getMilliseconds(), 3);

        return includeMillis
            ? `${yyyy}${MM}${dd}${HH}${mm}${ss}${fff}`
            : `${yyyy}${MM}${dd}${HH}${mm}${ss}`;
    }
}