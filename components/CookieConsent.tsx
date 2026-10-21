"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { SITE } from "@/lib/constants";

export interface ConsentState {
  necessary: true;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
}

export const CONSENT_EVENT = "ng-consent-change";

export function readConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SITE.consentKey);
    if (!raw) return null;
    return JSON.parse(raw) as ConsentState;
  } catch {
    return null;
  }
}

export function writeConsent(state: ConsentState): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SITE.consentKey, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: state }));
}

const DEFAULTS: ConsentState = {
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
  updatedAt: "",
};

/**
 * Cookie consent banner and preferences modal.
 * Kenya Data Protection Act 2019: consent is specific, informed, freely
 * given and revocable. Stored under localStorage key noah_green_consent.
 */
export default function CookieConsent() {
  const [consent, setConsent] = useState<ConsentState | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [draft, setDraft] = useState<ConsentState>(DEFAULTS);

  useEffect(() => {
    setConsent(readConsent());
  }, []);

  const save = (state: ConsentState) => {
    const next = { ...state, necessary: true as const, updatedAt: new Date().toISOString() };
    writeConsent(next);
    setConsent(next);
    setModalOpen(false);
  };

  if (consent) return null;

  return (
    <>
      <div className="ng-cookie-banner" role="region" aria-label="Cookie consent">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 mb-3 mb-lg-0">
              <p className="mb-0" style={{ fontSize: 14, color: "#33313b" }}>
                <strong>We value your privacy.</strong> Noah Green uses cookies
                and similar storage to keep your account working, measure our
                recycling impact and, with your permission, improve the
                platform. Your choices are handled under the Kenya Data
                Protection Act 2019. Read our{" "}
                <Link href="/legal/cookie-policy">Cookie Policy</Link> and{" "}
                <Link href="/legal/privacy-policy">Privacy Policy</Link>.
              </p>
            </div>
            <div className="col-lg-4 d-flex flex-wrap justify-content-lg-end">
              <button
                type="button"
                className="btn btn-primary py-2 px-4 mr-2 mb-2 mb-md-0"
                onClick={() =>
                  save({ ...DEFAULTS, functional: true, analytics: true, marketing: true })
                }
              >
                Accept All
              </button>
              <button
                type="button"
                className="btn btn-outline-primary py-2 px-4"
                onClick={() => {
                  setDraft(DEFAULTS);
                  setModalOpen(true);
                }}
              >
                Manage Preferences
              </button>
            </div>
          </div>
        </div>
      </div>

      {modalOpen ? (
        <div
          className="ng-cookie-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Cookie preferences"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <div className="ng-cookie-modal">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <span className="subheading" style={{ color: "#2b98f0", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>
                  Cookie preferences
                </span>
                <h3 className="mb-0" style={{ color: "#33313b" }}>
                  Manage your consent
                </h3>
              </div>
              <button
                type="button"
                className="btn btn-link p-0"
                aria-label="Close preferences"
                onClick={() => setModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="ng-switch-row">
              <div>
                <strong style={{ color: "#33313b" }}>Necessary</strong>
                <p className="mb-0" style={{ fontSize: 14 }}>
                  Session, security and consent storage. Always on, as
                  required by the Kenya Data Protection Act 2019.
                </p>
              </div>
              <label className="ng-switch">
                <input type="checkbox" checked disabled aria-label="Necessary cookies, locked" />
                <span className="ng-slider"></span>
              </label>
            </div>

            <div className="ng-switch-row">
              <div>
                <strong style={{ color: "#33313b" }}>Functional</strong>
                <p className="mb-0" style={{ fontSize: 14 }}>
                  Remembers your zone, draft schedules and voice tour choice.
                </p>
              </div>
              <label className="ng-switch">
                <input
                  type="checkbox"
                  checked={draft.functional}
                  onChange={(e) => setDraft({ ...draft, functional: e.target.checked })}
                  aria-label="Functional cookies"
                />
                <span className="ng-slider"></span>
              </label>
            </div>

            <div className="ng-switch-row">
              <div>
                <strong style={{ color: "#33313b" }}>Analytics</strong>
                <p className="mb-0" style={{ fontSize: 14 }}>
                  Anonymous usage and performance signals via Vercel Analytics
                  and Speed Insights.
                </p>
              </div>
              <label className="ng-switch">
                <input
                  type="checkbox"
                  checked={draft.analytics}
                  onChange={(e) => setDraft({ ...draft, analytics: e.target.checked })}
                  aria-label="Analytics cookies"
                />
                <span className="ng-slider"></span>
              </label>
            </div>

            <div className="ng-switch-row" style={{ borderBottom: "none" }}>
              <div>
                <strong style={{ color: "#33313b" }}>Marketing</strong>
                <p className="mb-0" style={{ fontSize: 14 }}>
                  Measures outreach campaigns for county clean up drives.
                  Off by default.
                </p>
              </div>
              <label className="ng-switch">
                <input
                  type="checkbox"
                  checked={draft.marketing}
                  onChange={(e) => setDraft({ ...draft, marketing: e.target.checked })}
                  aria-label="Marketing cookies"
                />
                <span className="ng-slider"></span>
              </label>
            </div>

            <div className="d-flex justify-content-end mt-3">
              <button
                type="button"
                className="btn btn-outline-primary py-2 px-4 mr-2"
                onClick={() => save({ ...DEFAULTS })}
              >
                Reject Optional
              </button>
              <button
                type="button"
                className="btn btn-primary py-2 px-4"
                onClick={() => save(draft)}
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
