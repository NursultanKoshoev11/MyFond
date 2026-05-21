import Fastify from "fastify";
import cors from "@fastify/cors";
import { config } from "./config.js";
import { siteRoutes } from "./routes/site.js";
import { contactRoutes } from "./routes/contact.js";

export async function buildServer() {
  const app = Fastify({
    logger: {
      level: "info",
      transport:
        process.env.NODE_ENV === "production"
          ? undefined
          : {
              target: "pino-pretty",
              options: {
                translateTime: "HH:MM:ss Z",
                ignore: "pid,hostname"
              }
            }
    }
  });

  await app.register(cors, {
    origin: [config.WEB_ORIGIN, "http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true
  });

  app.get("/api/health", async () => ({
    ok: true,
    service: "myfond-api",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  }));

  await app.register(siteRoutes, { prefix: "/api" });
  await app.register(contactRoutes, { prefix: "/api" });

  return app;
}

const app = await buildServer();

try {
  await app.listen({ port: config.PORT, host: config.HOST });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
