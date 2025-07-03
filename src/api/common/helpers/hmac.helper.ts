import crypto from 'crypto'
export class HmacHelper {
    private static HMAC_SECRET: string = process.env.JWT_SECRET || ''
    static sha256Hash(input: string): string {
        return crypto.createHmac('sha256', this.HMAC_SECRET).update(input).digest('hex');
    }

    static randomBase64Token(): string {
        return crypto.randomBytes(64).toString('base64')
    }
}