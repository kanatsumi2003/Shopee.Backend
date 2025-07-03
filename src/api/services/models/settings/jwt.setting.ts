export interface IJwtSettings {
    key: string;
    issuer: string;
    audience: string;
    accessTokenExpirationMinutes: number;
    refreshTokenExpirationHours: number;
}

export const JwtSettings: IJwtSettings = {
    key: process.env.JWT_SECRET_KEY || "default_secret",
    issuer: process.env.JWT_ISSUER || "default_issuer",
    audience: process.env.JWT_AUDIENCE || "default_audience",
    accessTokenExpirationMinutes: parseInt(process.env.JWT_ACCESS_EXPIRATION_MINUTES || "15", 10),
    refreshTokenExpirationHours: parseInt(process.env.JWT_REFRESH_EXPIRATION_HOURS || "3", 10), // 7 days
}
