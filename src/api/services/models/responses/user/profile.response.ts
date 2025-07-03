export class GetProfileResponse {
    email: string;
    phoneNumber?: string;
    dateOfBirth?: Date;
    name?: string;
    constructor(email: string, phoneNumber: string, dateOfBirth: Date, name: string) {
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.dateOfBirth = dateOfBirth;
        this.name = name;
    }
}