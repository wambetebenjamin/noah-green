import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { sendMail } from "@/lib/mailer";
import { estimatePoints, MATERIALS } from "@/lib/materials";
import { COVERAGE_ZONES } from "@/lib/zones";
import { makeRef, savePickup } from "@/lib/store";
import { TIME_SLOTS } from "@/lib/wizard-store";

const materialCodes = MATERIALS.map((m) => m.code) as [string, ...string[]];

const schema = z.object({
  accountType: z.enum(["household", "business"]),
  materials: z
    .array(
      z.object({
        code: z.enum(materialCodes),
        kg: z.number().positive().max(5000),
      })
    )
    .min(1, "Select at least one material"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  slot: z.string().refine((s) => TIME_SLOTS.includes(s), "Unknown time slot"),
  zone: z.string().refine((s) => COVERAGE_ZONES.includes(s), "Zone not served yet"),
  address: z.string().min(6),
  gateNotes: z.string().max(500).optional().default(""),
  name: z.string().min(2),
  phone: z.string().min(9).max(20),
  email: z.string().email(),
  recaptchaToken: z.string().nullable().optional(),
  recaptchaV2Token: z.string().nullable().optional(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }
  const data = parsed.data;

  const v3 = await verifyRecaptcha(data.recaptchaToken, "schedule_pickup");
  let captchaOk = v3.ok;
  if (!captchaOk && v3.challenge === "v2-required") {
    const v2 = await verifyRecaptcha(data.recaptchaV2Token);
    captchaOk = v2.ok;
    if (!captchaOk) {
      return NextResponse.json(
        { error: "Human verification failed", challenge: "v2-required" },
        { status: 403 }
      );
    }
  } else if (!captchaOk) {
    return NextResponse.json(
      { error: "Human verification failed", challenge: v3.challenge },
      { status: 403 }
    );
  }

  const pickupDate = new Date(`${data.date}T00:00:00Z`);
  if (Number.isNaN(pickupDate.getTime()) || pickupDate.getTime() < Date.now() - 86400000) {
    return NextResponse.json({ error: "Pickup date must be in the future" }, { status: 422 });
  }

  const ref = makeRef();
  const estimatedPoints = estimatePoints(
    data.materials.map((m) => ({ code: m.code as never, kg: m.kg }))
  );

  await savePickup({
    ref,
    email: data.email.toLowerCase(),
    name: data.name,
    phone: data.phone,
    accountType: data.accountType,
    materials: data.materials,
    date: data.date,
    slot: data.slot,
    zone: data.zone,
    address: data.address,
    gateNotes: data.gateNotes,
    status: "scheduled",
    createdAt: new Date().toISOString(),
    estimatedPoints,
  });

  const lines = data.materials
    .map((m) => {
      const info = MATERIALS.find((x) => x.code === m.code);
      return `${info?.name || m.code}: ${m.kg} kg`;
    })
    .join("\n");

  await sendMail({
    to: data.email,
    subject: `Noah Green pickup ${ref} confirmed`,
    text:
      `Hello ${data.name},\n\nYour Noah Green pickup is booked.\n` +
      `Reference: ${ref}\nDate: ${data.date}\nSlot: ${data.slot}\n` +
      `Zone: ${data.zone}\nAddress: ${data.address}\n` +
      (data.gateNotes ? `Gate notes: ${data.gateNotes}\n` : "") +
      `Materials:\n${lines}\nEstimated points: ${estimatedPoints}\n\n` +
      `Sort everything into the colour coded categories before the team arrives.\n` +
      `Questions on WhatsApp: +254 112 272 061\n\nSort it. Schedule it. Save the city.`,
  });

  return NextResponse.json({ ref, estimatedPoints, status: "scheduled" });
}
