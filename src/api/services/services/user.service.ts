import {inject, injectable} from "tsyringe";
import {REPOSITORY_TOKENS} from "../../repositories/constants/repository.token.constant";
import {IUnitOfWork} from "../../repositories/interfaces/unitofwork.interface";
import {IUserService} from "../interfaces/user.service.interface";
import {ConfirmEmailRequest} from "../models/requests/user/confirm.email.request";
import {CoreException} from "../../common/exceptions/core.exception";
import {StatusCodes} from "http-status-codes";
import {TimeStampHelper} from "../../common/helpers/timestamp.helper";
import {Transactional} from "../../common/decorators/transactional.decorator";
import {OtpGeneratorHelper} from "../../common/helpers/otp.generator.helper";
import {QUEUE_TOKENS, SERVICE_TOKENS} from "../constants/service.token.constant";
import {SendEmailOtpEvent} from "../events/send.email.otp.event";
import {IRabbitmqClient} from "../rabbitmq/rabbitmq.client.interface";
import {HmacHelper} from "../../common/helpers/hmac.helper";
import {ForgotPasswordEmailEvent} from "../events/forgot.password.email.event";
import {TokenResponse} from "../models/responses/token/token.response";
import {RecoveryPasswordRequest} from "../models/requests/user/recovery.password.request";
import {Hmac} from "node:crypto";
import {PasswordHelper} from "../../common/helpers/password.helper";
import {GetProfileResponse} from "../models/responses/user/profile.response";

@injectable()
export class UserService implements IUserService {
    constructor(@inject(REPOSITORY_TOKENS.IUnitOfWork) private readonly unitOfWork: IUnitOfWork,
                @inject(SERVICE_TOKENS.IRabbitmqClient) private readonly rabbitmqClient: IRabbitmqClient,) {
    }

    @Transactional()
    async confirmEmail(request: ConfirmEmailRequest): Promise<void> {
        const user = await this.unitOfWork.getUserRepository().findOne({
            email: request.email,
        });

        if (!user) {
            throw new CoreException(StatusCodes.BAD_REQUEST, 'User not found');
        }

        if (user.emailConfirmed) {
            throw new CoreException(StatusCodes.FORBIDDEN, "Email is already confirmed");
        }

        if (parseInt(user.otpExpireAt) < TimeStampHelper.generateUnixTimeStampNow(false)) {
            throw new CoreException(StatusCodes.FORBIDDEN, "Otp expired");
        }

        if (user.emailOtp != request.emailOtp) {
            throw new CoreException(StatusCodes.FORBIDDEN, 'Otp does not match');
        }

        user.emailConfirmed = true;
        user.emailOtp = "";
        user.otpExpireAt = "";

        const session = this.unitOfWork.getSession();
        await this.unitOfWork.getUserRepository().update(user._id.toString(), user, session);
        await this.unitOfWork.commit();
    }

    @Transactional()
    async reSendEmailOtp(email: string): Promise<void> {
        const user = await this.unitOfWork.getUserRepository().findOne({
            email: email,
        })

        // Check user exists
        if(!user) {
            throw new CoreException(StatusCodes.BAD_REQUEST, "User not found");
        }

        // Generate new email Otp and expiry time
        const emailOtp = OtpGeneratorHelper.generate()
        user.emailOtp = emailOtp;
        user.otpExpireAt = TimeStampHelper.generateUnixTimeStamp(0, 5, 0).toString();

        const session = this.unitOfWork.getSession();
        await this.unitOfWork.getUserRepository().update(user._id.toString(), user, session);
        await this.unitOfWork.commit();

        await this.rabbitmqClient.publish<SendEmailOtpEvent>(QUEUE_TOKENS.SEND_EMAIL_OTP, {
            toEmail: email,
            emailOtp: emailOtp,
        })
    }

    @Transactional()
    async forgotPassword(email: string): Promise<void> {
        const user = await this.unitOfWork.getUserRepository().findOne({
            email: email,
        })

        if(!user) {
            throw new CoreException(StatusCodes.BAD_REQUEST, "User not found");
        }

        if(!user.emailConfirmed) {
            throw new CoreException(StatusCodes.BAD_REQUEST, "Email is not confirmed");
        }

        const forgotPasswordToken = HmacHelper.sha256Hash(HmacHelper.randomBase64Token());

        user.forgotPasswordToken = forgotPasswordToken;
        const forgotPasswordExpireAt = TimeStampHelper.generateUnixTimeStamp(0, 5, 0).toString();

        const session = this.unitOfWork.getSession();
        await this.unitOfWork.getUserRepository().update(user._id.toString(), user, session);
        await this.unitOfWork.commit();

        await this.rabbitmqClient.publish<ForgotPasswordEmailEvent>(QUEUE_TOKENS.FORGOT_PASSWORD_EMAIL, {
            email: user.email,
            expiryTimeStamp: forgotPasswordExpireAt,
            resetPasswordToken: forgotPasswordToken,
        })
    }

    @Transactional()
    async recoverPassword(request: RecoveryPasswordRequest): Promise<void> {
        const user = await this.unitOfWork.getUserRepository().findOne({
            email: request.email,
        })
        if(!user) {
            throw new CoreException(StatusCodes.BAD_REQUEST, "User not found");
        }

        if(user.forgotPasswordToken !== request.token) {
            throw new CoreException(StatusCodes.FORBIDDEN, "Token is invalid");
        }

        if(Number(request.timestamp) < TimeStampHelper.generateUnixTimeStampNow(false)) {
            throw new CoreException(StatusCodes.FORBIDDEN, 'Reset link has expired');
        }

        user.password = await PasswordHelper.hashPassword(request.newPassword);
        user.forgotPasswordToken = undefined;

        const session = this.unitOfWork.getSession();
        await this.unitOfWork.getUserRepository().update(user._id.toString(), user, session);
        await this.unitOfWork.commit();
    }

    async getProfile(userId: string): Promise<GetProfileResponse> {
        const user = await this.unitOfWork.getUserRepository().findOne({
            _id: userId,
        })

        if(!user) {
            throw new CoreException(StatusCodes.BAD_REQUEST, "User not found");
        }

        return {
            email: user.email,
            name: user.name,
            dateOfBirth: user.dateOfBirth,
            phoneNumber: user.phoneNumber,
        };
    }
}