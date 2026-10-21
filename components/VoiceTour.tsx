"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { SITE } from "@/lib/constants";

const SCRIPT =
  "Welcome to Noah Green. We make recycling easy for Nairobi homes and businesses. " +
  "Sign up, schedule a pickup online, sort your paper, plastic, glass, and metal before we arrive, " +
  "and earn reward points for every kilogram you recycle. Redeem your points for M-Pesa cash, " +
  "partner discounts, or have a tree planted in your name. Together we can keep Nairobi clean. " +
  "Join the programme today.";

type Phase = "idle" | "speaking" | "muted" | "ended";

/**
 * Site voice tour. Web Speech API, en-KE, rate 0.95, pitch 1.1.
 * Never autoplays before a user interaction: it arms on the first scroll or
 * click of the session, then speaks once.
 */
export default function VoiceTour() {
  const [phase, setPhase] = useState<Phase>("idle");
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const supported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  const speak = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(SCRIPT);
    utterance.rate = 0.95;
    utterance.pitch = 1.1;
    utterance.lang = "en-KE";
    utterance.onend = () => setPhase("ended");
    utterance.onerror = () => setPhase("ended");
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setPhase("speaking");
  }, [supported]);

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setPhase("muted");
  }, [supported]);

  useEffect(() => {
    if (!supported) return;
    let armed = false;
    const arm = () => {
      if (armed) return;
      armed = true;
      window.removeEventListener("scroll", arm);
      window.removeEventListener("click", arm);
      try {
        const played = window.sessionStorage.getItem(SITE.voiceTourKey);
        if (played) {
          setPhase("ended");
          return;
        }
        window.sessionStorage.setItem(SITE.voiceTourKey, "1");
      } catch {
        /* storage unavailable, still allow the tour */
      }
      setTimeout(speak, 350);
    };
    window.addEventListener("scroll", arm, { passive: true });
    window.addEventListener("click", arm);
    return () => {
      window.removeEventListener("scroll", arm);
      window.removeEventListener("click", arm);
      window.speechSynthesis.cancel();
    };
  }, [speak, supported]);

  const handleClick = () => {
    if (phase === "speaking") {
      stop();
      return;
    }
    speak();
  };

  if (!supported) {
    /* Speech synthesis missing: still show the control, muted and inert. */
    return (
      <button
        type="button"
        className="ng-fab ng-fab-voice"
        data-tooltip="Hear what this site is about"
        aria-label="Site voice tour, click to mute"
      >
        <VolumeX size={26} aria-hidden="true" />
      </button>
    );
  }

  const speaking = phase === "speaking";
  const label =
    phase === "ended"
      ? "Replay tour"
      : speaking
        ? "Site voice tour, click to mute"
        : phase === "muted"
          ? "Site voice tour, click to replay"
          : "Hear what this site is about";
  const tooltip = phase === "ended" ? "Replay tour" : "Hear what this site is about";

  return (
    <button
      type="button"
      className={`ng-fab ng-fab-voice${speaking ? " speaking" : ""}`}
      onClick={handleClick}
      data-tooltip={tooltip}
      aria-label={label}
      title={label}
    >
      {speaking ? (
        <Volume2 size={26} aria-hidden="true" />
      ) : (
        <VolumeX size={26} aria-hidden="true" />
      )}
    </button>
  );
}
