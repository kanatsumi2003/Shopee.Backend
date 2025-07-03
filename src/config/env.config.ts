import path from "path";
import dotenv from "dotenv";


const NODE_ENV = process.env.NODE_ENV || "development";

if (NODE_ENV !== "production") {
    // Load environment-specific local file: .env.development.local, .env.test.local, etc.
    const envPath = path.resolve(process.cwd(), `.env.${NODE_ENV}.local`);
    dotenv.config({ path: envPath });
    console.log(`[ENV] Loaded ${envPath}`);
    // Only load .env
} else {
    console.log("[ENV] Loaded env for production with docker env");
}
