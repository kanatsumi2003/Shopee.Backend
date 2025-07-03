import {Example} from "@tsoa/runtime";

export class TokenResponse {
    @Example('string')
    accessToken: string;
    @Example('string')
    refreshToken: string;
    @Example('string')
    expireAt: string;
    constructor(accessToken: string, refreshToken: string, expireAt: string) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.expireAt = expireAt;
    }
}