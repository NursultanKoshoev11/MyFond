import type { ContactRequest, SiteContent } from "@myfond/shared";

const API_URL = import.meta.env.VITE_API_URL || "";

export async function loadSiteContent(): Promise<SiteContent> {
  const response = await fetch(`${API_URL}/api/site`);

  if (!response.ok) {
    throw new Error("Failed to load site content");
  }

  const payload = (await response.json()) as { ok: boolean; data: SiteContent };
  return payload.data;
}

export async function loadAdminContent(token: string): Promise<SiteContent> {
  const response = await fetch(`${API_URL}/api/admin/site`, {
    headers: { "x-admin-token": token }
  });

  if (!response.ok) {
    throw new Error("Invalid admin token or API unavailable");
  }

  const payload = (await response.json()) as { ok: boolean; data: SiteContent };
  return payload.data;
}

export async function saveAdminContent(token: string, data: SiteContent) {
  const response = await fetch(`${API_URL}/api/admin/site`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-admin-token": token
    },
    body: JSON.stringify(data)
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.error || "Failed to save site content");
  }

  return payload as { ok: true; message: string; data: SiteContent };
}

export async function sendContactRequest(data: ContactRequest) {
  const response = await fetch(`${API_URL}/api/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.error || "Failed to send contact request");
  }

  return payload as { ok: true; message: string };
}
