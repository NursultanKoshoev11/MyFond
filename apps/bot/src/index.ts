import "dotenv/config";
import { Telegraf } from "telegraf";
import { siteContent } from "@myfond/shared";

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  throw new Error("TELEGRAM_BOT_TOKEN is required to start the MyFond bot.");
}

const bot = new Telegraf(token);

bot.start(async (ctx) => {
  await ctx.reply(
    `Добро пожаловать в ${siteContent.brand.name}.\n\n${siteContent.brand.description}\n\nНапишите /services, чтобы посмотреть направления работы.`
  );
});

bot.command("services", async (ctx) => {
  const services = siteContent.services
    .map((service) => `• ${service.title}\n${service.description}`)
    .join("\n\n");

  await ctx.reply(`Что делает ${siteContent.brand.name}:\n\n${services}`);
});

bot.command("contact", async (ctx) => {
  await ctx.reply(
    "Опишите задачу одним сообщением. Следующим этапом здесь можно подключить отправку заявки в API /api/contact."
  );
});

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
