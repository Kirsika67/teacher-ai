import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Absoluutne tee `server/.env` failile (töötab ka siis, kui `process.cwd()` on monorepo juur). */
export const SERVER_DOTENV_PATH = path.resolve(__dirname, "..", ".env");

const result = dotenv.config({ path: SERVER_DOTENV_PATH });

if (result.error) {
  console.warn(
    "[EduAI] .env laadimine:",
    result.error.message,
    "| otsitud:",
    SERVER_DOTENV_PATH
  );
} else {
  console.log("[EduAI] Keskkond:", SERVER_DOTENV_PATH);
}
