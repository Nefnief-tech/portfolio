"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { sendContact } from "@/app/actions/contact";

export function ContactPanel() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const res = await sendContact(form);
    if (res.ok) {
      setStatus("ok");
    } else {
      setStatus("error");
      setErrorMsg(res.error ?? "Unknown error.");
    }
  };

  const inputClass = "bg-transparent border-b border-border text-text-soft font-mono text-sm focus:outline-none focus:border-primary w-full py-0.5 placeholder:text-muted transition-colors";

  return (
    <div className="px-6 py-3 font-mono text-sm">
      <motion.div className="text-muted mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {`> ./contact.sh`}
      </motion.div>

      {status === "ok" ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-primary glow-primary">
          &gt; Message sent. [OK]
        </motion.div>
      ) : (
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="border border-border rounded-md p-4 space-y-3 max-w-md bg-surface/60"
        >
          {/* Name */}
          <div className="flex items-center gap-2">
            <span className="text-muted w-16">name:</span>
            <input
              className={inputClass}
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="your name"
              disabled={status === "sending"}
            />
          </div>

          {/* Email */}
          <div className="flex items-center gap-2">
            <span className="text-muted w-16">email:</span>
            <input
              type="email"
              className={inputClass}
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="you@example.com"
              disabled={status === "sending"}
            />
          </div>

          {/* Message */}
          <div className="flex gap-2">
            <span className="text-muted w-16 pt-0.5">msg:</span>
            <textarea
              className={`${inputClass} resize-none`}
              rows={3}
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              placeholder="what's on your mind?"
              disabled={status === "sending"}
            />
          </div>

          {status === "error" && (
            <div className="text-red-500 text-xs">{errorMsg}</div>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="text-primary glow-primary hover:text-accent disabled:opacity-50"
          >
            {status === "sending" ? "> sending..." : "> [send message]"}
          </button>
        </motion.form>
      )}
    </div>
  );
}
