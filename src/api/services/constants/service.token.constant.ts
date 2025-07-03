import {SendEmailOtpConsumer} from "../consumers/send.email.otp.consumer";

export const SERVICE_TOKENS = {
    JwtSettings: 'JwtSettings',
    IRabbitmqClient: 'IRabbitmqClient',
    IAuthService: 'IAuthService',
    ITokenService: 'ITokenService',
    IUserService : 'IUserService',
}

export const QUEUE_TOKENS = {
    SEND_EMAIL_OTP: 'send.email.otp',
    FORGOT_PASSWORD_EMAIL: 'forgot.password.email',
}

export const CONSUMER_TOKENS = {
    AllConsumers: 'AllConsumers',
    SendEmailOtpConsumer: 'SendEmailOtpConsumer',
    ForgotPasswordEmailConsumer: 'ForgotPasswordEmailConsumer',
}