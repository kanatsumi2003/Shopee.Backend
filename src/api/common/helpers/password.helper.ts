import * as bcrypt from "bcrypt";
export class PasswordHelper {
    private static readonly SALT_ROUNDS: number = 10;

    static async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, this.SALT_ROUNDS);
    }

    static async comparePassword(
        password: string,
        hashedPassword: string,
    ): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }
}
