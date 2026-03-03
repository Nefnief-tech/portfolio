"use server";

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export async function sendContact(payload: ContactPayload): Promise<{ ok: boolean; error?: string }> {
  // Validate
  if (!payload.name || !payload.email || !payload.message) {
    return { ok: false, error: "All fields required." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return { ok: false, error: "Invalid email address." };
  }

  // TODO: plug in your preferred delivery (Resend, Nodemailer, etc.)
  // For now, just log server-side
  console.log("[contact]", payload);

  return { ok: true };
}
