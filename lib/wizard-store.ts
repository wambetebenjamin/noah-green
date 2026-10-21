import { create } from "zustand";
import type { MaterialCode } from "@/lib/materials";

export interface WizardState {
  step: number;
  accountType: "household" | "business";
  materials: Record<string, number>;
  date: string;
  slot: string;
  zone: string;
  address: string;
  gateNotes: string;
  name: string;
  phone: string;
  email: string;
  setStep: (step: number) => void;
  setAccountType: (t: "household" | "business") => void;
  setMaterialKg: (code: MaterialCode, kg: number) => void;
  setField: (
    field: "date" | "slot" | "zone" | "address" | "gateNotes" | "name" | "phone" | "email",
    value: string
  ) => void;
  reset: () => void;
}

export const TIME_SLOTS = [
  "08:00 to 10:00",
  "10:00 to 12:00",
  "12:00 to 14:00",
  "14:00 to 16:00",
  "16:00 to 18:00",
];

const initial = {
  step: 0,
  accountType: "household" as const,
  materials: {} as Record<string, number>,
  date: "",
  slot: "",
  zone: "",
  address: "",
  gateNotes: "",
  name: "",
  phone: "",
  email: "",
};

export const useWizard = create<WizardState>((set) => ({
  ...initial,
  setStep: (step) => set({ step }),
  setAccountType: (accountType) => set({ accountType }),
  setMaterialKg: (code, kg) =>
    set((state) => {
      const next = { ...state.materials };
      if (kg <= 0) delete next[code];
      else next[code] = kg;
      return { materials: next };
    }),
  setField: (field, value) => set({ [field]: value } as Partial<WizardState>),
  reset: () => set({ ...initial, materials: {} }),
}));
