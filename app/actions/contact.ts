"use server";

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export async function sendContact(payload: ContactPayload): Promise<{ ok: boolean; error?: string }> {
  // Validate
  const name = payload.name.trim();
  const email = payload.email.trim();
  const message = payload.message.trim();

  if (!name || !email || !message) {
    return { ok: false, error: "All fields required." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Invalid email address." };
  }

  // TODO: plug in your preferred delivery (Resend, Nodemailer, etc.)
  // For now, just log server-side
  if (process.env.NODE_ENV === "development") {
    console.log("[contact]", { name, email, message });
  }

  return { ok: true };
}
