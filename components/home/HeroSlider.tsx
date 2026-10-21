"use client";

import { useEffect, useState } from "react";
import { IMAGES, layeredBg } from "@/lib/images";

const SLIDES = [
  {
    bg: layeredBg(IMAGES.heroSorting.remote, IMAGES.heroSorting.local),
    label: "Sorting recyclables on an East African street",
  },
  {
    bg: layeredBg(IMAGES.nairobiAerial.remote, IMAGES.nairobiAerial.local),
    label: "Nairobi skyline with skyscrapers and highways",
  },
  {
    bg: layeredBg(IMAGES.recyclingBins.remote, IMAGES.recyclingBins.local),
    label: "Colour coded recycling bins for paper, plastic, metal and glass",
  },
];

/**
 * Transitioning hero pictures: a slow crossfade between three Pexels scenes,
 * with manual dots. Honours prefers-reduced-motion by staying on slide one.
 */
export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {SLIDES.map((slide, i) => (
        <div
          key={slide.label}
          className={`ng-hero-slide${i === index ? " active" : ""}`}
          style={{ backgroundImage: slide.bg }}
          aria-hidden={i !== index}
        />
      ))}
      <div className="ng-hero-dots" aria-label="Hero images">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.label}
            type="button"
            className={i === index ? "active" : ""}
            aria-label={`Show hero image ${i + 1}: ${slide.label}`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </>
  );
}
