import {RegisterRequest} from "../models/requests/auth/register.request";
import {LoginRequest} from "../models/requests/auth/login.request";
import {TokenResponse} from "../models/responses/token/token.response";

export interface IAuthService {
    register(request: RegisterRequest): Promise<void>;
    login(request: LoginRequest, userAgent: string, ipAddress: string): Promise<TokenResponse>;
    logout(userId: string, userAgent: string, ipAddress: string): Promise<void>;
    renewToken(refreshToken: string, userAgent: string, ipAddress: string): Promise<string>;
}