import {container} from "tsyringe";
import {TokenService} from "../../services/services/token.service";
import {IJwtSettings} from "../../services/models/settings/jwt.setting";
import {SERVICE_TOKENS} from "../../services/constants/service.token.constant";
import jwt, {JwtPayload} from "jsonwebtoken";
import {HmacHelper} from "../helpers/hmac.helper";
import {UnitOfWork} from "../../repositories/common/unitofwork";
import {StringHelper} from "../helpers/string.helper";
import {Types} from "mongoose";
import {CoreException} from "../exceptions/core.exception";
import {StatusCodes} from "http-status-codes";

export async function expressAuthentication(
    request: any,
    securityName: string,
    scopes?: string[]
): Promise<{ userId: string }> {

    // Resolve DI
    const tokenService = container.resolve(TokenService);
    const jwtSettings = container.resolve<IJwtSettings>(SERVICE_TOKENS.JwtSettings);
    const unitOfWork = container.resolve(UnitOfWork);

    // Get bearer token
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new CoreException(StatusCodes.UNAUTHORIZED,"Unauthorized: Missing token");
    }

    // Read accessToken
    const accessToken = authHeader.split(" ")[1];

    const decoded = jwt.verify(accessToken, jwtSettings.key) as JwtPayload;

    const userId = decoded.userId;
    const tokenHash = decoded.tokenHash;
    const rawToken = accessToken;
    const userAgent = request.headers["user-agent"] || "unknown";
    const ipAddress =
        (request.headers["x-forwarded-for"] as string) || request.socket.remoteAddress || "";

    // Throw if payload is invalid (missing userId or tokenHash)
    if (!userId || !tokenHash) {
        throw new CoreException(StatusCodes.UNAUTHORIZED, "Invalid token payload");
    }

    const userAgentHashed = HmacHelper.sha256Hash(StringHelper.normalize(userAgent));
    const ipHashed = HmacHelper.sha256Hash(ipAddress);

    // Get UserToken from database
    const userToken = await unitOfWork.getUserTokenRepository().findOne({
        userId: new Types.ObjectId(userId),
        ipAddressHash: ipHashed,
        userAgentHash: userAgentHashed,
    })

    if (!userToken) {
        throw new CoreException(StatusCodes.UNAUTHORIZED,"User token not found");
    }

    const inputString = userId + userAgentHashed + ipHashed + userToken.token;
    const expectedHash = tokenService.hashJwtTokenString(inputString);

    // Hash and compare with tokenHash
    if (expectedHash !== tokenHash) {
        throw new CoreException(StatusCodes.UNAUTHORIZED,"Invalid token hash");
    }

    // Attach to request (optional, if needed in controller via @Request)
    (request as any).user = {userId};

    return {userId};

}