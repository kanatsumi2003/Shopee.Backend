import {IsEmail, IsNotEmpty, IsDate, IsPhoneNumber} from "class-validator";

export class RegisterRequest {
    @IsEmail({}, { message: 'Email must be valid'})
    @IsNotEmpty({ message: 'Email address is required' })
    email!: string;

    @IsNotEmpty({ message: 'Password is required' })
    password!: string;

    @IsNotEmpty({ message: 'Name is required' })
    name!: string;

    @IsDate({ message: 'Date is invalid'})
    dateOfBirth?: Date;

    @IsPhoneNumber('VN', { message: 'Phone number is invalid' })
    phoneNumber?: string;

}