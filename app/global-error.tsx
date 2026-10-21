"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "Roboto, Arial, sans-serif", padding: 48, textAlign: "center" }}>
        <h1 style={{ color: "#33313b" }}>Error 500</h1>
        <p style={{ color: "#808080" }}>
          Our sorting line jammed for a moment. Please try again.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            background: "#2b98f0",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            padding: "12px 24px",
            textTransform: "uppercase",
            letterSpacing: 1,
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
