"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/constants";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[noah-green] page error", error);
  }, [error]);

  return (
    <section className="ftco-section ng-error-wrap">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <span className="ng-material-icon mx-auto" style={{ background: "#dc3545" }}>
              <AlertTriangle size={28} aria-hidden="true" />
            </span>
            <span
              className="subheading d-block mt-4"
              style={{ color: "#2b98f0", fontSize: 12, letterSpacing: 1, textTransform: "uppercase" }}
            >
              Error 500
            </span>
            <h1 className="mb-3" style={{ color: "#33313b" }}>
              Our sorting line jammed for a moment.
            </h1>
            <p style={{ color: "#808080" }}>
              Something went wrong on our side. Try again, and if the problem
              stays, talk to a human on WhatsApp at +254 112 272 061.
            </p>
            <div className="d-flex justify-content-center flex-wrap">
              <button type="button" className="btn btn-primary py-3 px-4 mr-3 mb-2" onClick={reset}>
                Try Again
              </button>
              <Link
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-primary py-3 px-4 mb-2"
              >
                WhatsApp +254 112 272 061
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
