import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { sendMail } from "@/lib/mailer";

const schema = z.object({
  organisation: z.string().min(2),
  contactName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(9).max(20),
  premisesType: z.enum(["office", "estate", "hotel", "factory"]),
  monthlyVolumeKg: z.number().positive().max(500000),
  message: z.string().max(2000).optional().default(""),
  recaptchaToken: z.string().nullable().optional(),
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
  const check = await verifyRecaptcha(parsed.data.recaptchaToken, "corporate_enquiry");
  if (!check.ok && check.challenge !== "v2-required") {
    return NextResponse.json({ error: "Human verification failed" }, { status: 403 });
  }
  const data = parsed.data;
  await sendMail({
    to: "corporate@noahgreen.co.ke",
    subject: `Corporate enquiry: ${data.organisation}`,
    text:
      `Organisation: ${data.organisation}\nContact: ${data.contactName}\n` +
      `Email: ${data.email}\nPhone: ${data.phone}\n` +
      `Premises: ${data.premisesType}\nEstimated monthly volume: ${data.monthlyVolumeKg} kg\n` +
      `Notes: ${data.message || "None"}`,
  });
  return NextResponse.json({ received: true });
}
