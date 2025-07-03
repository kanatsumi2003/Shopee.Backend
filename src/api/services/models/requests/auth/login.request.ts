import {IsEmail, IsNotEmpty} from "class-validator";

export class LoginRequest {
    @IsEmail({}, {message: "Email is invalid"})
    @IsNotEmpty({message: "Email is required"})
    email!: string;

    @IsNotEmpty({message: "Password is required"})
    password!: string;
}