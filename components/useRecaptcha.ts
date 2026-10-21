"use client";

import { useCallback, useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, opts: { action: string }) => Promise<string>;
      render: (
        element: string | HTMLElement,
        opts: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
        }
      ) => number;
      reset: (widgetId?: number) => void;
    };
    ngRecaptchaLoaded?: boolean;
    ngRecaptchaQueue?: (() => void)[];
  }
}

function loadScript(siteKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("no-window"));
      return;
    }
    if (window.grecaptcha) {
      resolve();
      return;
    }
    const queue = window.ngRecaptchaQueue || (window.ngRecaptchaQueue = []);
    queue.push(resolve);
    if (window.ngRecaptchaLoaded) return;
    window.ngRecaptchaLoaded = true;
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.onerror = () => reject(new Error("recaptcha-load-failed"));
    script.onload = () => {
      const pending = window.ngRecaptchaQueue || [];
      window.ngRecaptchaQueue = [];
      pending.forEach((fn) => fn());
    };
    document.head.appendChild(script);
  });
}

/**
 * Invisible reCAPTCHA v3 for all user facing forms, with a v2 checkbox
 * fallback rendered when the server scores a submission below 0.5.
 */
export function useRecaptcha(action: string) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";
  const [v2Widget, setV2Widget] = useState<number | null>(null);
  const v2Token = useRef<string | null>(null);
  const v2Host = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!siteKey) return;
    loadScript(siteKey).catch(() => {
      /* offline environments simply skip captcha */
    });
  }, [siteKey]);

  const execute = useCallback(async (): Promise<string | null> => {
    if (!siteKey || typeof window === "undefined" || !window.grecaptcha) {
      return null;
    }
    try {
      await loadScript(siteKey);
      return await new Promise<string>((resolve, reject) => {
        window.grecaptcha?.ready(() => {
          window
            .grecaptcha!.execute(siteKey, { action })
            .then(resolve)
            .catch(reject);
        });
      });
    } catch {
      return null;
    }
  }, [action, siteKey]);

  const renderV2Fallback = useCallback(
    (host: HTMLDivElement | null) => {
      v2Host.current = host;
      if (!host || !siteKey || typeof window === "undefined") return;
      const boot = () => {
        window.grecaptcha?.ready(() => {
          if (!window.grecaptcha?.render || v2Widget !== null) return;
          const id = window.grecaptcha.render(host, {
            sitekey: siteKey,
            callback: (token: string) => {
              v2Token.current = token;
            },
            "expired-callback": () => {
              v2Token.current = null;
            },
          });
          setV2Widget(id);
        });
      };
      loadScript(siteKey)
        .then(boot)
        .catch(() => undefined);
    },
    [siteKey, v2Widget]
  );

  const consumeV2Token = useCallback((): string | null => {
    const token = v2Token.current;
    v2Token.current = null;
    if (v2Widget !== null && typeof window !== "undefined" && window.grecaptcha) {
      window.grecaptcha.reset(v2Widget);
    }
    return token;
  }, [v2Widget]);

  return { siteKey, execute, renderV2Fallback, consumeV2Token, hasV2: v2Widget !== null };
}
