import type { MaterialCode } from "@/lib/materials";
import { MATERIALS, pointsPerKg } from "@/lib/materials";

export interface HistoryPickup {
  ref: string;
  date: string;
  materials: { code: MaterialCode; kg: number }[];
  kgTotal: number;
  points: number;
  status: "completed";
}

export interface RedemptionSeed {
  id: string;
  rewardType: "mpesa" | "partner" | "tree";
  points: number;
  createdAt: string;
  detail: string;
}

function hashSeed(email: string): number {
  let h = 0;
  for (let i = 0; i < email.length; i += 1) {
    h = (h << 5) - h + email.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/**
 * Deterministic demo history per account so every member sees a believable
 * twelve month trail, points balance and impact stats in their dashboard.
 * Live pickups and redemptions from the store are merged on top of this.
 */
export function seedHistory(email: string): HistoryPickup[] {
  const seed = hashSeed(email);
  const months = [
    "2025-11", "2025-12", "2026-01", "2026-02", "2026-03", "2026-04",
    "2026-05", "2026-06", "2026-07", "2026-08", "2026-09", "2026-10",
  ];
  const history: HistoryPickup[] = [];
  months.forEach((month, index) => {
    const pickupsInMonth = 1 + ((seed + index) % 2);
    for (let p = 0; p < pickupsInMonth; p += 1) {
      const lineCount = 2 + ((seed + index + p) % 3);
      const materials: { code: MaterialCode; kg: number }[] = [];
      for (let m = 0; m < lineCount; m += 1) {
        const mat = MATERIALS[(seed + index * 3 + p * 2 + m) % MATERIALS.length];
        const kg = 3 + ((seed + index * 5 + p * 7 + m * 11) % 18);
        const existing = materials.find((x) => x.code === mat.code);
        if (existing) existing.kg += kg;
        else materials.push({ code: mat.code, kg });
      }
      const kgTotal = materials.reduce((s, x) => s + x.kg, 0);
      const points = materials.reduce(
        (s, x) => s + Math.round(x.kg * pointsPerKg(x.code)),
        0
      );
      const day = 4 + ((seed + index * 2 + p * 9) % 22);
      history.push({
        ref: `NG-H${String(seed % 900 + index * 37 + p).padStart(4, "0")}`,
        date: `${month}-${String(day).padStart(2, "0")}`,
        materials,
        kgTotal,
        points,
        status: "completed",
      });
    }
  });
  return history.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function seedRedemptions(email: string): RedemptionSeed[] {
  const seed = hashSeed(email);
  const out: RedemptionSeed[] = [];
  if (seed % 2 === 0) {
    out.push({
      id: `RD-SEED-${seed % 900}-1`,
      rewardType: "mpesa",
      points: 500,
      createdAt: "2026-06-14T09:20:00.000Z",
      detail: "M-Pesa cash out, KES 250 sent to registered number",
    });
  }
  out.push({
    id: `RD-SEED-${seed % 900}-2`,
    rewardType: "tree",
    points: 1000,
    createdAt: "2026-04-22T11:05:00.000Z",
    detail: "One indigenous tree planted in Ngong Hills Forest in your name",
  });
  if (seed % 3 === 0) {
    out.push({
      id: `RD-SEED-${seed % 900}-3`,
      rewardType: "partner",
      points: 300,
      createdAt: "2026-08-02T15:40:00.000Z",
      detail: "GreenLeaf Cafe voucher, 20 percent off any meal",
    });
  }
  return out;
}

export function seedImpactTotals(email: string): {
  totalKg: number;
  co2Kg: number;
  trees: number;
} {
  const history = seedHistory(email);
  const totalKg = history.reduce((s, h) => s + h.kgTotal, 0);
  return {
    totalKg,
    co2Kg: Math.round(totalKg * 0.7),
    trees: 1 + (hashSeed(email) % 3),
  };
}
