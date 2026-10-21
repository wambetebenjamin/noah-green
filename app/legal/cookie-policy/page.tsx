import { SITE } from "@/lib/constants";

export const metadata = {
  title: "Cookie Policy",
};

const TABLE = [
  {
    category: "Necessary",
    key: "next-auth.session-token and related",
    purpose: "Keeps you signed in and protects forms from abuse. Always on.",
    duration: "30 days",
  },
  {
    category: "Necessary",
    key: SITE.consentKey,
    purpose: "Stores your cookie choices in this browser only.",
    duration: "12 months",
  },
  {
    category: "Functional",
    key: SITE.voiceTourKey + " and draft schedule keys",
    purpose: "Remembers the voice tour playback and unsent schedule drafts.",
    duration: "Session",
  },
  {
    category: "Analytics",
    key: "Vercel Analytics and Speed Insights identifiers",
    purpose: "Anonymous page views and performance, only with your consent.",
    duration: "Session",
  },
  {
    category: "Marketing",
    key: "Campaign measurement identifiers",
    purpose: "Measures clean up drive outreach, only with your consent.",
    duration: "90 days",
  },
];

export default function CookiePolicyPage() {
  return (
    <section className="ftco-section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-9 ng-legal">
            <span
              className="subheading d-block"
              style={{ color: "#2b98f0", fontSize: 12, letterSpacing: 1, textTransform: "uppercase" }}
            >
              Legal
            </span>
            <h1 className="mb-3" style={{ color: "#33313b" }}>
              Cookie Policy
            </h1>
            <p>
              Last updated 21 October 2026. We keep storage minimal and honest.
              Consent is recorded under the localStorage key{" "}
              <code>{SITE.consentKey}</code> and handled under the Kenya Data
              Protection Act 2019.
            </p>
            <h2>What we store and why</h2>
            <div className="table-responsive">
              <table className="ng-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Key or cookie</th>
                    <th>Purpose</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {TABLE.map((row) => (
                    <tr key={`${row.category}-${row.key}`}>
                      <td>{row.category}</td>
                      <td>{row.key}</td>
                      <td>{row.purpose}</td>
                      <td>{row.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h2>How to change your mind</h2>
            <p>
              Open the cookie banner again by clearing the{" "}
              <code>{SITE.consentKey}</code> entry in your browser storage, or
              ask us at {SITE.email} and we will walk you through it on a
              WhatsApp call. Turning a category off stops future collection
              immediately and never affects pickups already booked.
            </p>
            <h2>Third parties</h2>
            <p>
              Google reCAPTCHA sets its own fraud prevention cookies when a
              form is submitted. Pexels image delivery sets no tracking
              cookies on our pages. Vercel processes analytics in a way that
              does not fingerprint individual browsers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
