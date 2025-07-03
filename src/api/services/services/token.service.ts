import {inject, injectable} from "tsyringe";
import {ITokenService} from "../interfaces/token.service.interface";
import {REPOSITORY_TOKENS} from "../../repositories/constants/repository.token.constant";
import {IUser} from "../../repositories/entities/user.entity";
import {HmacHelper} from "../../common/helpers/hmac.helper";
import {CoreException} from "../../common/exceptions/core.exception";
import {StatusCodes} from "http-status-codes";
import {SERVICE_TOKENS} from "../constants/service.token.constant";
import {IJwtSettings} from "../models/settings/jwt.setting";
import {IUnitOfWork} from "../../repositories/interfaces/unitofwork.interface";
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import {StringHelper} from "../../common/helpers/string.helper";
import {TimeStampHelper} from "../../common/helpers/timestamp.helper";
import {IUserToken, UserToken} from "../../repositories/entities/user.token.entity";
import {TokenResponse} from "../models/responses/token/token.response";
import {Transactional} from "../../common/decorators/transactional.decorator";
import {DatetimeHelper} from "../../common/helpers/datetime.helper";

@injectable()
export class TokenService implements ITokenService {
    constructor(@inject(REPOSITORY_TOKENS.IUnitOfWork) private readonly unitOfWork: IUnitOfWork,
                @inject(SERVICE_TOKENS.JwtSettings) private readonly jwtSettings: IJwtSettings) {
    }

    async generateAccessToken(user: Partial<IUser>, userAgent: string, userIpAddress: string): Promise<string> {
        const userAgentHashed = HmacHelper.sha256Hash(StringHelper.normalize(userAgent));
        const userIpAddressHashed = HmacHelper.sha256Hash(userIpAddress);

        const authToken = await this.unitOfWork.getUserTokenRepository().findOne({
            userId: user._id,
            userAgentHash: userAgentHashed,
            ipAddressHash: userIpAddressHashed,
        });

        if(!authToken) {
            throw new CoreException(StatusCodes.BAD_REQUEST, "User token not found");
        }

        const inputString = user._id!.toString() + userAgentHashed + userIpAddressHashed + authToken.token;
        const tokenHash = this.hashJwtTokenString(inputString);

        const payload = {
            userId: user._id,
            tokenHash: tokenHash
        };

        return jwt.sign(payload, this.jwtSettings.key, {
            expiresIn: `${this.jwtSettings.accessTokenExpirationMinutes}m`,
            issuer: this.jwtSettings.issuer,
            audience: this.jwtSettings.audience
        });
    }

    async refreshAccessToken(refreshToken: string, userAgent: string, userIpAddress: string): Promise<string> {
        const userAgentHashed = HmacHelper.sha256Hash(StringHelper.normalize(userAgent));
        const userIpAddressHashed = HmacHelper.sha256Hash(userIpAddress);

        const userToken = await this.unitOfWork.getUserTokenRepository().findOne({
            token: refreshToken,
            userAgentHash: userAgentHashed,
            ipAddressHash: userIpAddressHashed,
        });

        if(!userToken) {
            throw new CoreException(StatusCodes.BAD_REQUEST, "User token not found");
        }

        const user = await this.unitOfWork.getUserRepository().findOne({
            _id: userToken.userId,
        })

        if(!user) {
            throw new CoreException(StatusCodes.BAD_REQUEST, "User not found");
        }

        if(Number(userToken.expireAt) < TimeStampHelper.generateUnixTimeStampNow()) {
            throw new CoreException(StatusCodes.BAD_REQUEST, "User token expired");
        }

        const inputString = user._id!.toString() + userAgentHashed + userIpAddressHashed + refreshToken;
        const tokenHash = this.hashJwtTokenString(inputString);

        const payload = {
            userId: user._id,
            tokenHash: tokenHash
        };

        return jwt.sign(payload, this.jwtSettings.key, {
            expiresIn: `${this.jwtSettings.accessTokenExpirationMinutes}m`,
            issuer: this.jwtSettings.issuer,
            audience: this.jwtSettings.audience
        });
    }

    @Transactional()
    async generateRefreshToken(user: Partial<IUser>, userAgent: string, userIpAddress: string): Promise<{ refreshToken: string, expireAt: string }> {
        const refreshToken = crypto.randomBytes(64).toString("base64");
        const userAgentHash = HmacHelper.sha256Hash(StringHelper.normalize(userAgent));
        const ipAddressHash = HmacHelper.sha256Hash(userIpAddress);

        const expiration = TimeStampHelper.generateUnixTimeStamp(
            this.jwtSettings.refreshTokenExpirationHours
        );

        let token = await this.unitOfWork.getUserTokenRepository().findOne({
            userId: user._id,
            userAgentHash: userAgentHash,
            ipAddressHash: ipAddressHash,
        });

        const session = this.unitOfWork.getSession();

        // If token already existed and has not been expired, then return the token
        if(token && !this.isTokenExpired(token.expireAt)) {
            token.token = refreshToken;
            token.expireAt = expiration.toString();
            await this.unitOfWork.getUserTokenRepository().update(token._id.toString(), token, session);
        }
        else {
            const newToken: Partial<IUserToken> = {
                userId: user._id,
                userAgentHash: userAgentHash,
                ipAddressHash: ipAddressHash,
                provider: "refreshToken",
                token: refreshToken,
                expireAt: expiration.toString(),
            };

            await this.unitOfWork.getUserTokenRepository().create(newToken, session);
        }

        await this.unitOfWork.commit();

        return {
            refreshToken: refreshToken,
            expireAt: expiration.toString(),
        };
    }

    async generateTokens(user: Partial<IUser>, userAgent: string, ipAddress: string): Promise<TokenResponse> {
        const refreshToken = await this.generateRefreshToken(user, userAgent, ipAddress);
        const accessToken = await this.generateAccessToken(user, userAgent, ipAddress);
        return {
            accessToken: accessToken,
            refreshToken: refreshToken.refreshToken,
            expireAt: refreshToken.expireAt
        };
    }
    
    hashJwtTokenString(input: string): string {
        const combined = this.jwtSettings.key + this.jwtSettings.issuer + this.jwtSettings.audience + input;
        return HmacHelper.sha256Hash(combined);
    }

    validTokenHash(token: string, inputString: string): boolean {
        const expectedHash = this.hashJwtTokenString(inputString);
        return token === expectedHash;
    }

    isTokenExpired(expiration: string): boolean {
        return parseInt(expiration) > TimeStampHelper.generateTimeStampNow(false);
    }
}