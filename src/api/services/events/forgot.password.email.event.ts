export class ForgotPasswordEmailEvent {
    email: string;
    resetPasswordToken: string;
    expiryTimeStamp: string;
    constructor(email: string, resetPasswordToken: string, expiryTimeStamp: string) {
        this.email = email;
        this.resetPasswordToken = resetPasswordToken;
        this.expiryTimeStamp = expiryTimeStamp;
    }
}