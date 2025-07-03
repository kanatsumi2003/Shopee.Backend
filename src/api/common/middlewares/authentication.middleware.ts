import {container} from "tsyringe";
import {TokenService} from "../../services/services/token.service";
import {Request, NextFunction, Response, RequestHandler} from "express";
import jwt, {JwtPayload} from "jsonwebtoken";
import {IJwtSettings} from "../../services/models/settings/jwt.setting";
import {SERVICE_TOKENS} from "../../services/constants/service.token.constant";
import {StatusCodes} from "http-status-codes";
import {HmacHelper} from "../helpers/hmac.helper";

export function AuthenticationMiddleware(): RequestHandler {
    const tokenService = container.resolve(TokenService);
    const jwtSettings = container.resolve<IJwtSettings>(SERVICE_TOKENS.JwtSettings);

    return function (req: any, res: Response, next: NextFunction): void {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized: Missing token" });
            return;
        }

        const accessToken = authHeader.split(" ")[1];

        try {
            const decoded = jwt.verify(accessToken, jwtSettings.key) as JwtPayload;

            const userId = decoded.userId;
            const tokenHash = decoded.tokenHash;
            const rawToken = accessToken;
            const userAgent = req.headers["user-agent"] || "unknown";
            const ipAddress = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "";

            if (!userId || !tokenHash) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid token payload" });
                return;
            }

            const userAgentHashed = HmacHelper.sha256Hash(userAgent);
            const ipHashed = HmacHelper.sha256Hash(ipAddress);
            const inputString = userId + userAgentHashed + ipHashed + rawToken;
            const expectedHash = tokenService.hashJwtTokenString(inputString);

            if (expectedHash !== tokenHash) {
                res.status(403).json({ message: "Invalid token hash (tampered)" });
                return;
            }

            req.user = { userId };
            next();
        } catch (err) {
            res.status(403).json({ message: "Invalid token", error: (err as Error).message });
            return;
        }
    };
}