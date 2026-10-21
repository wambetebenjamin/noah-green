"use client";

export default function TryAgainButton() {
  return (
    <button
      type="button"
      className="btn btn-primary py-3 px-4 mr-3 mb-2"
      onClick={() => window.location.reload()}
    >
      Try Again
    </button>
  );
}
