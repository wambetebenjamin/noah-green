"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { useRecaptcha } from "@/components/useRecaptcha";

const PREMISES = [
  { value: "office", label: "Office or campus" },
  { value: "estate", label: "Residential estate" },
  { value: "hotel", label: "Hotel or restaurant" },
  { value: "factory", label: "Factory or workshop" },
];

export default function CorporateForm() {
  const recaptcha = useRecaptcha("corporate_enquiry");
  const [form, setForm] = useState({
    organisation: "",
    contactName: "",
    email: "",
    phone: "",
    premisesType: "office",
    monthlyVolumeKg: 500,
    message: "",
  });
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    const token = await recaptcha.execute();
    const res = await fetch("/api/contact/corporate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, recaptchaToken: token }),
    });
    setState(res.ok ? "done" : "error");
  };

  return (
    <form onSubmit={submit} className="ng-chart-card">
      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="corp-org">Organisation</label>
            <input
              id="corp-org"
              className="form-control"
              required
              value={form.organisation}
              onChange={(e) => setForm({ ...form, organisation: e.target.value })}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="corp-name">Contact person</label>
            <input
              id="corp-name"
              className="form-control"
              required
              value={form.contactName}
              onChange={(e) => setForm({ ...form, contactName: e.target.value })}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="corp-email">Work email</label>
            <input
              id="corp-email"
              type="email"
              className="form-control"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="corp-phone">Phone</label>
            <input
              id="corp-phone"
              className="form-control"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="corp-premises">Premises type</label>
            <select
              id="corp-premises"
              className="form-control"
              value={form.premisesType}
              onChange={(e) =>
                setForm({
                  ...form,
                  premisesType: e.target.value as "office" | "estate" | "hotel" | "factory",
                })
              }
            >
              {PREMISES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="corp-volume">Estimated monthly volume, kg</label>
            <input
              id="corp-volume"
              type="number"
              min={50}
              className="form-control"
              value={form.monthlyVolumeKg}
              onChange={(e) =>
                setForm({ ...form, monthlyVolumeKg: Number(e.target.value) || 0 })
              }
            />
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="corp-message">Anything we should know?</label>
            <textarea
              id="corp-message"
              className="form-control"
              rows={3}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>
        </div>
      </div>
      <button type="submit" className="btn btn-primary py-3 px-4" disabled={state === "sending"}>
        {state === "sending" ? <Loader2 size={14} className="mr-1" /> : <Send size={14} className="mr-1" />}
        Request a contract quote
      </button>
      {state === "done" ? (
        <span className="ml-3" style={{ color: "#28a745", fontSize: 14 }}>
          Received. The corporate desk replies within one working day.
        </span>
      ) : null}
      {state === "error" ? (
        <span className="ml-3" style={{ color: "#dc3545", fontSize: 14 }}>
          Submission failed. Please retry or WhatsApp the corporate desk.
        </span>
      ) : null}
    </form>
  );
}
