export class ConfirmEmailRequest {
    email: string;
    emailOtp: string;
    constructor(email: string, emailOtp: string) {
        this.email = email;
        this.emailOtp = emailOtp;
    }
}