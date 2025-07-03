import {IUser} from "../../repositories/entities/user.entity";
import {TokenResponse} from "../models/responses/token/token.response";

export interface ITokenService {
    generateTokens(user: Partial<IUser>, userAgent: string, ipAddress: string): Promise<TokenResponse>;
    refreshAccessToken(refreshToken: string, userAgent: string, userIpAddress: string): Promise<string>;
}