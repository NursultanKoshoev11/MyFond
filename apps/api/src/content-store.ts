import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { siteContent, type SiteContent } from "@myfond/shared";
import { config } from "./config.js";

export async function readSiteContent(): Promise<SiteContent> {
  try {
    const raw = await readFile(config.CONTENT_FILE_PATH, "utf-8");
    return JSON.parse(raw) as SiteContent;
  } catch {
    await writeSiteContent(siteContent);
    return siteContent;
  }
}

export async function writeSiteContent(content: SiteContent): Promise<SiteContent> {
  await mkdir(dirname(config.CONTENT_FILE_PATH), { recursive: true });
  await writeFile(config.CONTENT_FILE_PATH, JSON.stringify(content, null, 2), "utf-8");
  return content;
}
