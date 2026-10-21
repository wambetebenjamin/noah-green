import type { MaterialCode } from "@/lib/materials";

export interface GuideCopy {
  mistakes: string;
  why: string;
  intro: string;
}

export const GUIDE_EXTRA: Record<MaterialCode, GuideCopy> = {
  paper: {
    intro:
      "Paper is the heaviest stream in most Nairobi homes. Keep it dry and flat and it earns well.",
    mistakes:
      "The common mistake is bundling paper with food waste. One greasy sufuria wrapper can spoil a whole bale, and the buyer rejects it.",
    why:
      "Clean paper is remade into cartons and exercise books within weeks. Recycling one tonne of paper saves around 17 trees and thousands of litres of water.",
  },
  plastic: {
    intro:
      "Bottles and jerrycans are the most valuable household plastic. Rinse them, squash them, keep the caps.",
    mistakes:
      "People mix plastic bags into the bottle bag. Bags jam the baling machine and slow the whole route down.",
    why:
      "Sorted PET becomes fibre for carpets, brushes and new bottles. Every kilogram kept out of the Nairobi river system also keeps a drain open in the rains.",
  },
  glass: {
    intro:
      "Glass never loses quality. It can be melted and remade forever, so it is worth collecting even in small amounts.",
    mistakes:
      "The common mistake is throwing in window glass and mirrors. They melt at a different temperature and ruin the furnace batch.",
    why:
      "Recycled glass cuts furnace energy by up to 30 percent and removes sharp waste from dump sites where children and animals walk.",
  },
  metal: {
    intro:
      "Metal is the highest paying everyday stream. Tins, cans and foil are all welcome.",
    mistakes:
      "Aerosol cans and gas cylinders are the dangerous mistake. They can explode in the press. Keep them out, always.",
    why:
      "Aluminium remade from cans uses about 5 percent of the energy of new metal. That is why metal pays the most points per kilogram.",
  },
  ewaste: {
    intro:
      "Old phones, cables and small appliances hold gold, copper and cobalt. Handle them with care and they are a treasure stream.",
    mistakes:
      "The common mistake is dumping e-waste in the general bin, where batteries leak lead and mercury into the soil.",
    why:
      "Proper e-waste recycling recovers rare metals and keeps toxins away from groundwater. It is the safest kilogram we collect.",
  },
  organic: {
    intro:
      "Food and garden waste is the biggest share of Nairobi household waste. We compost it into soil for urban farms.",
    mistakes:
      "The common mistake is bagging organics in plastic. Empty the bucket loose or in a paper bag so the compost stays clean.",
    why:
      "Composting food waste avoids methane from the dump site and returns nutrients to farms around the county.",
  },
  textiles: {
    intro:
      "Clean clothes find a second owner. Damaged fabric becomes wiping cloth and insulation.",
    mistakes:
      "The common mistake is donating wet fabric. Mould spreads through the whole sack and destroys good pieces.",
    why:
      "Every reused kilogram of clothing saves the water and dye of making something new, and keeps mitumba quality high.",
  },
};
