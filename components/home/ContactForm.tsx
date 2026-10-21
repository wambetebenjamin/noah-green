"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { useRecaptcha } from "@/components/useRecaptcha";

export default function ContactForm() {
  const recaptcha = useRecaptcha("contact");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    const token = await recaptcha.execute();
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, recaptchaToken: token }),
    });
    setState(res.ok ? "done" : "error");
    if (res.ok) setForm({ name: "", email: "", message: "" });
  };

  return (
    <form onSubmit={submit} className="appointment w-100">
      <div className="row">
        <div className="col-md-4">
          <div className="form-group">
            <label htmlFor="contact-name">Name</label>
            <input
              id="contact-name"
              className="form-control"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-group">
            <label htmlFor="contact-email">Email</label>
            <input
              id="contact-email"
              type="email"
              className="form-control"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-group">
            <label htmlFor="contact-message">Message</label>
            <input
              id="contact-message"
              className="form-control"
              required
              minLength={10}
              placeholder="How can we help?"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>
        </div>
      </div>
      <div className="d-flex align-items-center">
        <button type="submit" className="btn btn-primary py-3 px-4" disabled={state === "sending"}>
          {state === "sending" ? <Loader2 size={14} className="mr-1" /> : <Send size={14} className="mr-1" />}
          Send Message
        </button>
        {state === "done" ? (
          <span className="ml-3" style={{ color: "#28a745", fontSize: 14 }}>
            Asante! We will reply within one working day.
          </span>
        ) : null}
        {state === "error" ? (
          <span className="ml-3" style={{ color: "#dc3545", fontSize: 14 }}>
            Something failed. Try again or WhatsApp us.
          </span>
        ) : null}
      </div>
    </form>
  );
}
