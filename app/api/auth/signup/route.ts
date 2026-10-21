import { NextResponse } from "next/server";
import { z } from "zod";
import { createUser } from "@/lib/store";
import { hashPassword } from "@/lib/auth";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { sendMail } from "@/lib/mailer";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(9).max(20),
  password: z.string().min(8, "Use at least 8 characters"),
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
  const check = await verifyRecaptcha(parsed.data.recaptchaToken, "signup");
  if (!check.ok && check.challenge !== "v2-required") {
    return NextResponse.json({ error: "Human verification failed" }, { status: 403 });
  }
  const data = parsed.data;
  const email = data.email.toLowerCase();
  const created = await createUser({
    email,
    name: data.name,
    phone: data.phone,
    passwordHash: hashPassword(data.password, email),
    createdAt: new Date().toISOString(),
  });
  if (!created) {
    return NextResponse.json(
      { error: "An account with this email already exists. Sign in instead." },
      { status: 409 }
    );
  }
  await sendMail({
    to: email,
    subject: "Karibu Noah Green, your account is ready",
    text:
      `Hello ${data.name},\n\nYour Noah Green account is live. Schedule your first pickup and start earning points for every kilogram you recycle.\n\nSort it. Schedule it. Save the city.`,
  });
  return NextResponse.json({ created: true, email });
}
