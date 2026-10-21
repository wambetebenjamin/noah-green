import {
  Cpu,
  Leaf,
  Milk,
  Newspaper,
  Shirt,
  Drum,
  Wine,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import GuideDownload from "@/components/sortguide/GuideDownload";
import { MATERIALS, pointsPerKg } from "@/lib/materials";
import type { MaterialCode } from "@/lib/materials";
import { GUIDE_EXTRA } from "@/lib/sort-guide-copy";
import { IMAGES, layeredBg } from "@/lib/images";

const ICONS: Record<MaterialCode, typeof Leaf> = {
  paper: Newspaper,
  plastic: Milk,
  glass: Wine,
  metal: Drum,
  ewaste: Cpu,
  organic: Leaf,
  textiles: Shirt,
};

export const metadata = {
  title: "Sorting Guide",
  description:
    "Plain Kenyan English sorting guide: what goes in, what does not, common mistakes and why each stream matters.",
};

export default function SortGuidePage() {
  return (
    <>
      <div
        className="hero-wrap hero-wrap-2 ng-hero-2"
        style={{ backgroundImage: layeredBg(IMAGES.recyclingBins.remote, IMAGES.recyclingBins.local) }}
        data-stellar-background-ratio="0.5"
      >
        <div className="overlay"></div>
        <div className="container">
          <div className="row no-gutters slider-text align-items-center justify-content-start">
            <div className="col-md-8 ftco-animate">
              <h2 className="subheading">Sorting guide</h2>
              <h1 className="mb-3">Sort right, earn right</h1>
              <p>One stream per bin, one page per material, plain language throughout.</p>
            </div>
          </div>
        </div>
      </div>

      <section className="ftco-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <p className="ng-print-note mb-4">
                Want this on the fridge or the store room wall?{" "}
                <GuideDownload />
              </p>

              {MATERIALS.map((material, index) => {
                const Icon = ICONS[material.code];
                const copy = GUIDE_EXTRA[material.code];
                return (
                  <Reveal key={material.code} delay={0.05 * index}>
                    <div className="ng-material-card mb-4" style={{ ["--ng-card-accent" as never]: material.color }}>
                      <div className="d-flex align-items-center mb-3">
                        <div className="ng-material-icon mb-0 mr-3">
                          <Icon size={24} aria-hidden="true" />
                        </div>
                        <div>
                          <h2 className="h4 mb-1" style={{ color: "#33313b" }}>
                            {material.name}
                          </h2>
                          <span style={{ fontSize: 13, color: "#6c757d" }}>
                            {material.binLabel} | {pointsPerKg(material.code)} points per kg
                          </span>
                        </div>
                      </div>
                      <p style={{ color: "#808080", fontSize: 15 }}>{copy.intro}</p>
                      <div className="row">
                        <div className="col-md-6">
                          <strong style={{ fontSize: 13, color: "#28a745", textTransform: "uppercase", letterSpacing: 1 }}>
                            What goes in
                          </strong>
                          <ul className="ng-accept-list list-unstyled mt-2">
                            {material.accepted.map((line) => (
                              <li key={line}>{line}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="col-md-6">
                          <strong style={{ fontSize: 13, color: "#dc3545", textTransform: "uppercase", letterSpacing: 1 }}>
                            What does not go in
                          </strong>
                          <ul className="ng-reject-list list-unstyled mt-2">
                            {material.rejected.map((line) => (
                              <li key={line}>{line}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <strong style={{ fontSize: 13, color: "#33313b", textTransform: "uppercase", letterSpacing: 1 }}>
                        Common mistakes
                      </strong>
                      <p className="mb-2" style={{ color: "#808080", fontSize: 15 }}>
                        {copy.mistakes}
                      </p>
                      <strong style={{ fontSize: 13, color: "#33313b", textTransform: "uppercase", letterSpacing: 1 }}>
                        Why it matters
                      </strong>
                      <p className="mb-0" style={{ color: "#808080", fontSize: 15 }}>
                        {copy.why}
                      </p>
                    </div>
                  </Reveal>
                );
              })}

              <p className="text-center mb-0">
                <GuideDownload />
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
