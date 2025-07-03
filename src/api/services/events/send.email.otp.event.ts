export class SendEmailOtpEvent {
    toEmail: string;
    emailOtp: string;
    constructor(emailOtp: string, toEmail: string) {
        this.emailOtp = emailOtp;
        this.toEmail = toEmail;
    }
}