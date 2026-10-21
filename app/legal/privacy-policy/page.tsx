import Link from "next/link";
import { SITE } from "@/lib/constants";

export const metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPolicyPage() {
  return (
    <section className="ftco-section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 ng-legal">
            <span
              className="subheading d-block"
              style={{ color: "#2b98f0", fontSize: 12, letterSpacing: 1, textTransform: "uppercase" }}
            >
              Legal
            </span>
            <h1 className="mb-3" style={{ color: "#33313b" }}>
              Privacy Policy
            </h1>
            <p>
              Last updated 21 October 2026. This policy explains how Noah
              Green collects, uses and protects personal data, in line with
              the Kenya Data Protection Act 2019.
            </p>
            <h2>Who we are</h2>
            <p>
              Noah Green is a waste collection, sorting and recycling platform
              operating in Nairobi, Kenya. Our registered contact point is{" "}
              {SITE.address}, and our data protection contact is{" "}
              {SITE.email}.
            </p>
            <h2>What we collect</h2>
            <p>
              Account data: name, email address, phone number and password
              hash. Pickup data: address, zone, gate access notes, materials
              and weights. Usage data: pages visited and performance signals,
              only where you consent to analytics cookies. Corporate enquiry
              data: organisation, contact person, work email, phone and volume
              estimates.
            </p>
            <h2>Why we collect it</h2>
            <p>
              To schedule and complete pickups, to credit reward points, to
              send service messages you asked for, to meet county waste
              reporting rules, and to improve routes and sorting guidance.
              Every purpose maps to a lawful basis under the Act: performance
              of our service contract with you, your consent for marketing
              and analytics, or our legitimate interest in running a safe
              collection operation.
            </p>
            <h2>Who we share it with</h2>
            <p>
              Only with processors who help us operate: hosting on Vercel,
              email delivery through our SMTP provider, payment of M-Pesa
              redemptions through our licensed payout partner, and tree
              planting partners who receive first names only. We never sell
              personal data.
            </p>
            <h2>How long we keep it</h2>
            <p>
              Account and pickup records are kept while your account is open
              and for seven years after closure, to satisfy tax and county
              waste reporting rules. Marketing consents are kept until you
              withdraw them.
            </p>
            <h2>Your rights</h2>
            <p>
              You may access, correct, export or delete your data, object to
              processing, and withdraw consent at any time, without affecting
              past processing. Write to {SITE.email} or WhatsApp +254 112 272
              061 and we will respond within thirty days, as the Act requires.
              You also have the right to lodge a complaint with the Office of
              the Data Protection Commissioner.
            </p>
            <h2>Security</h2>
            <p>
              Data travels over TLS only, passwords are hashed, secrets live
              in environment variables and never in client code, and access
              to production data is limited to two named staff.
            </p>
            <h2>Cookies</h2>
            <p>
              See our <Link href="/legal/cookie-policy">Cookie Policy</Link>{" "}
              for the full list of storage we use and how to control it.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
