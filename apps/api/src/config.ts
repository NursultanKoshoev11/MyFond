import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  HOST: z.string().default("0.0.0.0"),
  WEB_ORIGIN: z.string().default("http://localhost:5173")
});

export const config = envSchema.parse(process.env);
