import { Suspense } from "react";
import { SignUpForm } from "@/components/auth/AuthForms";

export const metadata = {
  title: "Join the Programme",
};

export default function SignUpPage() {
  return (
    <section className="ftco-section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-9 col-lg-6">
            <div className="text-center mb-4">
              <span
                className="subheading d-block"
                style={{ color: "#2b98f0", fontSize: 12, letterSpacing: 1, textTransform: "uppercase" }}
              >
                Join the programme
              </span>
              <h1 className="mb-2" style={{ color: "#33313b" }}>
                Create your Noah Green account
              </h1>
              <p style={{ color: "#808080", fontSize: 14 }}>
                Free for households. Two minutes now, points for every
                kilogram forever.
              </p>
            </div>
            <Suspense fallback={<div className="ng-chart-card">Loading signup...</div>}>
              <SignUpForm />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}
