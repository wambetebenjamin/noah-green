export type MaterialCode =
  | "paper"
  | "plastic"
  | "glass"
  | "metal"
  | "ewaste"
  | "organic"
  | "textiles";

export interface MaterialInfo {
  code: MaterialCode;
  name: string;
  /** Sorting category colour. All values come from the zip palette. */
  color: string;
  envKey?: string;
  defaultPointsPerKg: number;
  accepted: string[];
  rejected: string[];
  binLabel: string;
}

export const MATERIALS: MaterialInfo[] = [
  {
    code: "paper",
    name: "Paper and Cardboard",
    color: "#2b98f0",
    envKey: "POINTS_PER_KG_PAPER",
    defaultPointsPerKg: 8,
    binLabel: "Blue bin",
    accepted: [
      "Newspapers, magazines and office paper",
      "Carton boxes, flattened and dry",
      "Egg trays and paper packaging",
      "Books and exercise books without hard covers",
    ],
    rejected: [
      "Greasy pizza boxes and food stained paper",
      "Waxed or plastic coated paper",
      "Used tissues and diapers",
      "Paper soaked by rain",
    ],
  },
  {
    code: "plastic",
    name: "Plastic Bottles",
    color: "#f3e53d",
    envKey: "POINTS_PER_KG_PLASTIC",
    defaultPointsPerKg: 12,
    binLabel: "Yellow bin",
    accepted: [
      "PET water and soda bottles, rinsed",
      "HDPE jerrycans and detergent bottles",
      "Bottle caps collected separately",
      "Clean plastic food containers",
    ],
    rejected: [
      "Plastic bags and wrappers",
      "Styrofoam and foam trays",
      "PVC pipes and fittings",
      "Bottles with liquid still inside",
    ],
  },
  {
    code: "glass",
    name: "Glass",
    color: "#20c997",
    envKey: "POINTS_PER_KG_GLASS",
    defaultPointsPerKg: 6,
    binLabel: "Green bin",
    accepted: [
      "Glass bottles of any colour",
      "Glass jars with lids removed",
      "Clean broken glass wrapped and labelled",
    ],
    rejected: [
      "Window panes and mirrors",
      "Light bulbs and fluorescent tubes",
      "Ceramics, plates and cups",
      "Pyrex and oven glass",
    ],
  },
  {
    code: "metal",
    name: "Metal and Tin",
    color: "#6c757d",
    envKey: "POINTS_PER_KG_METAL",
    defaultPointsPerKg: 15,
    binLabel: "Grey bin",
    accepted: [
      "Aluminium cans and beverage tins",
      "Steel food tins, rinsed",
      "Copper offcuts and clean wiring",
      "Aluminium foil balled up",
    ],
    rejected: [
      "Paint and chemical cans with residue",
      "Gas cylinders and pressurised cans",
      "Batteries of any size",
      "Metal mixed with rubber or foam",
    ],
  },
  {
    code: "ewaste",
    name: "E-Waste",
    color: "#fd7e14",
    envKey: "POINTS_PER_KG_EWASTE",
    defaultPointsPerKg: 40,
    binLabel: "Orange crate",
    accepted: [
      "Old phones, laptops and chargers",
      "Cables, routers and small appliances",
      "Printers and computer parts",
      "Batteries taped at the terminals",
    ],
    rejected: [
      "Fridges and air conditioners with gas",
      "Cracked cathode ray tube screens",
      "Loose lithium batteries that are swollen",
    ],
  },
  {
    code: "organic",
    name: "Organic Waste",
    color: "#28a745",
    defaultPointsPerKg: 4,
    binLabel: "Brown bin",
    accepted: [
      "Fruit and vegetable peelings",
      "Tea leaves and coffee grounds",
      "Garden trimmings and leaves",
      "Leftover food without packaging",
    ],
    rejected: [
      "Cooking oil in open containers",
      "Pet waste and litter",
      "Dustpan sweepings with plastic",
    ],
  },
  {
    code: "textiles",
    name: "Textiles",
    color: "#343a40",
    defaultPointsPerKg: 10,
    binLabel: "Purple sack",
    accepted: [
      "Clean clothes in reusable condition",
      "Bed sheets, curtains and towels",
      "Shoes tied in pairs",
      "Offcuts from tailors, dry and clean",
    ],
    rejected: [
      "Wet or mouldy fabric",
      "Mattresses and foam",
      "Clothes soaked in paint or oil",
    ],
  },
];

const ENV_KEYS: Partial<Record<MaterialCode, string>> = {
  paper: "POINTS_PER_KG_PAPER",
  plastic: "POINTS_PER_KG_PLASTIC",
  glass: "POINTS_PER_KG_GLASS",
  metal: "POINTS_PER_KG_METAL",
  ewaste: "POINTS_PER_KG_EWASTE",
};

export function pointsPerKg(code: MaterialCode): number {
  const info = MATERIALS.find((m) => m.code === code);
  if (!info) return 0;
  const envKey = ENV_KEYS[code];
  if (envKey && typeof process !== "undefined") {
    const raw = process.env[envKey];
    const parsed = Number(raw);
    if (raw && Number.isFinite(parsed) && parsed > 0) return parsed;
  }
  return info.defaultPointsPerKg;
}

export function materialByCode(code: MaterialCode): MaterialInfo | undefined {
  return MATERIALS.find((m) => m.code === code);
}

export function estimatePoints(
  lines: { code: MaterialCode; kg: number }[]
): number {
  return lines.reduce(
    (total, line) => total + Math.round(line.kg * pointsPerKg(line.code)),
    0
  );
}
