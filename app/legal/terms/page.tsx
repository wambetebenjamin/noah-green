import Link from "next/link";
import { SITE } from "@/lib/constants";

export const metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
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
              Terms of Service
            </h1>
            <p>
              Last updated 21 October 2026. By creating an account or
              scheduling a pickup you agree to these terms.
            </p>
            <h2>The service</h2>
            <p>
              Noah Green collects sorted recyclable and organic waste from
              registered households and businesses inside our coverage zones.
              Collection for registered households is free. Businesses are
              invoiced monthly according to their contract tier.
            </p>
            <h2>Your responsibilities</h2>
            <p>
              Sort materials into the colour coded categories described in the{" "}
              <Link href="/sort-guide">Sorting Guide</Link>. Present materials
              at the agreed time and place. Do not present hazardous waste,
              medical waste, pressurised canisters or construction rubble.
              Keep gate access notes accurate so our team can reach you
              safely.
            </p>
            <h2>Weighing and points</h2>
            <p>
              Points are credited from weighed kilograms at the published
              rates. Points have no cash value until redeemed, are not
              transferable for cash outside the M-Pesa redemption flow, and
              may be corrected if a weighing error is proven.
            </p>
            <h2>Scheduling and cancellations</h2>
            <p>
              Pickups can be cancelled from My Account up to twelve hours
              before the slot. Repeated missed pickups without notice may
              pause household scheduling for thirty days.
            </p>
            <h2>Business contracts</h2>
            <p>
              Corporate tiers and pricing ranges on the corporate page are
              indicative. A signed contract with a site survey governs every
              business account.
            </p>
            <h2>Fair use</h2>
            <p>
              Do not abuse the platform with false pickups, automated account
              creation or attempts to redeem points from waste you did not
              sort. We may suspend accounts that do, with written reasons.
            </p>
            <h2>Liability</h2>
            <p>
              We carry public liability insurance for collection operations.
              Our total liability for any claim is limited to the value of
              points on the affected account in the preceding three months,
              except where the law forbids a limit.
            </p>
            <h2>Changes and contact</h2>
            <p>
              We may update these terms with thirty days notice by email.
              Questions go to {SITE.email} or WhatsApp +254 112 272 061. See
              also our <Link href="/legal/privacy-policy">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
