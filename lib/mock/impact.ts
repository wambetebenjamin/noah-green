import type { MaterialCode } from "@/lib/materials";

/**
 * City wide impact mock. Hardcoded realistic values, no external API.
 */
export const CURRENT_MONTH_LABEL = "October 2026";

export const KG_BY_MATERIAL_THIS_MONTH: {
  code: MaterialCode;
  name: string;
  kg: number;
  color: string;
}[] = [
  { code: "organic", name: "Organic", kg: 22150, color: "#28a745" },
  { code: "paper", name: "Paper and Cardboard", kg: 18420, color: "#2b98f0" },
  { code: "plastic", name: "Plastic Bottles", kg: 12860, color: "#f3e53d" },
  { code: "glass", name: "Glass", kg: 7340, color: "#20c997" },
  { code: "metal", name: "Metal and Tin", kg: 4910, color: "#6c757d" },
  { code: "textiles", name: "Textiles", kg: 2640, color: "#343a40" },
  { code: "ewaste", name: "E-Waste", kg: 1280, color: "#fd7e14" },
];

export const MONTHLY_TOTALS_12M: { month: string; kg: number }[] = [
  { month: "Nov 25", kg: 38200 },
  { month: "Dec 25", kg: 41500 },
  { month: "Jan 26", kg: 39800 },
  { month: "Feb 26", kg: 44100 },
  { month: "Mar 26", kg: 47600 },
  { month: "Apr 26", kg: 49900 },
  { month: "May 26", kg: 52300 },
  { month: "Jun 26", kg: 55800 },
  { month: "Jul 26", kg: 58400 },
  { month: "Aug 26", kg: 62100 },
  { month: "Sep 26", kg: 65700 },
  { month: "Oct 26", kg: 69600 },
];

export const HOUSEHOLD_VS_BUSINESS = [
  { name: "Households", value: 58, color: "#2b98f0" },
  { name: "Businesses", value: 42, color: "#f3e53d" },
];

export const CITY_STATS = {
  totalKgThisMonth: 69600,
  co2OffsetKg: 48720,
  waterSavedLitres: 2140000,
  activeHouseholds: 4182,
  totalHouseholdsEnrolled: 5310,
  kgDivertedAllTime: 612400,
  activeZones: 24,
  treesPlanted: 963,
};

export function publicImpactPayload() {
  return {
    monthLabel: CURRENT_MONTH_LABEL,
    kgByMaterial: KG_BY_MATERIAL_THIS_MONTH,
    monthlyTotals: MONTHLY_TOTALS_12M,
    householdVsBusiness: HOUSEHOLD_VS_BUSINESS,
    stats: CITY_STATS,
  };
}
