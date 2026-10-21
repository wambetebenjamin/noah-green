import { Suspense } from "react";
import { SignInForm } from "@/components/auth/AuthForms";

export const metadata = {
  title: "Sign In",
};

export default function SignInPage() {
  return (
    <section className="ftco-section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-5">
            <div className="text-center mb-4">
              <span
                className="subheading d-block"
                style={{ color: "#2b98f0", fontSize: 12, letterSpacing: 1, textTransform: "uppercase" }}
              >
                Member area
              </span>
              <h1 className="mb-2" style={{ color: "#33313b" }}>
                Sign in to Noah Green
              </h1>
              <p style={{ color: "#808080", fontSize: 14 }}>
                Track points, pickups and your personal impact.
              </p>
            </div>
            <Suspense fallback={<div className="ng-chart-card">Loading sign in...</div>}>
              <SignInForm />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}
