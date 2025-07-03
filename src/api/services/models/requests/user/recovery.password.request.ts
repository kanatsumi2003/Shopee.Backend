export class RecoveryPasswordRequest {
    email: string;
    token: string;
    timestamp: string;
    newPassword: string;
    constructor(email: string, token: string, timestamp: string, newPassword: string) {
        this.email = email;
        this.token = token;
        this.timestamp = timestamp;
        this.newPassword = newPassword;
    }
}