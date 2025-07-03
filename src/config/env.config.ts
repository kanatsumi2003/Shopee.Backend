import path from "path";
import dotenv from "dotenv";


const NODE_ENV = process.env.NODE_ENV || "development";

if (NODE_ENV === "production") {
    // Only load .env
    dotenv.config({ path: path.resolve(process.cwd(), ".env") });
    console.log("[ENV] Loaded .env for production");
} else {
    // Load environment-specific local file: .env.development.local, .env.test.local, etc.
    const envPath = path.resolve(process.cwd(), `.env.${NODE_ENV}.local`);
    dotenv.config({ path: envPath });
    console.log(`[ENV] Loaded ${envPath}`);
}
