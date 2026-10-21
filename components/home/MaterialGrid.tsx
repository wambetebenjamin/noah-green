import Reveal from "@/components/Reveal";
import {
  Cpu,
  Leaf,
  Milk,
  Newspaper,
  Shirt,
  Drum,
  Wine,
} from "lucide-react";
import { MATERIALS, pointsPerKg } from "@/lib/materials";
import type { MaterialCode } from "@/lib/materials";

const ICONS: Record<MaterialCode, typeof Leaf> = {
  paper: Newspaper,
  plastic: Milk,
  glass: Wine,
  metal: Drum,
  ewaste: Cpu,
  organic: Leaf,
  textiles: Shirt,
};

export default function MaterialGrid() {
  return (
    <div className="row">
      {MATERIALS.map((material, index) => {
        const Icon = ICONS[material.code];
        return (
          <div className="col-md-6 col-lg-4 mb-4" key={material.code}>
            <Reveal delay={index * 0.08}>
              <div
                className="ng-material-card"
                style={{ ["--ng-card-accent" as never]: material.color }}
              >
                <div className="ng-material-icon">
                  <Icon size={26} aria-hidden="true" />
                </div>
                <h3 className="h5" style={{ color: "#33313b" }}>
                  {material.name}
                </h3>
                <div style={{ fontSize: 12, color: "#6c757d", marginBottom: 10 }}>
                  {material.binLabel}
                </div>
                <strong style={{ fontSize: 13, color: "#28a745" }}>What we accept</strong>
                <ul className="ng-accept-list list-unstyled mb-3">
                  {material.accepted.slice(0, 3).map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <strong style={{ fontSize: 13, color: "#dc3545" }}>What we cannot take</strong>
                <ul className="ng-reject-list list-unstyled mb-3">
                  {material.rejected.slice(0, 3).map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <span className="ng-points-chip">
                  {pointsPerKg(material.code)} points per kg
                </span>
              </div>
            </Reveal>
          </div>
        );
      })}
    </div>
  );
}
