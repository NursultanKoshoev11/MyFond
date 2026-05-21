import type { FastifyInstance } from "fastify";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().min(5).max(40).optional().or(z.literal("")),
  message: z.string().min(10).max(2000),
  channel: z.enum(["site", "telegram", "manual"]).default("site")
});

export async function contactRoutes(app: FastifyInstance) {
  app.post("/contact", async (request, reply) => {
    const parsed = contactSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.code(400).send({
        ok: false,
        error: "Invalid contact request",
        details: parsed.error.flatten()
      });
    }

    const contact = {
      ...parsed.data,
      createdAt: new Date().toISOString()
    };

    request.log.info({ contact }, "New contact request");

    return reply.code(201).send({
      ok: true,
      message: "Заявка принята. Мы свяжемся с вами в ближайшее время.",
      data: contact
    });
  });
}
