export const SITE = {
  name: "Noah Green",
  tagline: "Sort it. Schedule it. Save the city.",
  description:
    "Waste collection, sorting and recycling for Nairobi homes and businesses. Schedule a pickup, track your recycling impact and earn reward points.",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "254112272061",
  whatsappMessage:
    "Hello Noah Green, I would like to schedule a waste pickup or ask about recycling services.",
  email: "hello@noahgreen.co.ke",
  address: "Green House, Chaka Road, Kilimani, Nairobi",
  consentKey: "noah_green_consent",
  voiceTourKey: "noah_green_voice_tour",
  lastPickupKey: "noah_green_last_pickup",
} as const;

export const WHATSAPP_URL = `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(
  SITE.whatsappMessage
)}`;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
