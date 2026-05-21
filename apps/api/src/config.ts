import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  HOST: z.string().default("0.0.0.0"),
  WEB_ORIGIN: z.string().default("http://localhost:5173"),
  ADMIN_TOKEN: z.string().min(24, "ADMIN_TOKEN must be at least 24 characters"),
  CONTENT_FILE_PATH: z.string().default("apps/api/data/site-content.json")
});

export const config = envSchema.parse(process.env);
