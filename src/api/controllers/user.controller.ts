import {inject, injectable} from "tsyringe";
import {SERVICE_TOKENS} from "../services/constants/service.token.constant";
import {RegisterRequest} from "../services/models/requests/auth/register.request";
import {StatusCodes} from "http-status-codes";
import {BaseResponse} from "../common/models/responses/base.response";
import {Body, Get, Post, Put, Res, Route, SuccessResponse, Tags, Request, Security, Example} from "tsoa";
import {IUserService} from "../services/interfaces/user.service.interface";
import {ConfirmEmailRequest} from "../services/models/requests/user/confirm.email.request";
import {RecoveryPasswordRequest} from "../services/models/requests/user/recovery.password.request";
import {GetProfileResponse} from "../services/models/responses/user/profile.response";
import {DatetimeHelper} from "../common/helpers/datetime.helper";

@injectable()
@Route("api/users")
@Tags("Users")
export class UserController {
    constructor(@inject(SERVICE_TOKENS.IUserService) private userService: IUserService) {
    }

    @Post('confirm-email')
    @SuccessResponse("202", "Email confirmed successfully")
    async register(@Body() body: ConfirmEmailRequest): Promise<BaseResponse<void>> {
        await this.userService.confirmEmail(body);
        return new BaseResponse(StatusCodes.ACCEPTED, "Email confirmed successfully", null);
    }

    @Post('resend-email')
    @SuccessResponse("201", "Email re-send successfully")
    async resendEmail(@Body() body: { email: string }): Promise<BaseResponse<void>> {
        await this.userService.reSendEmailOtp(body.email);
        return new BaseResponse(StatusCodes.CREATED, "Email resend successfully", null);
    }

    @Post('forgot-password')
    @SuccessResponse("201", "Forgot password successfully")
    async forgotPassword(@Body() body: { email: string }): Promise<BaseResponse<void>> {
        await this.userService.forgotPassword(body.email);
        return new BaseResponse(StatusCodes.CREATED, "Forgot password successfully", null);
    }

    @Put('recover-password')
    @SuccessResponse("202", "Recover password successfully")
    async recoverPassword(@Body() body: RecoveryPasswordRequest): Promise<BaseResponse<void>> {
        await this.userService.recoverPassword(body);
        return new BaseResponse(StatusCodes.ACCEPTED, "Recover password successfully", null);
    }

    @Get('profile')
    @Security("bearerAuth")
    @SuccessResponse("200", "Get profile successfully")
    @Example<BaseResponse<GetProfileResponse>>({
        statusCode: 200,
        message: "Get profile successfully",
        data: {
            email: "string@gmail.com",
            phoneNumber: "0123456789",
            dateOfBirth: new Date("2025-06-30T09:37:05.820Z"),
            name: "string"
        }
    })
    async getProfile(@Request() req: any): Promise<BaseResponse<GetProfileResponse>> {
        const userId = req.user?.userId;
        const response = await this.userService.getProfile(userId);
        return new BaseResponse(StatusCodes.OK, "Get profile successfully", response);
    }
}