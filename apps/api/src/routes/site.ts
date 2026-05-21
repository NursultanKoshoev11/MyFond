import type { FastifyInstance } from "fastify";
import { siteContent } from "@myfond/shared";

export async function siteRoutes(app: FastifyInstance) {
  app.get("/site", async () => ({
    ok: true,
    data: siteContent
  }));
}
