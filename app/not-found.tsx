import Link from "next/link";
import { Leaf } from "lucide-react";

export const metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <section className="ftco-section ng-error-wrap">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <span
              className="ng-material-icon mx-auto"
              style={{ background: "#28a745" }}
            >
              <Leaf size={28} aria-hidden="true" />
            </span>
            <span
              className="subheading d-block mt-4"
              style={{ color: "#2b98f0", fontSize: 12, letterSpacing: 1, textTransform: "uppercase" }}
            >
              Error 404
            </span>
            <h1 className="mb-3" style={{ color: "#33313b" }}>
              This page was not sorted correctly.
            </h1>
            <p style={{ color: "#808080" }}>
              The link you followed may have been moved to another bin, or the
              page no longer exists. Let us get you back to clean streets.
            </p>
            <Link href="/" className="btn btn-primary py-3 px-4">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
