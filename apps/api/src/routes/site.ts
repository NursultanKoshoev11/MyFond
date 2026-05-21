import type { FastifyInstance } from "fastify";
import { z } from "zod";
import type { SiteContent } from "@myfond/shared";
import { config } from "../config.js";
import { readSiteContent, writeSiteContent } from "../content-store.js";

const stringArray = z.array(z.string().min(1)).default([]);

const siteContentSchema = z.object({
  brand: z.object({
    name: z.string().min(1),
    tagline: z.string().min(1),
    description: z.string().min(1)
  }),
  hero: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    subtitle: z.string().min(1),
    primaryCta: z.string().min(1),
    secondaryCta: z.string().min(1)
  }),
  services: z.array(z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    tags: stringArray
  })),
  work: z.array(z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    metric: z.string().min(1)
  })),
  process: z.array(z.object({
    title: z.string().min(1),
    description: z.string().min(1)
  })),
  stats: z.array(z.object({
    label: z.string().min(1),
    value: z.string().min(1)
  }))
});

function isAdmin(request: { headers: Record<string, unknown> }) {
  return request.headers["x-admin-token"] === config.ADMIN_TOKEN;
}

function parseSiteContent(body: unknown): SiteContent {
  return siteContentSchema.parse(body) as unknown as SiteContent;
}

export async function siteRoutes(app: FastifyInstance) {
  app.get("/site", async () => ({
    ok: true,
    data: await readSiteContent()
  }));

  app.get("/admin/site", async (request, reply) => {
    if (!isAdmin(request)) {
      return reply.code(401).send({ ok: false, error: "Unauthorized" });
    }

    return {
      ok: true,
      data: await readSiteContent()
    };
  });

  app.put("/admin/site", async (request, reply) => {
    if (!isAdmin(request)) {
      return reply.code(401).send({ ok: false, error: "Unauthorized" });
    }

    let content: SiteContent;

    try {
      content = parseSiteContent(request.body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          ok: false,
          error: "Invalid site content",
          details: error.flatten()
        });
      }

      throw error;
    }

    const saved = await writeSiteContent(content);

    return {
      ok: true,
      message: "Content saved",
      data: saved
    };
  });
}
