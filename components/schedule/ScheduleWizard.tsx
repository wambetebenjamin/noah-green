"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { MATERIALS, estimatePoints, materialByCode } from "@/lib/materials";
import type { MaterialCode } from "@/lib/materials";
import { COVERAGE_ZONES } from "@/lib/zones";
import { TIME_SLOTS, useWizard } from "@/lib/wizard-store";
import { useRecaptcha } from "@/components/useRecaptcha";
import { SITE } from "@/lib/constants";

const STEP_LABELS = [
  "Account",
  "Materials",
  "Date and Slot",
  "Address",
  "Contact",
  "Review",
];

function todayIso(): string {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  return new Date(d.getTime() - offset * 60000).toISOString().slice(0, 10);
}

export default function ScheduleWizard() {
  const router = useRouter();
  const wizard = useWizard();
  const { data: session } = useSession();
  const recaptcha = useRecaptcha("schedule_pickup");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [needV2, setNeedV2] = useState(false);
  const v2Host = useRef<HTMLDivElement | null>(null);

  const selectedLines = useMemo(
    () =>
      Object.entries(wizard.materials)
        .filter(([, kg]) => kg > 0)
        .map(([code, kg]) => ({ code: code as MaterialCode, kg })),
    [wizard.materials]
  );
  const points = useMemo(() => estimatePoints(selectedLines), [selectedLines]);

  const canNext = (): boolean => {
    switch (wizard.step) {
      case 0:
        return Boolean(wizard.accountType);
      case 1:
        return selectedLines.length > 0;
      case 2:
        return Boolean(wizard.date && wizard.slot);
      case 3:
        return Boolean(wizard.zone && wizard.address.trim().length > 5);
      case 4:
        return (
          wizard.name.trim().length > 1 &&
          /^[+0-9 ()-]{9,}$/.test(wizard.phone) &&
          /.+@.+\..+/.test(wizard.email)
        );
      default:
        return true;
    }
  };

  const buildPayload = (v2Token: string | null) => ({
    accountType: wizard.accountType,
    materials: selectedLines,
    date: wizard.date,
    slot: wizard.slot,
    zone: wizard.zone,
    address: wizard.address,
    gateNotes: wizard.gateNotes,
    name: wizard.name,
    phone: wizard.phone,
    email: wizard.email,
    recaptchaToken: null as string | null,
    recaptchaV2Token: v2Token,
  });

  const submit = async (v2Token: string | null) => {
    setSubmitting(true);
    setError(null);
    try {
      const token = v2Token || (await recaptcha.execute());
      const payload = { ...buildPayload(v2Token), recaptchaToken: token };
      const res = await fetch("/api/pickups/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data?.challenge === "v2-required" && !v2Token) {
          setNeedV2(true);
          setError(
            "One more check needed before we book this pickup. Tick the box below and confirm again."
          );
          return;
        }
        setError(data?.error || "We could not schedule this pickup. Please try again.");
        return;
      }
      const confirmation = {
        ref: data.ref,
        name: wizard.name,
        accountType: wizard.accountType,
        date: wizard.date,
        slot: wizard.slot,
        zone: wizard.zone,
        address: wizard.address,
        gateNotes: wizard.gateNotes,
        materials: selectedLines,
        estimatedPoints: data.estimatedPoints,
      };
      try {
        window.sessionStorage.setItem(
          SITE.lastPickupKey,
          JSON.stringify(confirmation)
        );
      } catch {
        /* private mode */
      }
      wizard.reset();
      router.push(`/schedule-confirmation?ref=${encodeURIComponent(data.ref)}`);
    } catch {
      setError("Network problem. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-lg-10">
        <div className="ng-chart-card">
          <div className="d-flex flex-wrap justify-content-between mb-4">
            {STEP_LABELS.map((label, index) => (
              <div key={label} className="d-flex align-items-center mr-3 mb-2">
                <span
                  className={`ng-step-dot${
                    index === wizard.step
                      ? " active"
                      : index < wizard.step
                        ? " done"
                        : ""
                  }`}
                >
                  {index < wizard.step ? <CheckCircle2 size={16} /> : index + 1}
                </span>
                <span className="ml-2" style={{ fontSize: 13, color: "#33313b" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={wizard.step}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              {wizard.step === 0 ? (
                <div>
                  <h3 className="h4 mb-3" style={{ color: "#33313b" }}>
                    Who is scheduling this pickup?
                  </h3>
                  <div className="row">
                    {(["household", "business"] as const).map((type) => (
                      <div className="col-md-6 mb-3" key={type}>
                        <button
                          type="button"
                          className="ng-material-card w-100 text-left"
                          style={
                            wizard.accountType === type
                              ? { borderColor: "#2b98f0", borderWidth: 2 }
                              : undefined
                          }
                          onClick={() => wizard.setAccountType(type)}
                        >
                          <strong className="d-block mb-2" style={{ color: "#33313b" }}>
                            {type === "household" ? "Household" : "Business"}
                          </strong>
                          <span style={{ fontSize: 14, color: "#808080" }}>
                            {type === "household"
                              ? "Free collection for registered homes in our coverage zones."
                              : "Bulk collection with a monthly invoice and one account manager."}
                          </span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {wizard.step === 1 ? (
                <div>
                  <h3 className="h4 mb-3" style={{ color: "#33313b" }}>
                    What should we collect? Add an estimated kg per material.
                  </h3>
                  <div className="row">
                    {MATERIALS.map((material) => {
                      const kg = wizard.materials[material.code] || 0;
                      return (
                        <div className="col-md-6 mb-3" key={material.code}>
                          <div
                            className="ng-material-card d-flex align-items-center justify-content-between"
                            style={{ ["--ng-card-accent" as never]: material.color }}
                          >
                            <div>
                              <strong style={{ color: "#33313b" }}>{material.name}</strong>
                              <div style={{ fontSize: 12, color: "#6c757d" }}>
                                {material.binLabel}
                              </div>
                            </div>
                            <div className="d-flex align-items-center">
                              <input
                                type="number"
                                min={0}
                                max={2000}
                                step={0.5}
                                className="form-control ng-kg-input mr-2"
                                placeholder="kg"
                                value={kg || ""}
                                aria-label={`Estimated kilograms of ${material.name}`}
                                onChange={(e) =>
                                  wizard.setMaterialKg(
                                    material.code,
                                    Number(e.target.value) || 0
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="ng-print-note">
                    Estimated reward for this pickup:{" "}
                    <strong>{points} points</strong>
                  </p>
                </div>
              ) : null}

              {wizard.step === 2 ? (
                <div>
                  <h3 className="h4 mb-3" style={{ color: "#33313b" }}>
                    Pick a date and a two hour slot
                  </h3>
                  <div className="form-group">
                    <label htmlFor="ng-date">Pickup date</label>
                    <input
                      id="ng-date"
                      type="date"
                      className="form-control"
                      min={todayIso()}
                      value={wizard.date}
                      onChange={(e) => wizard.setField("date", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Time slot</label>
                    <div className="d-flex flex-wrap">
                      {TIME_SLOTS.map((slot) => (
                        <button
                          type="button"
                          key={slot}
                          className={`btn mr-2 mb-2 ${
                            wizard.slot === slot ? "btn-primary" : "btn-outline-primary"
                          }`}
                          onClick={() => wizard.setField("slot", slot)}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {wizard.step === 3 ? (
                <div>
                  <h3 className="h4 mb-3" style={{ color: "#33313b" }}>
                    Where are we coming?
                  </h3>
                  <div className="form-group">
                    <label htmlFor="ng-zone">Coverage zone</label>
                    <select
                      id="ng-zone"
                      className="form-control"
                      value={wizard.zone}
                      onChange={(e) => wizard.setField("zone", e.target.value)}
                    >
                      <option value="">Select your zone</option>
                      {COVERAGE_ZONES.map((zone) => (
                        <option key={zone} value={zone}>
                          {zone}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="ng-address">Street address or estate name</label>
                    <textarea
                      id="ng-address"
                      className="form-control"
                      rows={2}
                      value={wizard.address}
                      placeholder="House number, street, estate, nearest landmark"
                      onChange={(e) => wizard.setField("address", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="ng-gate">Gate access notes</label>
                    <textarea
                      id="ng-gate"
                      className="form-control"
                      rows={2}
                      value={wizard.gateNotes}
                      placeholder="Gate code, call the caretaker, ask for mama mboga next door"
                      onChange={(e) => wizard.setField("gateNotes", e.target.value)}
                    />
                  </div>
                </div>
              ) : null}

              {wizard.step === 4 ? (
                <div>
                  <h3 className="h4 mb-3" style={{ color: "#33313b" }}>
                    Who should we talk to on pickup day?
                  </h3>
                  {session?.user?.email ? (
                    <p className="ng-print-note">
                      Signed in as {session.user.email}. We prefill your contact
                      details from your account.
                    </p>
                  ) : null}
                  <div className="form-group">
                    <label htmlFor="ng-name">Full name</label>
                    <input
                      id="ng-name"
                      className="form-control"
                      value={wizard.name}
                      onChange={(e) => wizard.setField("name", e.target.value)}
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="ng-phone">Phone number</label>
                        <input
                          id="ng-phone"
                          className="form-control"
                          placeholder="+2547..."
                          value={wizard.phone}
                          onChange={(e) => wizard.setField("phone", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="ng-email">Email address</label>
                        <input
                          id="ng-email"
                          type="email"
                          className="form-control"
                          value={wizard.email}
                          onChange={(e) => wizard.setField("email", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {wizard.step === 5 ? (
                <div>
                  <h3 className="h4 mb-3" style={{ color: "#33313b" }}>
                    Review and confirm
                  </h3>
                  <div className="ng-review-row">
                    <span>Account type</span>
                    <strong>{wizard.accountType}</strong>
                  </div>
                  <div className="ng-review-row">
                    <span>Materials</span>
                    <strong>
                      {selectedLines
                        .map((l) => `${materialByCode(l.code)?.name} ${l.kg}kg`)
                        .join(", ")}
                    </strong>
                  </div>
                  <div className="ng-review-row">
                    <span>Date and slot</span>
                    <strong>
                      {wizard.date}, {wizard.slot}
                    </strong>
                  </div>
                  <div className="ng-review-row">
                    <span>Address</span>
                    <strong>
                      {wizard.zone}, {wizard.address}
                    </strong>
                  </div>
                  {wizard.gateNotes ? (
                    <div className="ng-review-row">
                      <span>Gate notes</span>
                      <strong>{wizard.gateNotes}</strong>
                    </div>
                  ) : null}
                  <div className="ng-review-row">
                    <span>Contact</span>
                    <strong>
                      {wizard.name}, {wizard.phone}, {wizard.email}
                    </strong>
                  </div>
                  <div className="ng-review-row">
                    <span>Estimated points</span>
                    <strong>{points} points</strong>
                  </div>
                  <p className="ng-print-note mt-3">
                    No payment is needed now. Registered households collect
                    free. Businesses receive a monthly invoice after weighing.
                  </p>
                  {needV2 ? (
                    <div className="form-group">
                      <div ref={(el) => { v2Host.current = el; recaptcha.renderV2Fallback(el); }} />
                    </div>
                  ) : null}
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>

          {error ? (
            <p className="mt-3 mb-0" style={{ color: "#dc3545", fontSize: 14 }}>
              {error}
            </p>
          ) : null}

          <div className="d-flex justify-content-between mt-4">
            <button
              type="button"
              className="btn btn-outline-primary"
              disabled={wizard.step === 0 || submitting}
              onClick={() => wizard.setStep(wizard.step - 1)}
            >
              <ArrowLeft size={14} className="mr-1" /> Back
            </button>
            {wizard.step < 5 ? (
              <button
                type="button"
                className="btn btn-primary"
                disabled={!canNext()}
                onClick={() => wizard.setStep(wizard.step + 1)}
              >
                Next <ArrowRight size={14} className="ml-1" />
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                disabled={submitting}
                onClick={() => {
                  if (needV2) submit(recaptcha.consumeV2Token());
                  else submit(null);
                }}
              >
                {submitting ? (
                  <>
                    <Loader2 size={14} className="mr-1" /> Booking pickup
                  </>
                ) : (
                  "Confirm Pickup"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
