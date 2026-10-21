import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { sendMail } from "@/lib/mailer";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10).max(2000),
  recaptchaToken: z.string().nullable().optional(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 422 });
  }
  const check = await verifyRecaptcha(parsed.data.recaptchaToken, "contact");
  if (!check.ok && check.challenge !== "v2-required") {
    return NextResponse.json({ error: "Human verification failed" }, { status: 403 });
  }
  await sendMail({
    to: "hello@noahgreen.co.ke",
    subject: `Noah Green message from ${parsed.data.name}`,
    text: `${parsed.data.message}\n\nReply to: ${parsed.data.email}`,
  });
  return NextResponse.json({ received: true });
}
