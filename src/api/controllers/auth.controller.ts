import {inject, injectable} from "tsyringe";
import {SERVICE_TOKENS} from "../services/constants/service.token.constant";
import {IAuthService} from "../services/interfaces/auth.service.interface";
import {RegisterRequest} from "../services/models/requests/auth/register.request";
import {StatusCodes} from "http-status-codes";
import {BaseResponse} from "../common/models/responses/base.response";
import {Body, Post, Res, Route, SuccessResponse, Tags, Request, Security, Example} from "tsoa";
import {LoginRequest} from "../services/models/requests/auth/login.request";
import {TokenResponse} from "../services/models/responses/token/token.response";

@injectable()
@Route("api/auths")
@Tags("Authentications")
export class AuthController {
    constructor(@inject(SERVICE_TOKENS.IAuthService) private authService: IAuthService) {
    }

    @Post('register')
    @SuccessResponse("201", "Register successfully")
    async register(@Body() body: RegisterRequest): Promise<BaseResponse<void>> {
        // #swagger.tags = ["Auth"]
        await this.authService.register(body);
        const statusCode = StatusCodes.CREATED;
        return new BaseResponse(StatusCodes.CREATED, "Register successfully", null);
    }

    @Post("login")
    @SuccessResponse("200", "Login successfully")
    @Example<BaseResponse<TokenResponse>>({
        statusCode: 200,
        message: 'Login successfully',
        data: {
            accessToken: 'access-token-example',
            refreshToken: 'refresh-token-example',
            expireAt: '1751366538',
        },
    })
    async login(@Body() body: LoginRequest, @Request() req: any): Promise<BaseResponse<TokenResponse>> {
        const ipAddress =
            (req.headers["x-forwarded-for"] as string) || req.socket?.remoteAddress || "";
        const userAgent = req.headers["user-agent"] || "unknown";

        const result = await this.authService.login(body, userAgent, ipAddress);

        return new BaseResponse(StatusCodes.OK, "Login successfully", result);
    }

    @Post("logout")
    @Security("bearerAuth")
    @SuccessResponse("202", "Logout successfully")
    async logout(@Request() req: any): Promise<BaseResponse<void>> {
        const userId = req.user?.userId;
        const ipAddress =
            (req.headers["x-forwarded-for"] as string) || req.socket?.remoteAddress || "";
        const userAgent = req.headers["user-agent"] || "unknown";

        await this.authService.logout(userId, userAgent, ipAddress);
        return new BaseResponse(StatusCodes.ACCEPTED, "Logout successfully", null);
    }

    @Post('access-token')
    @SuccessResponse("201", "Access token")
    @Example<BaseResponse<{accessToken: string}>>({
        statusCode: 201,
        message: "Refresh accessToken successfully",
        data: {
            accessToken: "access-token-example",
        }
    })
    async renewToken(@Request() req: any, @Body() body: {refreshToken: string}): Promise<BaseResponse<{accessToken: string}>> {
        const ipAddress =
            (req.headers["x-forwarded-for"] as string) || req.socket?.remoteAddress || "";
        const userAgent = req.headers["user-agent"] || "unknown";
        const response = await this.authService.renewToken(body.refreshToken, userAgent, ipAddress);
        return new BaseResponse(StatusCodes.OK, "Refresh accessToken successfully", {accessToken: response});
    }
}