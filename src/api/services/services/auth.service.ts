import {IAuthService} from "../interfaces/auth.service.interface";
import {inject, injectable} from "tsyringe";
import {REPOSITORY_TOKENS} from "../../repositories/constants/repository.token.constant";
import {IUnitOfWork} from "../../repositories/interfaces/unitofwork.interface";
import {RegisterRequest} from "../models/requests/auth/register.request";
import {CoreException} from "../../common/exceptions/core.exception";
import {StatusCodes} from "http-status-codes";
import {PasswordHelper} from "../../common/helpers/password.helper";
import {IUser, User} from "../../repositories/entities/user.entity";
import {OtpGeneratorHelper} from "../../common/helpers/otp.generator.helper";
import {Transactional} from "../../common/decorators/transactional.decorator";
import {LoginRequest} from "../models/requests/auth/login.request";
import {QUEUE_TOKENS, SERVICE_TOKENS} from "../constants/service.token.constant";
import {ITokenService} from "../interfaces/token.service.interface";
import {TokenResponse} from "../models/responses/token/token.response";
import {TimeStampHelper} from "../../common/helpers/timestamp.helper";
import * as mongoose from "mongoose";
import {HmacHelper} from "../../common/helpers/hmac.helper";
import {StringHelper} from "../../common/helpers/string.helper";
import {IRabbitmqClient} from "../rabbitmq/rabbitmq.client.interface";
import {SendEmailOtpEvent} from "../events/send.email.otp.event";

@injectable()
export class AuthService implements IAuthService {
    constructor(@inject(REPOSITORY_TOKENS.IUnitOfWork) private readonly unitOfWork: IUnitOfWork,
                @inject(SERVICE_TOKENS.ITokenService) private readonly tokenService: ITokenService,
                @inject(SERVICE_TOKENS.IRabbitmqClient) private readonly rabbitmqClient: IRabbitmqClient,) {
    }

    @Transactional()
    async register(request: RegisterRequest): Promise<void> {
        const session = this.unitOfWork.getSession();

        // Check if email existed
        const existingUser = await this.unitOfWork.getUserRepository().findOne({
            email: request.email
        });
        if (existingUser) {
            throw new CoreException(StatusCodes.BAD_REQUEST, 'User already exists');
        }

        // Hash password with HmacSHA256
        const hashedPassword = await PasswordHelper.hashPassword(request.password);

        const newUser: Partial<IUser> = {
            email: request.email,
            password: hashedPassword,
            phoneNumber: request.phoneNumber,
            dateOfBirth: request.dateOfBirth,
            emailOtp: OtpGeneratorHelper.generate(),
            otpExpireAt: TimeStampHelper.generateUnixTimeStamp(0, 5,0).toString(),
            name: request.name,
        }
        await this.unitOfWork.getUserRepository().create(newUser, session);

        await this.unitOfWork.commit();

        // Send email
        await this.rabbitmqClient.publish<SendEmailOtpEvent>(QUEUE_TOKENS.SEND_EMAIL_OTP, {
            toEmail: request.email,
            emailOtp: newUser.emailOtp!
        });
    }

    async login(request: LoginRequest, userAgent: string, ipAddress: string): Promise<TokenResponse> {
        const user = await this.unitOfWork.getUserRepository().findOne({
            email: request.email,
        });

        // Check exist user
        if (!user) {
            throw new CoreException(StatusCodes.BAD_REQUEST, 'User not found');
        }

        // Check matched password
        const validPassword = await PasswordHelper.comparePassword(request.password, user.password!);
        if(!validPassword) {
            throw new CoreException(StatusCodes.BAD_REQUEST, 'Password not match');
        }

        // Check email confirm or not
        if(!user.emailConfirmed) {
            throw new CoreException(StatusCodes.FORBIDDEN, 'Email has not yet confirmed');
        }

        // return refresh and access token
        return await this.tokenService.generateTokens(user, userAgent, ipAddress);
    }

    @Transactional()
    async logout(userId: string, userAgent: string, ipAddress: string): Promise<void> {
        const user = await this.unitOfWork.getUserRepository().findOne({
            _id: userId,
        })

        // Check if user exists
        if(!user) {
            throw new CoreException(StatusCodes.BAD_REQUEST, 'User not found');
        }

        const ipAddressHashed = HmacHelper.sha256Hash(ipAddress);
        const userAgentHash = HmacHelper.sha256Hash(StringHelper.normalize(userAgent));

        const userToken = await this.unitOfWork.getUserTokenRepository().findOne({
            userId: user._id,
            ipAddressHash: ipAddressHashed,
            userAgentHash: userAgentHash
        })

        // Check if UserToken exists
        if(!userToken) {
            throw new CoreException(StatusCodes.BAD_REQUEST, 'User Token not found');
        }

        const session = this.unitOfWork.getSession();

        // Delete from database
        await this.unitOfWork.getUserTokenRepository().deletePermanent(userToken._id.toString(), session);
        await this.unitOfWork.commit();
    }

    async renewToken(refreshToken: string, userAgent: string, ipAddress: string): Promise<string> {
        return await this.tokenService.refreshAccessToken(refreshToken, userAgent, ipAddress);
    }
}