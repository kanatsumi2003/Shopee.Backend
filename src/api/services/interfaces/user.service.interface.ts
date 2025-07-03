import {ConfirmEmailRequest} from "../models/requests/user/confirm.email.request";
import {RecoveryPasswordRequest} from "../models/requests/user/recovery.password.request";
import {TokenResponse} from "../models/responses/token/token.response";
import {GetProfileResponse} from "../models/responses/user/profile.response";

export interface IUserService {
    confirmEmail(request: ConfirmEmailRequest): Promise<void>;
    reSendEmailOtp(email: string): Promise<void>;
    forgotPassword(email: string): Promise<void>;
    recoverPassword(request: RecoveryPasswordRequest): Promise<void>;
    getProfile(userId: string): Promise<GetProfileResponse>;
}