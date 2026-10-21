export interface RecaptchaResult {
  ok: boolean;
  score: number;
  skipped: boolean;
  challenge?: string;
}

export const RECAPTCHA_MIN_SCORE = 0.5;

/**
 * Server side reCAPTCHA verification.
 * v3 scores below RECAPTCHA_MIN_SCORE ask the client for a v2 checkbox
 * challenge. When no secret is configured (local development) verification
 * is skipped explicitly instead of silently passing.
 */
export async function verifyRecaptcha(
  token: string | null | undefined,
  expectedAction?: string
): Promise<RecaptchaResult> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    return { ok: true, score: 1, skipped: true };
  }
  if (!token) {
    return { ok: false, score: 0, skipped: false, challenge: "missing-token" };
  }
  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
      cache: "no-store",
    });
    const data = (await res.json()) as {
      success: boolean;
      score?: number;
      action?: string;
      "error-codes"?: string[];
    };
    if (!data.success) {
      return {
        ok: false,
        score: 0,
        skipped: false,
        challenge: (data["error-codes"] || []).join(",") || "verify-failed",
      };
    }
    const score = typeof data.score === "number" ? data.score : 1;
    const actionOk =
      !expectedAction || !data.action || data.action === expectedAction;
    if (!actionOk) {
      return { ok: false, score, skipped: false, challenge: "action-mismatch" };
    }
    if (score < RECAPTCHA_MIN_SCORE) {
      return { ok: false, score, skipped: false, challenge: "v2-required" };
    }
    return { ok: true, score, skipped: false };
  } catch (err) {
    console.error("[noah-green:recaptcha] verify error", err);
    return { ok: false, score: 0, skipped: false, challenge: "network-error" };
  }
}
